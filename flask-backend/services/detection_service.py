from processors.image_processor import ImageProcessor
from processors.object_detector import ObjectDetector
import logging
from werkzeug.datastructures import FileStorage
from io import BytesIO

logger = logging.getLogger(__name__)

class DetectionService:
    def __init__(self):
        self.object_detector = ObjectDetector()
        self.image_processor = ImageProcessor()

    def process_image(self, file_path):

        # Attempt to convert file_path to JPG
        try:
            converted_filepath = self._process_file_as_filestorage(file_path)
            image = self.image_processor.convert_to_jpg(converted_filepath)   
            if image is None:
                return {"leaf_detected": False}
            
        except Exception as e:
            return {"error": str(e)}

        # Detect objects using DINO
        try:
            dino_results = self.object_detector.detect_objects_with_dino(image)
            if not dino_results or "boxes" not in dino_results[0] or dino_results[0]["boxes"].shape[0] == 0:
                return {"leaf_detected": False}
        except Exception as e:
            return {"error": str(e)}

        # Classify leaf using YOLOv8
        try:
            yolov8_results = self.object_detector.detect_and_classify_leaf(image)
            if yolov8_results.get("leaf_detected"):
                confidence = yolov8_results.get("confidence", 0)
                if confidence < 0.9:
                    self.image_processor.save_image(file_path, confidence)
                    
        except Exception as e:
            return {"error": str(e)}


        return yolov8_results

    def _process_file_as_filestorage(self, file_path):
        logger.info(f"Converting File Path: {file_path}")
        
        with open(file_path, 'rb') as file:
            file_content = file.read()  
            
        file_stream = BytesIO(file_content)
        
        file_storage = FileStorage(
            stream=file_stream,
            filename=file_path.split('/')[-1],
            content_type='image/jpeg'
        )

        print(f'FILE STORAGE: {file_storage}')
        return file_storage