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

app = Flask(__name__)

# Enable CORS
CORS(app)
REQUEST_COUNTER = 0
IP_STATUS = {}

# Load the object detection model (Grounding Dino)
def load_object_detection_model(model_id):
    print("Initializing object detection model...")
    if torch.cuda.is_available():
        print("cuda is available")
        print(f"CUDA version: {torch.version.cuda}")
        print(f"Python version: {sys.version}")
    else:
        print("cuda is not available")
        
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    processor = AutoProcessor.from_pretrained(model_id)
    model = AutoModelForZeroShotObjectDetection.from_pretrained(model_id).to(device)
    model.eval()
    return model, processor, device

# Load the YOLOv8 model
def load_yolov8_model(model_path):
    print("Initializing YOLOv8 model...")
    import dill  # Ensure dill is imported within the function scope
    model = YOLO(model_path)
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
def classify_leaf(image_path, yolov8_model, user_ip):
    global REQUEST_COUNTER
    image = Image.open(image_path).convert('RGB')
    print(f"Classifying leaf for IP: {user_ip}...")
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
    
    # Update the status for this IP address
    IP_STATUS[user_ip] = {
        "completed": True,
        "predicted_class": predicted_class,
        "confidence": confidence
    }
    
    return predicted_class, confidence

# Process uploaded image
def process_image(image_path, object_detection_model, processor, yolov8_model, device, user_ip):
    results = detect_objects(image_path, object_detection_model, processor, device)
    
    # Check if any leaves are detected
    if results and "boxes" in results[0] and results[0]["boxes"].shape[0] > 0:
        predicted_class, confidence = classify_leaf(image_path, yolov8_model,user_ip)
        return {
            "leaf_detected": True,
            "label": predicted_class,
            "confidence": confidence
        }
        
    else:
        IP_STATUS[user_ip] = {"completed": False}
        return {"leaf_detected": False}
     

# Route for checking server status
@app.route('/')
def index():
    print("running...")
    return jsonify({'message': 'Server is running'})

# Route for uploading image and processing
@app.route('/upload', methods=['POST'])
def upload_file():
    global REQUEST_COUNTER
    REQUEST_COUNTER += 1
    user_ip = request.remote_addr
    print("-------------------------------------------------")
    print(f"-->REQUEST COUNTER: {REQUEST_COUNTER}<--")
    print(f"Connection established from IP: {user_ip}")  # Log IP address
    
    if 'file' not in request.files:
        print("No file part in request")  # Log if file part is missing
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        print("No selected file")  # Log if no file is selected
        return jsonify({'error': 'No selected file'}), 400
    
    # Log file information
    print(f"File received: {file.filename}")
    
    # Load models
    print("Loading YOLOv8 model...")
    yolov8_model_path = 'yolo_v8_v2.pt'
    yolov8_model = load_yolov8_model(yolov8_model_path)
    
    print("Loading Grounding Dino model...")
    
    # Use this if you don't have grounding-dino-tiny
    object_detection_model_id = 'IDEA-Research/grounding-dino-tiny'
    object_detection_model, processor, device = load_object_detection_model(object_detection_model_id)
    
    #MODEL_PATH = "./grounding-dino-tiny"
    #object_detection_model, processor, device = load_object_detection_model(MODEL_PATH)
    
    # Process image
    result = process_image(file, object_detection_model, processor, yolov8_model, device, user_ip)
    
    return jsonify(result)

# Route to check the classification status for an IP address
@app.route('/snapfolia/status', methods=['GET'])
def get_status():
    user_ip = request.remote_addr
    status = IP_STATUS.get(user_ip, {"completed": False})
    print(f"Status for IP {user_ip}: {status}")
    return jsonify(status)



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
