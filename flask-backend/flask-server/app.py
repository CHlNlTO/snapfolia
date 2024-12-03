from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from PIL import Image, UnidentifiedImageError
import imageio.v3 as iio 
from transformers import AutoProcessor, AutoModelForZeroShotObjectDetection
from ultralytics import YOLO
import time
from queue import Queue
from threading import Thread
import io
from pillow_heif import read_heif 
import logging
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Directory to save uploaded images
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

CUSTOM_CACHE_DIR = os.path.join(os.getcwd(), './cache')
os.makedirs(CUSTOM_CACHE_DIR, exist_ok=True)
os.environ['TRANSFORMERS_CACHE'] = CUSTOM_CACHE_DIR

# Global variables for queueing
BATCH_SIZE = 10
request_queue = Queue()
results = {}

# Global variables for models
yolov8_model = None
grounding_dino_model = None
grounding_dino_processor = None
device = None

# Global variables for logs
predicted_class = None
confidence = 0 

# Set up logging configuration
logging.basicConfig(
    filename='logs.csv',
    level=logging.INFO,
    format='%(asctime)s,%(levelname)s,%(message)s',
    datefmt='%Y/%m/%d %H:%M:%S'
)

def logs(predicted_class, confidence, scan_time):
    log_message = f"{predicted_class},{confidence},{scan_time}"
    # Log the message
    logging.info(log_message)
    
    # Create a formatter to generate the log message in the same format as the file
    formatter = logging.Formatter('%(asctime)s,%(levelname)s,%(message)s', datefmt='%Y/%m/%d %H:%M:%S')
    log_record = logging.makeLogRecord({
        'levelno': logging.INFO,
        'levelname': 'INFO',
        'msg': log_message,
        'asctime': formatter.formatTime(logging.makeLogRecord({}), '%Y/%m/%d %H:%M:%S')
    })
    # Print the formatted log message
    print(formatter.format(log_record))

def initialize_models():
    global yolov8_model, grounding_dino_model, grounding_dino_processor, device
    print("Initializing models...")

    if torch.cuda.is_available():
        device = torch.device('cuda')
        print(f"Using CUDA: {torch.version.cuda}")
    else:
        device = torch.device('cpu')
        print("CUDA not available, using CPU.")
        
    # YOLOv8 model
    yolov8_model_path = 'best36_class.pt'
    yolov8_model = YOLO(yolov8_model_path)
    print("YOLOv8 model loaded.")

    # Grounding DINO model
    print("Loading Grounding Dino.")
    grounding_dino_model_id = 'IDEA-Research/grounding-dino-tiny'
    grounding_dino_processor = AutoProcessor.from_pretrained(grounding_dino_model_id, cache_dir=CUSTOM_CACHE_DIR)
    grounding_dino_model = AutoModelForZeroShotObjectDetection.from_pretrained(
        grounding_dino_model_id, cache_dir=CUSTOM_CACHE_DIR
    ).to(device)
    grounding_dino_model.eval()
    
    print(f"Grounding DINO model loaded with cache at {CUSTOM_CACHE_DIR}.")


    print("Models initialized successfully.")

def detect_objects_with_dino(image, model, processor):
    inputs = processor(
        images=image,
        text=" a leaf. leaves. ",
        return_tensors="pt"
    ).to(device) 

    with torch.no_grad():
        outputs = model(**inputs)
    
    results = processor.post_process_grounded_object_detection(
        outputs,
        inputs.input_ids,
        box_threshold=0.4,
        text_threshold=0.3,
        target_sizes=[image.size[::-1]]
    )
    
    return results

        
def detect_and_classify_leaf(image, yolov8_model):
    print("Detecting & Classifying Leaf...")
    results = yolov8_model(image)
    
    if len(results) > 0 and len(results[0].boxes) > 0:
        predictions = []
        for box in results[0].boxes:
            predicted_class = results[0].names[int(box.cls)]
            confidence = round(float(box.conf), 2)
            predictions.append((predicted_class, confidence))
        
        predictions.sort(key=lambda x: x[1], reverse=True)

        print()
        print("\nTop 3 Predictions:")
        for i in range(min(3, len(predictions))):
            predicted_class, confidence = predictions[i]
            print(f"{i+1}. {predicted_class} - Confidence: {confidence}")
        print()

        return {
            "leaf_detected": True,
            "label": predicted_class,
            "confidence": confidence,
        }
        
    return {"leaf_detected": False}
        
    
