import os 

class Config:
    UPLOAD_FOLDER = 'uploads'
    CUSTOM_CACHE_DIR = os.path.join(os.getcwd(), r'E:\Snapfolia - CS\snapfolia\flask-backend\flask-server\cache')

    YOLOV8_MODEL_PATH = r'E:\Snapfolia - CS\snapfolia\flask-backend\flask-server\src\model_files\best36_class.pt'
    if not os.path.exists(YOLOV8_MODEL_PATH):
        print(f"Error: YOLOv8 model file not found at {YOLOV8_MODEL_PATH}")
        
    GROUNDING_DINO_MODEL_ID = 'IDEA-Research/grounding-dino-tiny'

    # Batch Processing
    BATCH_SIZE = 10 
    
    # Logging
    LOG_FILE = r'E:\Snapfolia - CS\snapfolia\flask-backend\flask-server\app.log'

    @classmethod
    def initialize_directories(cls):
        os.makedirs(cls.UPLOAD_FOLDER, exist_ok=True)
        os.makedirs(cls.CUSTOM_CACHE_DIR, exist_ok=True)
        os.environ['TRANSFORMERS_CACHE'] = cls.CUSTOM_CACHE_DIR