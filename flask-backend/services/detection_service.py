from processors.object_detector import ObjectDetector
from processors.image_processor import ImageProcessor
import logging

logger = logging.getLogger(__name__)

class DetectionService:
    def __init__(self):
        self.object_detector = ObjectDetector()
        self.image_processor = ImageProcessor()

    def process_image(self, file):
        logger.info("Processing Image...")
        image = self.image_processor.convert_to_jpg(file)
        yolov8_results = self.object_detector.detect_and_classify_leaf(image)
    
        if yolov8_results.get("leaf_detected"):
            confidence = yolov8_results.get("confidence", 0)
            if confidence < 0.9:
                self.image_processor.save_image(file, confidence)

        return yolov8_results