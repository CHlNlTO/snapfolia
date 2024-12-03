import torch
from ultralytics import YOLO
from transformers import AutoProcessor, AutoModelForZeroShotObjectDetection
from config import Config

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
        """
        Detect and classify leaf using YOLOv8 model.
        
        :param image: PIL Image
        :return: Detection results dictionary
        """
        print("Detecting & Classifying Leaf...")
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