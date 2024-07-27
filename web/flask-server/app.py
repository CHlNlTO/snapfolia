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
app.config['UPLOAD_FOLDER'] = '../uploads'

# Enable CORS
CORS(app)

# Ensure the upload folder exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

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
def classify_leaf(image_path, yolov8_model):
    image = Image.open(image_path).convert('RGB')
    print("Classifying leaf...")
    predict = yolov8_model(image)
    names_dict = predict[0].names
    probs = predict[0].probs.data.tolist()

    print(names_dict)
    print(probs)

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
            "confidence": confidence
        }
        
    else:
        return {"leaf_detected": False}

# Route for checking server status
@app.route('/')
def index():
    print("running...")
    return jsonify({'message': 'Server is running'})

# Route for uploading image and processing
@app.route('/upload', methods=['POST'])
def upload_file():
    print("Connection established...")  # Log when endpoint is hit
    
    if 'file' not in request.files:
        print("No file part in request")  # Log if file part is missing
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        print("No selected file")  # Log if no file is selected
        return jsonify({'error': 'No selected file'}), 400
    
    # Log file information
    print(f"File received: {file.filename}")
    
    # Save uploaded file
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)
    
    # Load models
    print("Loading YOLOv8 model...")
    yolov8_model_path = 'yolo_v8_v2.pt'
    yolov8_model = load_yolov8_model(yolov8_model_path)
    
    print("Loading Grounding Dino model...")
    
    # Use this if you don't have model_files
    # object_detection_model_id = 'IDEA-Research/grounding-dino-tiny'
    # object_detection_model, processor, device = load_object_detection_model(object_detection_model_id)
    
    MODEL_PATH = "./model_files"
    object_detection_model, processor, device = load_object_detection_model(MODEL_PATH)
    
    # Process image
    result = process_image(file_path, object_detection_model, processor, yolov8_model, device)
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
