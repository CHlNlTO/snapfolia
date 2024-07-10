from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import torch
from PIL import Image
from transformers import AutoProcessor, AutoModelForZeroShotObjectDetection
import numpy as np
from ultralytics import YOLO

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = '../uploads'

# Enable CORS
CORS(app)

# Class Labels
class_labels = [
    "Apitong",
    "Balete", "Bayabas",
    "Guyabano", "Kamagong",
    "Langka", "Mahogany", "Mangga", 
    "Palo-Maria", 
]

# Ensure the upload folder exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# Load the object detection model (Grounding Dino)
def load_object_detection_model(model_id):
    print("Initializing object detection model...")
    if torch.cuda.is_available():
        print("cuda is available")
    else:
        print("cuda is not available")
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    processor = AutoProcessor.from_pretrained(model_id)
    model = AutoModelForZeroShotObjectDetection.from_pretrained(model_id).to(device)
    model.eval()
    return model, processor

# Grayscale conversion
def to_grayscale(image):
    print("Converting to grayscale...")
    grayscale_image = image.convert("L")
    grayscale_image = np.stack([np.array(grayscale_image)]*3, axis=-1)
    return Image.fromarray(grayscale_image)

# Data transformation for leaf classification
def transform_image(image):
    print("Transforming image...")
    transform = transforms.Compose([
        transforms.Resize(size=(224, 224)),
        transforms.Lambda(to_grayscale),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(10),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ])
    return transform(image).unsqueeze(0)

# Process uploaded image
def process_image(image_path, leaf_model, object_detection_model, processor):
    print("Processing image...")
    
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
    
    # Leaf classification on detected regions
    print("Object detection complete...")
    classification_results = []
    if results and "boxes" in results[0] and results[0]["boxes"].shape[0] > 0:
        for result in results:
            for box in result["boxes"]:
                box = box.cpu().numpy()
                x1, y1, x2, y2 = box[0], box[1], box[2], box[3]
                cropped_image = image.crop((x1, y1, x2, y2))
                cropped_image_tensor = transform_image(cropped_image)
                
                # Classify leaf
                print("Classifying leaf...")
                with torch.no_grad():
                    logits = leaf_model(cropped_image_tensor)
                confidence, predicted_class = torch.max(torch.nn.functional.softmax(logits, dim=1), dim=1)
                
                # Append results
                classification_results.append({
                    "box": box.tolist(),
                    "label": class_labels[predicted_class.item()],
                    "confidence": confidence.item()
                })
    
    return classification_results

# Process uploaded image
def process_image(image_path, object_detection_model, processor, yolov8_model, device):
    leaf_detected, image = detect_objects(image_path, object_detection_model, processor, device)
    
    if not leaf_detected:
        print("No leaf identified.")
        classification_results = {
            "label": "None",
            "confidence": None
        }
        return classification_results

    classification_results = classify_leaf(image, yolov8_model)

    return classification_results

# Load the object detection model (Grounding Dino)
def load_object_detection_model(model_id):
    print("Initializing object detection model...")
    if torch.cuda.is_available():
        print("cuda is available")
    else:
        print("cuda is not available")
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    processor = AutoProcessor.from_pretrained(model_id)
    model = AutoModelForZeroShotObjectDetection.from_pretrained(model_id).to(device)
    model.eval()
    return model, processor, device

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
    yolov8_model_path = 'YOLO_V8.pt'
    yolov8_model = load_yolov8_model(yolov8_model_path)
    
    print("Loading Grounding Dino model...")
    object_detection_model_id = 'IDEA-Research/grounding-dino-tiny'
    
    leaf_model = load_leaf_classification_model(leaf_model_path, num_classes=len(class_labels))
    object_detection_model, processor = load_object_detection_model(object_detection_model_id)
    
    # Process image
    results = process_image(file_path, leaf_model, object_detection_model, processor)
    
    return jsonify({'results': results})

if __name__ == '__main__':
    app.run(debug=True)
