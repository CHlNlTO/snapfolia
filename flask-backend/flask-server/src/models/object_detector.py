import torch
from ultralytics import YOLO
from transformers import AutoProcessor, AutoModelForZeroShotObjectDetection
from config import Config

class ObjectDetector:
    def __init__(self):
        self.yolov8_model = None
        self.grounding_dino_model = None
        self.grounding_dino_processor = None
        self.device = None

    def _get_device(self):
        if torch.cuda.is_available():
            print(f"Using CUDA: {torch.version.cuda}")
            return torch.device('cuda')

        print("CUDA not available, using CPU.")
        return torch.device('cpu')

    def initialize_models(self):
        self.device = self._get_device()
        
        self.yolov8_model = YOLO(Config.YOLOV8_MODEL_PATH)
        print("YOLOv8 Loaded...")

        print("Loading Grounding Dino.")
        self.grounding_dino_processor = AutoProcessor.from_pretrained(
            Config.GROUNDING_DINO_MODEL_ID,
            cache_dir=Config.CUSTOM_CACHE_DIR
        )
        
        self.grounding_dino_model = AutoModelForZeroShotObjectDetection.from_pretrained(
            Config.GROUNDING_DINO_MODEL_ID,
            cache_dir=Config.CUSTOM_CACHE_DIR
        )
        
        print(f"Grounding DINO model loaded with cache at {Config.CUSTOM_CACHE_DIR}.")
    
    def detect_object_with_dino(self,image):
        print("DETECTING WITH OBJECT DINO")
        inputs = self.grounding_dino_processor(
            images=image,
            text=" a leaf. leaves.",
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
    
    def detect_and_clasifiy_leaf(self,image):
        print("Detecting & Classifiyng Leaf...")
        
        results = self.yolov8_model(image)
        if len(results) > 0 and len(results[0].boxes) > 0:
            predictions = []
            for box in results[0].boxes:
                predicted_class = results[0].names[int(box.cls)]
                confidence = round(float(box.conf), 2)
                predictions.append((predicted_class, confidence))
            
            predictions.sort(key=lambda x: x[1], reverse=True)

            print("\nTop 3 Predictions:")
            for i in range(min(3, len(predictions))):
                predicted_class, confidence = predictions[i]
                print(f"{i+1}. {predicted_class} - Confidence: {confidence}")
            print()

            return {
                "leaf_detected": True,
                "label": predicted_class,
                "confidence": confidence,
            }
            
        return {"leaf_detected": False}