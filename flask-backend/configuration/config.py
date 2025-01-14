import os 
import logging

logger = logging.getLogger(__name__)

class Config:
    UPLOAD_FOLDER = 'uploads'
    YOLO_CLASSIFICATION_MODEL = os.path.join(os.path.dirname(__file__), 'model_files', 'classification.pt')
    YOLO_OBJECT_DETECTION_MODEL = os.path.join(os.path.dirname(__file__), 'model_files', 'object_detection.pt')
    
    if not os.path.exists(YOLO_CLASSIFICATION_MODEL):
        logging.debug(f"Error: YOLOv8 model file not found at {YOLO_CLASSIFICATION_MODEL}")
        
    if not os.path.exists(YOLO_OBJECT_DETECTION_MODEL):
        logging.debug(f"Error: YOLOv8 model file not found at {YOLO_OBJECT_DETECTION_MODEL}")

    LOG_FILE = os.path.join(os.path.dirname(__file__), '..', 'app.log')
    
    @classmethod
    def initialize_directories(cls):
        os.makedirs(cls.UPLOAD_FOLDER, exist_ok=True)