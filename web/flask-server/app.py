from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import torch
from PIL import Image
from torchvision import transforms
from transformers import AutoProcessor, AutoModelForZeroShotObjectDetection
import torchvision

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = '../uploads'

# Enable CORS
CORS(app)

# Class Labels
class_labels = ['Apitong', 'Balete', 'Bayabas', 'Guyabano', 'Kamagong', 'Langka', 'Mahogany', 'Mangga', 'Palo Maria']

# Ensure the upload folder exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# Load the leaf classification model
def load_leaf_classification_model(model_path, num_classes):
    model = torchvision.models.resnet50(pretrained=False)
    model.fc = torch.nn.Linear(model.fc.in_features, num_classes)
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    model.eval()
    return model

# Load the object detection model
def load_object_detection_model(model_id):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    processor = AutoProcessor.from_pretrained(model_id)
    model = AutoModelForZeroShotObjectDetection.from_pretrained(model_id).to(device)
    model.eval()
    return model, processor

# Data transformation for leaf classification
def transform_image(image):
    transform = transforms.Compose([
        transforms.Resize(size=(224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ])
    return transform(image).unsqueeze(0)

# Process uploaded image
def process_image(image_path, leaf_model, object_detection_model, processor):
    image = Image.open(image_path).convert('RGB')
    
    # Object detection
    inputs = processor(images=image, text="a leaf. leaves.", return_tensors="pt")
    with torch.no_grad():
        outputs = object_detection_model(**inputs)
    
    # Post-process object detection
    results = processor.post_process_grounded_object_detection(
        outputs,
        inputs.input_ids,
        box_threshold=0.4,
        text_threshold=0.3,
        target_sizes=[image.size[::-1]]
    )
    
    # Leaf classification on detected regions
    classification_results = []
    if results and "boxes" in results[0] and results[0]["boxes"].shape[0] > 0:
        for result in results:
            for box in result["boxes"]:
                box = box.cpu().numpy()
                x1, y1, x2, y2 = box[0], box[1], box[2], box[3]
                cropped_image = image.crop((x1, y1, x2, y2))
                cropped_image_tensor = transform_image(cropped_image)
                
                # Classify leaf
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

# Route for checking server status
@app.route('/')
def index():
    print("running...")
    return jsonify({'message': 'Server is running'})

# Route for uploading image and processing
@app.route('/upload', methods=['POST'])
def upload_file():
    print("Identifying...")  # Log when endpoint is hit
    
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
    leaf_model_path = 'final_model.pth'
    object_detection_model_id = 'IDEA-Research/grounding-dino-tiny'
    leaf_model = load_leaf_classification_model(leaf_model_path, num_classes=len(class_labels))  # Adjust num_classes as per your model
    object_detection_model, processor = load_object_detection_model(object_detection_model_id)
    
    # Process image
    results = process_image(file_path, leaf_model, object_detection_model, processor)
    
    return jsonify({'results': results})

if __name__ == '__main__':
    app.run(debug=True)
