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
            logger.info(f"Using CUDA: {torch.version.cuda}")
            return torch.device('cuda')
        logger.info("CUDA not available, using CPU.")
        return torch.device('cpu')

    def _initialize_models(self):
        logger.info("Initializing models...")
        self.yolov8_model = YOLO(Config.YOLOV8_MODEL_PATH)
        logger.info("YOLOv8 model loaded.")

        logger.info("Loading Grounding Dino.")
        self.grounding_dino_processor = AutoProcessor.from_pretrained(
            Config.GROUNDING_DINO_MODEL_ID, 
            cache_dir=Config.CUSTOM_CACHE_DIR
        )
        self.grounding_dino_model = AutoModelForZeroShotObjectDetection.from_pretrained(
            Config.GROUNDING_DINO_MODEL_ID, 
            cache_dir=Config.CUSTOM_CACHE_DIR
        ).to(self.device)
        self.grounding_dino_model.eval()

        logger.info(f"Grounding DINO model loaded with cache at {Config.CUSTOM_CACHE_DIR}.")

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
        results = self.yolov8_model(image)

        if len(results) > 0 and len(results[0].boxes) > 0:
            predictions = []
            for box in results[0].boxes:
                predicted_class = results[0].names[int(box.cls)]
                confidence = round(float(box.conf), 2)
                predictions.append((predicted_class, confidence))

            predictions.sort(key=lambda x: x[1], reverse=True)

            for i in range(min(3, len(predictions))):
                predicted_class, confidence = predictions[i]
                logger.info(f"{i+1}. {predicted_class} - Confidence: {confidence}")

            return {
                "leaf_detected": True,
                "label": predicted_class,
                "confidence": confidence,
            }

        return {"leaf_detected": False}
