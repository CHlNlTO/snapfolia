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
        print("Classifying Leaf...")

        # Run the YOLOv8 model for classification
        results = self.yolov8_model(image)

        if results:
            # Get the top prediction details
            top_class = results[0].names[results[0].probs.top1]
            top_conf = results[0].probs.top1conf.item() * 100

            print("\nLeaf Classification Predictions:")
            
            # Get the top 5 predictions
            top_5_indices = sorted(range(len(results[0].probs.data)), key=lambda i: results[0].probs.data[i], reverse=True)[:5]
            
            for index in top_5_indices:
                class_name = results[0].names[index]
                prob = results[0].probs.data[index]
                percentage = prob * 100
                print(f"{class_name}: {percentage:.2f}%")

            return {
                "leaf_classified": True, 
                "class_name": top_class, 
                "confidence": top_conf
            }

        print("No leaf detected")
        return {"leaf_classified": False}
