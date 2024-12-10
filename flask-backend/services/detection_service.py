from processors.image_processor import ImageProcessor
from processors.object_detector import ObjectDetector
import logging
from werkzeug.datastructures import FileStorage
from io import BytesIO
import os

logger = logging.getLogger(__name__)

class DetectionService:
    def __init__(self):
        self.object_detector = ObjectDetector()
        self.image_processor = ImageProcessor()

    def process_image(self, file_path):
        try:
            logger.info(f'PROCESSING IMAGE: {file_path}')
            with open(file_path, 'rb') as file:
                file_storage = FileStorage(
                    stream=BytesIO(file.read()),
                    filename=os.path.basename(file_path),
                    content_type='image/jpeg'
                )
            image = self.image_processor.convert_to_jpg(file_storage)   
            if image is None:
                return {"leaf_detected": False}
            
        except Exception as e:
            return {"error": str(e)}

        # Detect objects using DINO
        try:
            logger.info("DETECTING OBJECT USING DINO")
            dino_results = self.object_detector.detect_objects_with_dino(image)
            if not dino_results or "boxes" not in dino_results[0] or dino_results[0]["boxes"].shape[0] == 0:
                return {"leaf_detected": False}
        except Exception as e:
            return {"error": f"DINO detection error: {str(e)}"}

        # Classify leaf using YOLOv8
        try:
            yolov8_results = self.object_detector.detect_and_classify_leaf(image)
            
            if yolov8_results.get("leaf_detected"):
                confidence = yolov8_results.get("confidence", 0)
                
                if confidence < 0.9:
                    with open(file_path, 'rb') as file:
                        file_storage = FileStorage(
                            stream=BytesIO(file.read()),
                            filename=os.path.basename(file_path),
                            content_type='image/jpeg'
                        )
                    self.image_processor.save_image(file_storage, confidence)
                    
        except Exception as e:
            return {"error": f"YOLOv8 classification error: {str(e)}"}
        
        return yolov8_results