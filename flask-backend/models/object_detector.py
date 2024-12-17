import torch
from ultralytics import YOLO
from transformers import AutoProcessor, AutoModelForZeroShotObjectDetection
from configuration.config import Config
import numpy as np


class ObjectDetector:
    def __init__(self):
        self.device = self._get_device()
        self.yolov8_model = None
        self.grounding_dino_model = None
        self.grounding_dino_processor = None
        self._initialize_models()

    def _get_device(self):
        """
        Determine the appropriate device for running models.
        
        :return: torch.device
        """
        if torch.cuda.is_available():
            print(f"Using CUDA: {torch.version.cuda}")
            return torch.device('cuda')
        print("CUDA not available, using CPU.")
        return torch.device('cpu')

    def _initialize_models(self):
        """
        Initialize YOLOv8 and Grounding DINO models.
        """
        # YOLOv8 model
        self.yolov8_model = YOLO(Config.YOLOV8_MODEL_PATH)
        print("YOLOv8 model loaded.")

        # Grounding DINO model
        print("Loading Grounding Dino.")
        self.grounding_dino_processor = AutoProcessor.from_pretrained(
            Config.GROUNDING_DINO_MODEL_ID, 
            cache_dir=Config.CUSTOM_CACHE_DIR
        )
        self.grounding_dino_model = AutoModelForZeroShotObjectDetection.from_pretrained(
            Config.GROUNDING_DINO_MODEL_ID, 
            cache_dir=Config.CUSTOM_CACHE_DIR
        ).to(self.device)
        self.grounding_dino_model.eval()
        
        print(f"Grounding DINO model loaded with cache at {Config.CUSTOM_CACHE_DIR}.")

    def detect_objects_with_dino(self, image):
        """
        Detect objects using Grounding DINO model.
        
        :param image: PIL Image
        :return: Detection results
        """
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
        print("Detecting & Classifying Leaf...")
        results = self.yolov8_model(image)  # Run the YOLOv8 model
        
        if len(results) > 0 and len(results[0].boxes) > 0:
            for idx, box in enumerate(results[0].boxes):
                print(f"\nDetection {idx + 1} Confidence Breakdown:")
                
                # Get the detected class and its confidence
                detected_class_id = int(box.cls.cpu().numpy()[0])
                detected_class_conf = box.conf.cpu().numpy()[0]
                detected_class_name = results[0].names[detected_class_id]
                
                print(f"Primary Detection: {detected_class_name} - {detected_class_conf * 100:.2f}%")
                
                # Attempt to get all class confidences
                print("\nConfidence for All Classes:")
                for class_id, class_name in results[0].names.items():
                    # Note: This might require model-specific implementation
                    # The exact method depends on your YOLO model's prediction output
                    try:
                        # This is a placeholder - you may need to modify based on your specific model
                        class_conf = self._get_class_confidence(results, class_id)
                        print(f"  {class_name}: {class_conf * 100:.2f}%")
                    except Exception as e:
                        print(f"  Could not retrieve confidence for {class_name}: {e}")
            
            return {"leaf_detected": True}
        
        return {"leaf_detected": False}

    def _get_class_confidence(self, results, class_id):
        primary_result = results[0]
        
        # Check if the class matches the detected class
        if int(primary_result.boxes.cls.cpu().numpy()[0]) == class_id:
            return primary_result.boxes.conf.cpu().numpy()[0]
        else:
            # If not the primary class, return a lower confidence
            return 0.0