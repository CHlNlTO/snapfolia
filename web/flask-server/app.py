from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from PIL import Image
from transformers import AutoProcessor, AutoModelForZeroShotObjectDetection
from ultralytics import YOLO
import numpy as np
import sys
import platform
import time
from queue import Queue
from threading import Thread
import tempfile
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Global variables for queueing
BATCH_SIZE = 8
request_queue = Queue()
results = {}

# Global variables for models
yolov8_model = None
object_detection_model = None
processor = None
device = None

def log_to_json(predicted_class, confidence, client_ip, request_counter, log_file='server_log.json'):
    log_entry = {
        'request_counter': request_counter,
        'timestamp': datetime.now().strftime('%Y/%m/%d %H:%M:%S'),
        'client_ip': client_ip,
        'predicted_class': predicted_class,
        'confidence': confidence,
    }
    
    try:
        with open(log_file, 'r+') as file:
            try:
                logs = json.load(file)
            except json.JSONDecodeError:
                logs = []
            
            logs.append(log_entry)
            
            file.seek(0)
            json.dump(logs, file, indent=2)
            file.truncate()
            
    except FileNotFoundError:
        with open(log_file, 'w') as file:
            json.dump([log_entry], file, indent=2)

# Initialize models and processor
def initialize_models():
    global yolov8_model, object_detection_model, processor, device
    yolov8_model_path = 'yolo_v8_v2.pt'
    print("Loading YOLOv8 model...")
    yolov8_model = load_yolov8_model(yolov8_model_path)

    object_detection_model_id = 'IDEA-Research/grounding-dino-tiny'
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

def detect_objects(image_path, object_detection_model, processor, device):
    print("Opening image...")
    image = Image.open(image_path).convert('RGB')
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
def classify_leaf(image_path, yolov8_model, client_ip, request_counter):    
    image = Image.open(image_path).convert('RGB')
    print("<------------------------------------------------>")
    print("CLASSIFYING LEAF...")
    predict = yolov8_model(image)
    names_dict = predict[0].names
    probs = predict[0].probs.data.tolist()
        
    predicted_class = names_dict[np.argmax(probs)]
    confidence = round(max(probs), 2)  

    log_to_json(predicted_class, confidence, client_ip, request_counter)
    return predicted_class, confidence

def process_image(image_path, object_detection_model, processor, yolov8_model, device, client_ip, request_counter):
    
    results = detect_objects(image_path, object_detection_model, processor, device)
    if results and "boxes" in results[0] and results[0]["boxes"].shape[0] > 0:
        predicted_class, confidence = classify_leaf(image_path, yolov8_model, client_ip, request_counter)

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
        for file, request_id, client_ip, request_counter in batch:
            result = process_image(file, object_detection_model, processor, yolov8_model, device, client_ip, request_counter)
            results[request_id] = result
            
        # Signal that batch processing is complete
        for _ in range(len(batch)):
            request_queue.task_done()

@app.route('/')
def index():
    print("Server is running...")
    return jsonify({'message': 'Server is running'})

# Route for uploading image and processing
@app.route('/upload', methods=['POST'])
def upload_file():
    request_counter = 0
    client_ip = request.remote_addr
    request_counter += 1

    if 'file' not in request.files:
        print("No file part in request")
        return jsonify({'error': 'No file part'}), 400
        
    file = request.files['file']
    if file.filename == '':
        print("No selected file")
        return jsonify({'error': 'No selected file'}), 400
    
    scan_time = request.form.get('scan_time')
    if scan_time:
        try:
            scan_time = float(scan_time) 
            print(f"Scan time received: {scan_time} seconds")
        except ValueError:
            print("Invalid scan_time value received")
        
    request_id = str(time.time()) 
    request_queue.put((file, request_id, client_ip, request_counter))
    
    # Wait for the result
    while request_id not in results:
        time.sleep(0.1)
        
    result = results.pop(request_id)
    return jsonify(result)


if __name__ == '__main__':
    initialize_models()
    
    # Start the processing thread
    processing_thread = Thread(target=process_request)
    processing_thread.daemon = True
    processing_thread.start()
    
    app.run(host='0.0.0.0', port=5000, debug=False)
