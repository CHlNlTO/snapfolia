from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from PIL import Image
from transformers import AutoProcessor, AutoModelForZeroShotObjectDetection
from ultralytics import YOLO
import numpy as np
import platform
import time
from queue import Queue
from threading import Thread
import os
from datetime import datetime
import csv
import io
import pillow_heif

app = Flask(__name__)
CORS(app)

# Global variables for queueing
BATCH_SIZE = 50
request_queue = Queue()
results = {}

# Global variables for models
yolov8_model = None
object_detection_model = None
processor = None
device = None

# Global variables for logs
predicted_class = None
confidence = 0 

def logs(predicted_class, confidence, scan_time, log_file='logs.csv'):
    now = datetime.now()
    log_entry = {
        'date': now.strftime('%Y/%m/%d'),
        'time': now.strftime('%H:%M:%S'),
        'predicted_class': predicted_class,
        'confidence': confidence,
        'scan_time': scan_time
    }
    
    file_exists = os.path.isfile(log_file)

    with open(log_file, mode='a', newline='') as file:
        fieldnames = ['date', 'time', 'predicted_class', 'confidence', 'scan_time']
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        
        if not file_exists:
            writer.writeheader()
        
        writer.writerow(log_entry)

# Initialize models and processor
def initialize_models():
    global yolov8_model, object_detection_model, processor, device
    yolov8_model_path = 'yolo_v8_v2.pt'
    print("Loading YOLOv8 model...")
    yolov8_model = load_yolov8_model(yolov8_model_path)

    object_detection_model_id = 'grounding-dino-tiny'
    print("Loading Grounding Dino model...")
    object_detection_model, processor, device = load_object_detection_model(object_detection_model_id)

    print("--- Models Ready ---")

# Load the object detection model (Grounding Dino)
def load_object_detection_model(model_id):
    if torch.cuda.is_available():
        print("CUDA is available")
        print(f"CUDA version: {torch.version.cuda}")
        print(f"Python version: {platform.python_version()}")
    else:
        print("CUDA is not available")
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    processor = AutoProcessor.from_pretrained(model_id)
    model = AutoModelForZeroShotObjectDetection.from_pretrained(model_id).to(device)
    model.eval()
    return model, processor, device

def load_yolov8_model(model_path):
    model = YOLO(model_path)
    print("YOLOV8 Ready...")
    return model

def detect_objects(image_bytes, object_detection_model, processor, device):
    print("Opening image...")
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    print("Running object detection...")
    inputs = processor(images=image, text="a leaf. leaves.", return_tensors="pt").to(device)
    
    with torch.no_grad():
        outputs = object_detection_model(**inputs)
    print("Post-processing object detection...")
    results = processor.post_process_grounded_object_detection(
        outputs, inputs.input_ids, box_threshold=0.4, text_threshold=0.3, target_sizes=[image.size[::-1]]
    )
    return results


# Classification using YOLOv8
def classify_leaf(image, yolov8_model):    
    global predicted_class, confidence
    
    print("<------------------------------------------------>")
    print("CLASSIFYING LEAF...")
    predict = yolov8_model(image)
    names_dict = predict[0].names
    probs = predict[0].probs.data.tolist()
        
    predicted_class = names_dict[np.argmax(probs)]
    confidence = round(max(probs), 2)  

    return predicted_class, confidence

def convert_to_jpg(file):
    try:
        # Read the file content
        file_content = file.read()
        file.seek(0)  # Reset file pointer to the beginning

        # Check if it's a HEIC file
        if file.filename.lower().endswith('.heic'):
            # Use pillow_heif to read HEIC file
            heif_file = pillow_heif.read_heif(io.BytesIO(file_content))
            image = Image.frombytes(
                heif_file.mode, 
                heif_file.size, 
                heif_file.data,
                "raw",
                heif_file.mode,
                heif_file.stride,
            )
        else:
            # For other formats, use PIL directly
            image = Image.open(io.BytesIO(file_content))

        # Convert to RGB mode if it's not already (this handles RGBA images)
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        print(f"Converted {file.filename} to JPG")
        return image
    except Exception as e:
        print(f"Error converting {file.filename} to JPG: {str(e)}")
        raise



def process_image(file, object_detection_model, processor, yolov8_model, device):
    # Convert the image to JPG
    jpg_image = convert_to_jpg(file)
    
    # Create a byte stream for the image
    img_byte_arr = io.BytesIO()
    jpg_image.save(img_byte_arr, format='JPEG')
    img_byte_arr = img_byte_arr.getvalue()

    results = detect_objects(img_byte_arr, object_detection_model, processor, device)
    if results and "boxes" in results[0] and results[0]["boxes"].shape[0] > 0:
        predicted_class, confidence = classify_leaf(jpg_image, yolov8_model)

        return {
            "leaf_detected": True,
            "label": predicted_class,
            "confidence": confidence,
        }
        
    return {"leaf_detected": False}

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
            result = process_image(file, object_detection_model, processor, yolov8_model, device)
            results[request_id] = result
            
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
    
    request_id = str(time.time()) 
    request_queue.put((file, request_id))
    
    # Wait for the result
    while request_id not in results:
        time.sleep(0.1)
        
    result = results.pop(request_id)
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
            
        except ValueError:
            print("Invalid scan_time value received")
    return jsonify({'success': 'Time Received'}), 200
    

if __name__ == '__main__':
    initialize_models()
    
    # Start the processing thread
    processing_thread = Thread(target=process_request)
    processing_thread.daemon = True
    processing_thread.start()
    
    app.run(host='0.0.0.0', port=5000, debug=False)
