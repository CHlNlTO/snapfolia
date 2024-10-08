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
CORS(app, resources={r"/*": {"origins": "https://trees.firstasia.edu.ph", "supports_credentials": True}})

# Global variables for queueing
BATCH_SIZE = 10
request_queue = Queue()
results = {}

# Global variables for models
yolov8_model = None
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

# Initialize model
def initialize_model():
    global yolov8_model, device
    yolov8_model_path = 'best36_class.pt'
    print("Loading YOLOv8 model...")
    yolov8_model = load_yolov8_model(yolov8_model_path)

    if torch.cuda.is_available():
        print("CUDA is available")
        print(f"CUDA version: {torch.version.cuda}")
        print(f"Python version: {platform.python_version()}")
        device = torch.device('cuda')
    else:
        print("CUDA is not available")
        device = torch.device('cpu')

    print("--- Model Ready ---")


def load_yolov8_model(model_path):
    model = YOLO(model_path)
    print("YOLOV8 Ready...")
    return model


# Combined detection and classification using YOLOv8
def detect_and_classify_leaf(image, yolov8_model):    
    global predicted_class, confidence
    
    print("<------------------------------------------------>")
    print("DETECTING AND CLASSIFYING LEAF...")
    results = yolov8_model(image)
    
    if len(results) > 0 and len(results[0].boxes) > 0:
        # Leaf detected
        box = results[0].boxes[0]  # Get the first detected box
        predicted_class = results[0].names[int(box.cls)]
        confidence = round(float(box.conf), 2)
        print(f"Confidence Level: {confidence}")
        
        return {
            "leaf_detected": True,
            "label": predicted_class,
            "confidence": confidence,
        }
    else:
        # No leaf detected
        return {"leaf_detected": False}

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

def process_image(file, yolov8_model):
    # Convert the image to JPG
    jpg_image = convert_to_jpg(file)
    
    # Perform detection and classification
    result = detect_and_classify_leaf(jpg_image, yolov8_model)
    
    return result

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
            result = process_image(file, yolov8_model)
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
    initialize_model()

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