def convert_to_jpg(file):
    try:
        # Read the file content
        file_content = file.read()
        file.seek(0)  # Reset file pointer to the beginning

        # Check for HEIC format
        if file.filename.lower().endswith('.heic'):
            heif_file = read_heif(io.BytesIO(file_content))
            image = Image.frombytes(
                heif_file.mode, 
                heif_file.size, 
                heif_file.data, 
                "raw", 
                heif_file.mode, 
                heif_file.stride
            )
        # Check for AVIF format
        elif file.filename.lower().endswith('.avif'):
            # Use imageio to read AVIF and convert to a PIL Image
            avif_image = iio.imread(io.BytesIO(file_content))
            image = Image.fromarray(avif_image)
        else:
            # For other formats, use PIL directly
            image = Image.open(io.BytesIO(file_content))

        # Convert to RGB mode if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        print(f"Converted {file.filename} to JPG")
        return image

    except UnidentifiedImageError as e:
        print(f"Error: Cannot identify image file {file.filename} - {e}")
        return None
    except Exception as e:
        print(f"Error converting {file.filename} to JPG: {e}")
        return None

def process_image(file):
    print()
    print("Processing Image...")
    image = convert_to_jpg(file)

    dino_results = detect_objects_with_dino(image, grounding_dino_model, grounding_dino_processor)
    if not dino_results or "boxes" not in dino_results[0] or dino_results[0]["boxes"].shape[0] == 0:
        return {"leaf_detected": False}

    yolov8_results = detect_and_classify_leaf(image, yolov8_model)
    return yolov8_results

def process_request():
    
    global results
    while True:
        batch = []
        
        # Collect a batch of requests
        for _ in range(BATCH_SIZE):
            if not request_queue.empty():
                batch.append(request_queue.get())
            else:
                break
                
        if not batch:
            time.sleep(1)  # Wait if queue is empty
            continue
            
        # Process the batch
        for file, request_id in batch:
            results[request_id] = process_image(file)
            
        # Signal that batch processing is complete
        for _ in range(len(batch)):
            request_queue.task_done()

@app.route('/')
def index():
    print("Server is running...")
    return jsonify({'message': 'Server is running'})

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        print("No file part in request")
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        print("No selected file")
        return jsonify({'error': 'No selected file'}), 400

    # Add file to the processing queue
    request_id = str(time.time())
    request_queue.put((file, request_id))

    # Wait for the result
    while request_id not in results:
        time.sleep(0.1)

    # Retrieve the processing result
    result = results.pop(request_id)

    if result.get("leaf_detected"):
        confidence = result.get("confidence", 0)
        if confidence < 0.9:
            # Use the confidence score to create the file name
            file_name = f"{confidence:.2f}_{secure_filename(file.filename)}"
            file_path = os.path.join('uploads', file_name)
            file.seek(0)
            file.save(file_path)
            print(f"Leaf image saved to {file_path}")
    else:
        print("No leaf detected. Image not saved.")

    return jsonify(result)


@app.route('/scan-time', methods=['POST'])
def getScanTime():    
    global predicted_class, confidence
    
    scan_time = request.form.get('time')
    if scan_time:
        try:
            scan_time = float(scan_time)
            print(f"Scan time received: {scan_time} seconds")
            logs(predicted_class, confidence, scan_time)
            print("--------------------------------------------")
            
        except ValueError:
            print("Invalid scan_time value received")
    return jsonify({'success': 'Time Received'}), 200


if __name__ == '__main__':

    initialize_models()
    
    # Start the processing thread
    processing_thread = Thread(target=process_request)
    processing_thread.daemon = True
    processing_thread.start()

    # Run the app without SSL (handled by Nginx)
    app.run(
        host='0.0.0.0',
        port=5000,
        ssl_context=("C:\\certificates\\treesbe.firstasia.edu.ph-crt.pem", "C:\\certificates\\treesbe.firstasia.edu.ph-key.pem"),
        debug=False
    )