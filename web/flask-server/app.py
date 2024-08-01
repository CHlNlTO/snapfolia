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

app = Flask(__name__)

# Enable CORS
CORS(app)
app.config['UPLOAD_FOLDER'] = '../uploads'
uploaded_files = []

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
            "confidence": confidence
        }
    return {"leaf_detected": False}

# Process requests with dynamic batching
def process_request(requests: list):
    MAX_QUEUE = 8
    complete_batches = []
    batch_number = 0

    # Ensure the number of requests does not exceed the MAX_QUEUE
    requests = requests[:MAX_QUEUE]

    while requests:
        batch_number += 1
        batch = requests[:MAX_QUEUE]  # Process up to MAX_QUEUE requests at a time
        requests = requests[MAX_QUEUE:]

        # Process the current batch
        print(f"REQUESTS: {requests} | COUNT: {len(requests)}")
        print(f"PROCESSING CURRENT BATCH: {batch}")
        for index, request in enumerate(batch):
            user_ip = request.get('user_ip')
            file_name = request.get('file_path')
            print()
            print("------------------------------------")
            print(f"REQUEST FROM IP: {user_ip} | FILE: {file_name} | BATCH NO.: {batch_number}")

            # Process image
            result = process_image(file_name, object_detection_model, processor, yolov8_model, device)
            print(f"RESULT: {result}")

            print("--------------------------------------")

        print(f"BATCH NO.: {batch_number} COMPLETE")
        complete_batches.append(batch_number)
        print(f"BATCHES COMPLETE: {complete_batches}")

        # Add new requests if there's space in the queue
        if len(requests) < MAX_QUEUE:
            new_requests = [{'user_ip': f'ip_{i}', 'file_path': f'file_{i}.jpg'} for i in range(MAX_QUEUE - len(requests))]
            requests.extend(new_requests)  # Correctly appends elements to the end of the list

        print(f"TOTAL REQUESTS: {requests} | COUNT: {len(requests)}")
        print("--------------------------------------")
        print()

    return complete_batches

# Route for checking server status
@app.route('/')
def index():
    print("running...")
    return jsonify({'message': 'Server is running'})

# Route for uploading image and processing
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        print("No file part in request")  # Log if file part is missing
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        print("No selected file")  # Log if no file is selected
        return jsonify({'error': 'No selected file'}), 400
    
    user_ip = request.remote_addr
    print("-------------------------------------------------")
    print(f"Connection established from IP: {user_ip}")  # Log IP address
    
    # Log file information        
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)
    
    uploaded_files.append({'user_ip': user_ip, 'file_path': file_path})
    
    result = process_request(uploaded_files)
    
    return jsonify(result)

if __name__ == '__main__':
    initialize_models()
    app.run(host='0.0.0.0', port=5000, debug=True)
