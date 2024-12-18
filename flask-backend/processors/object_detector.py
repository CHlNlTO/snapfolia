import torch
from ultralytics import YOLO
from transformers import AutoProcessor, AutoModelForZeroShotObjectDetection
from configuration.config import Config
import logging

logger = logging.getLogger(__name__)

class ObjectDetector:
    models_initialized = False  

    def __init__(self):
        self.device = self._get_device()
        self.yolov8_model = None
        self.grounding_dino_model = None
        self.grounding_dino_processor = None

        if not ObjectDetector.models_initialized:
            self._initialize_models()
            ObjectDetector.models_initialized = True

    def _get_device(self):
        if torch.cuda.is_available():
            logging.info(f"Using CUDA: {torch.version.cuda}")
            return torch.device('cuda')
        logging.info("CUDA not available, using CPU.")
        return torch.device('cpu')

    def _initialize_models(self):
        logging.info("Initializing models...")
        self.yolov8_model = YOLO(Config.YOLOV8_MODEL_PATH)
        logging.info("YOLOv8 model loaded.")

        logging.info("Loading Grounding Dino.")
        self.grounding_dino_processor = AutoProcessor.from_pretrained(Config.GROUNDING_DINO_MODEL_ID)
        self.grounding_dino_model = AutoModelForZeroShotObjectDetection.from_pretrained(Config.GROUNDING_DINO_MODEL_ID, ).to(self.device)
        self.grounding_dino_model.eval()

        logging.info(f"Grounding DINO model loaded.")

    def detect_objects_with_dino(self, image):
        inputs = self.grounding_dino_processor(
            images=image,
            text=" a leaf. leaves. ",
            return_tensors="pt"
        ).to(self.device)

        with torch.no_grad():
            outputs = self.grounding_dino_model(**inputs)

        results = self.grounding_dino_processor.post_process_grounded_object_detection(
            outputs,
            inputs.input_ids,
            box_threshold=0.4,
            text_threshold=0.3,
            target_sizes=[image.size[::-1]]
        )
        return results
    
    def detect_and_classify_leaf(self, image):
            print("Classifying Leaf...")
            # Run the YOLOv8 model for classification
            results = self.yolov8_model(image)
            
            if results:
                # Get the top 5 predictions
                # Convert tensor to numpy array and then to regular Python float
                probs_data = results[0].probs.data.cpu().numpy()
                top_5_indices = sorted(range(len(probs_data)), 
                                    key=lambda i: probs_data[i], 
                                    reverse=True)[:5]
                
                # Build the response structure
                classes = []
                for index in top_5_indices:
                    class_name = results[0].names[index]
                    # Convert numpy float to Python float for JSON serialization
                    confidence = float(probs_data[index] * 100)
                    classes.append({
                        "class": class_name,
                        "confidence": confidence
                    })
                
                print("\nLeaf Classification Predictions:")
                for entry in classes:
                    print(f"{entry['class']}: {entry['confidence']:.2f}%")
                    
                return {
                    "leaf_detected": True,
                    "classes": classes
                }
            
            print("No leaf detected")
            return {
                "leaf_detected": False,
                "classes": []
            }