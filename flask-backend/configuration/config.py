import os 
import logging

logger = logging.getLogger(__name__)

class Config:
    UPLOAD_FOLDER = 'uploads'
    CUSTOM_CACHE_DIR = os.path.join(os.path.dirname(__file__), 'cache')

    YOLOV8_MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model_files', 'best36_class.pt')
    
    if not os.path.exists(YOLOV8_MODEL_PATH):
        logging.debug(f"Error: YOLOv8 model file not found at {YOLOV8_MODEL_PATH}")
        
    if not os.path.exists(CUSTOM_CACHE_DIR):
        logging.debug(f"Error: Grounding Dino Cache file not found at {CUSTOM_CACHE_DIR}")

    GROUNDING_DINO_MODEL_ID = 'IDEA-Research/grounding-dino-tiny'

    LOG_FILE = os.path.join(os.path.dirname(__file__), '..', 'app.log')

    CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL', 'redis://localhost:6379/0')
    CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
    
    
    @classmethod
    def initialize_directories(cls):
        os.makedirs(cls.UPLOAD_FOLDER, exist_ok=True)
        os.makedirs(cls.CUSTOM_CACHE_DIR, exist_ok=True)
        os.environ['HF_HOME'] = cls.CUSTOM_CACHE_DIR