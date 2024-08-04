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

BATCH_SIZE = 8
request_queue = Queue()
results = {}
REQUEST_COUNTER = 0

# Global variables for models
yolov8_model = None
object_detection_model = None
processor = None
device = None

# Log file path
LOG_FILE = 'server_log.json'


def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')
    
def log_to_json(message, level='info'):
    log_entry = {
        'timestamp': datetime.now().isoformat(),
        'level': level,
        'message': message
    }
    
    try:
        with open(LOG_FILE, 'r+') as file:
            try:
                logs = json.load(file)
            except json.JSONDecodeError:
                logs = []
            
            logs.append(log_entry)
            
            file.seek(0)
            json.dump(logs, file, indent=2)
            file.truncate()
    except FileNotFoundError:
        with open(LOG_FILE, 'w') as file:
            json.dump([log_entry], file, indent=2)

def initialize_models():
    global yolov8_model, object_detection_model, processor, device
    yolov8_model_path = 'yolo_v8_v2.pt'
    print("Loading YOLOv8 model...")
    yolov8_model = load_yolov8_model(yolov8_model_path)

    object_detection_model_id = 'IDEA-Research/grounding-dino-tiny'
    print("Loading Grounding Dino model...")
    object_detection_model, processor, device = load_object_detection_model(object_detection_model_id)

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
    print("Model is Ready...")
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

def classify_leaf(image_path, yolov8_model):
    image = Image.open(image_path).convert('RGB')
    print("<------------------------------------------------>")
    predict = yolov8_model(image)
    names_dict = predict[0].names
    probs = predict[0].probs.data.tolist()
    results = {names_dict[i]: round(probs[i], 2) for i in range(len(probs))}
    for name, prob in list(results.items())[:5]:
        print(f"{name}:\t{prob}")
    predicted_class = names_dict[np.argmax(probs)]
    confidence = max(probs)
    return predicted_class, confidence

def process_image(image_path, object_detection_model, processor, yolov8_model, device):
    results = detect_objects(image_path, object_detection_model, processor, device)
    if results and "boxes" in results[0] and results[0]["boxes"].shape[0] > 0:
        predicted_class, confidence = classify_leaf(image_path, yolov8_model)
        return {
            "leaf_detected": True,
            "label": predicted_class,
            "confidence": confidence,
        }
    return {"leaf_detected": False}

def process_request():
    global results, REQUEST_COUNTER
    while True:
        batch = []
        for _ in range(BATCH_SIZE):
            if not request_queue.empty():
                batch.append(request_queue.get())
            else:
                break
        if not batch:
            time.sleep(1)
            continue
        for file_path, request_id in batch:
            result = process_image(file_path, object_detection_model, processor, yolov8_model, device)
            results[request_id] = result
            REQUEST_COUNTER += 1
            print(f"-->REQUEST COUNTER: {REQUEST_COUNTER}<--")
        for _ in range(len(batch)):
            request_queue.task_done()
        for file_path, _ in batch:
            os.remove(file_path)
            os.rmdir(os.path.dirname(file_path))

@app.route('/')
def index():
    print("Server is running...")
    return jsonify({'message': 'Server is running'})

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        print("No file part in request", level='error')
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        print("No selected file", level='error')
        return jsonify({'error': 'No selected file'}), 400
    
    temp_dir = tempfile.mkdtemp()
    temp_file_path = os.path.join(temp_dir, file.filename)
    file.save(temp_file_path)
    
    request_id = str(time.time())
    request_queue.put((temp_file_path, request_id))
    
    while request_id not in results:
        time.sleep(0.1)
    result = results.pop(request_id)
    return jsonify(result)

if __name__ == '__main__':
    initialize_models()
    processing_thread = Thread(target=process_request)
    processing_thread.daemon = True
    processing_thread.start()
    app.run(host='0.0.0.0', port=5000, debug=False)