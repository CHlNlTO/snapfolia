from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import torch
from PIL import Image
from transformers import AutoProcessor, AutoModelForZeroShotObjectDetection
from ultralytics import YOLO
import dill  # Explicitly import dill
import numpy as np
import sys
import platform
import time

app = Flask(__name__)

# Enable CORS
CORS(app)
uploaded_files = []
REQUEST_COUNTER = 0

# Initialize models and processor
def initialize_models():
    global yolov8_model, object_detection_model, processor, device
    yolov8_model_path = 'yolo_v8_v2.pt'
    print("Loading YOLOv8 model...")
    yolov8_model = load_yolov8_model(yolov8_model_path)

    object_detection_model_id = 'IDEA-Research/grounding-dino-tiny'
    print("Loading Grounding Dino model...")
    object_detection_model, processor, device = load_object_detection_model(object_detection_model_id)

# Load the object detection model (Grounding Dino)
def load_object_detection_model(model_id):
    if torch.cuda.is_available():
        print("cuda is available")
        print(f"CUDA version: {torch.version.cuda}")
        print(f"Python version: {platform.python_version()}")
    else:
        print("cuda is not available")
        
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    processor = AutoProcessor.from_pretrained(model_id)
    model = AutoModelForZeroShotObjectDetection.from_pretrained(model_id).to(device)
    model.eval()
    return model, processor, device

# Load the YOLOv8 model
def load_yolov8_model(model_path):
    import dill  # Ensure dill is imported within the function scope
    model = YOLO(model_path)
    print(f"Model is Ready...")
    return model

# Object detection using Grounding Dino
def detect_objects(image_path, object_detection_model, processor, device):
    print("Opening image...")
    image = Image.open(image_path).convert('RGB')

    print("Running object detection...")
    inputs = processor(images=image, text="a leaf. leaves.", return_tensors="pt").to(device)
    with torch.no_grad():
        outputs = object_detection_model(**inputs)
    
    print("Post-processing object detection...")
    results = processor.post_process_grounded_object_detection(
        outputs,
        inputs.input_ids,
        box_threshold=0.4,
        text_threshold=0.3,
        target_sizes=[image.size[::-1]]
    )
    
    return results

# Classification using YOLOv8
def classify_leaf(image_path, yolov8_model):
    image = Image.open(image_path).convert('RGB')
    print("<------------------------------------------------>")
    predict = yolov8_model(image)
    names_dict = predict[0].names
    probs = predict[0].probs.data.tolist()

    # Convert to key-value pairs and limit to two decimal places
    results = {names_dict[i]: round(probs[i], 2) for i in range(len(probs))}
    
    # Print the first 5 items
    for name, prob in list(results.items())[:5]:
        print(f"{name}:\t{prob}")

    predicted_class = names_dict[np.argmax(probs)]
    confidence = max(probs)
    
    return predicted_class, confidence

# Process uploaded image
def process_image(image_path, object_detection_model, processor, yolov8_model, device):
    results = detect_objects(image_path, object_detection_model, processor, device)
    
    # Check if any leaves are detected
    if results and "boxes" in results[0] and results[0]["boxes"].shape[0] > 0:
        predicted_class, confidence = classify_leaf(image_path, yolov8_model)
        
        return {
            "leaf_detected": True,
            "label": predicted_class,
            "confidence": confidence,
        }
        
    return {"leaf_detected": False}

def process_request(QUEUES: dict[str]):
    CURRENT_QUEUE = []
    
    total_processed = 0
    request_start_time = {}
    results = {}
    
    # for request in requests:
    #     # user_ip = request.get('user_ip')
    #     file_name = request.get('file')
    #     # QUEUES.append((user_ip, file_name))
    
    while QUEUES or CURRENT_QUEUE:
        # Fill the current queue
        while QUEUES:
            new_request = QUEUES.pop(0)
            CURRENT_QUEUE.append(new_request)
            request_identifier = (new_request[0].get('file').filename, ) 
            request_start_time[request_identifier] = time.time()
        
        print(f"\nPROCESSING CURRENT REQUEST: {CURRENT_QUEUE}")
    
        # Process each request in the current queue
        for request in CURRENT_QUEUE[:]:
            file = request[0].get('file')

            # elapsed_time = time.time() - request_start_time[request]
            # duration = 10  
            
            # if elapsed_time >= duration:
            #     print(f"Processing request {file_name} for IP {user_ip}... (Duration: {duration}s)")
            
            result = process_image(file, object_detection_model, processor, yolov8_model, device)
            
            print(f"RESULT: {result} ")
            CURRENT_QUEUE.remove(request)
            total_processed += 1
            
            results[request_identifier] = result
            
            # Store the result with the user_ip
            # if user_ip not in results:
            #     results[user_ip] = []
                
            # results[user_ip].append(result)            
        global REQUEST_COUNTER
        REQUEST_COUNTER += 1
        print(f"TOTAL REQUESTS PROCESSED: {REQUEST_COUNTER}")
        # print(f"REMAINING REQUESTS: {len(QUEUES) + len(CURRENT_QUEUE)}")
    
        print("--------------DONE PROCESSING ALL REQUESTS------------------------")
        return result

    
# Route for checking server status
@app.route('/')
def index():
    print("running...")
    return jsonify({'message': 'Server is running'})

# Route for uploading image and processing
@app.route('/upload', methods=['POST'])
def upload_file():
    QUEUES = []
    
    if 'file' not in request.files:
        print("No file part in request")  # Log if file part is missing
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        print("No selected file")  # Log if no file is selected
        return jsonify({'error': 'No selected file'}), 400
    
    user_ip = request.remote_addr or ""
    print("-------------------------------------------------")
    print(f"Connection established from IP: {user_ip}")  # Log IP address
    uploaded_files = [{'file': file} ]
    QUEUES.append(uploaded_files)


    result = process_request(QUEUES)#user ip = sxxxxxx fil = xxx
    
    print(f"RESULTTTTTTTTTTTT:{jsonify(result)}")
    return jsonify(result)


if __name__ == '__main__':
    initialize_models()
    app.run(host='0.0.0.0', port=5000, debug=False)
