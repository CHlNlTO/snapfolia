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
        self.yolo_classification = None 
        self.yolo_obj_detection = None 

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
        self.yolo_classification = YOLO(Config.YOLO_CLASSIFICATION_MODEL)
        logging.info("YOLO CLASSIFICATION MODEL LOADED.")
        
        self.yolo_obj_detection = YOLO(Config.YOLO_OBJECT_DETECTION_MODEL)
        logging.info("YOLO OBJECT DETECTION MODEL LOADED. ")
        
    def predict_object_detection(self, image_path):
        results = self.yolo_obj_detection(image_path)
        
        if len(results) > 0 and len(results[0].boxes) > 0:
            predictions = []
            for box in results[0].boxes:
                predicted_class = results[0].names[int(box.cls)]
                confidence = round(float(box.conf), 2)
                predictions.append((predicted_class, confidence))
            
            predictions.sort(key=lambda x: x[1], reverse=True)

            predicted_class, confidence = predictions[0]
            return results, predicted_class, confidence
        else:
            return None, None, None
        
    def detect_and_classify_leaf(self, image):
        logging.info("Running object detection...")
        detection_results, detected_class, confidence = self.predict_object_detection(image)

        if detection_results and detected_class:
            logging.info(f"Object detected: {detected_class} with confidence {confidence:.2f}%")
            logging.info("Running classification...")
            
            # Run the YOLO classification model
            classification_results = self.yolo_classification(image)
            
            if classification_results:
                # Get the top 5 predictions
                probs_data = classification_results[0].probs.data.cpu().numpy()
                top_5_indices = sorted(range(len(probs_data)), 
                                       key=lambda i: probs_data[i], 
                                       reverse=True)[:5]
                
                # Build the response structure
                classes = []
                for index in top_5_indices:
                    class_name = classification_results[0].names[index]
                    confidence = float(probs_data[index] * 100)
                    classes.append({
                        "class": class_name,
                        "confidence": confidence
                    })
                
                logging.info("\nLeaf Classification Predictions:")
                for entry in classes:
                    logging.info(f"{entry['class']}: {entry['confidence']:.2f}%")
                    
                return {
                    "leaf_detected": True,
                    "detected_class": detected_class,
                    "detection_confidence": confidence,
                    "classes": classes
                }
        
        logging.info("No leaf detected or classification failed.")
        return {
            "leaf_detected": False,
            "detected_class": None,
            "detection_confidence": None,
            "classes": []
        }