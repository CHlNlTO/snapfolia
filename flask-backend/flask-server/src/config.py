import os 

class Config:
    """
    Configuration settings for the application
    """
    
    UPLOAD_FOLDER = 'uploads'
    CUSTOM_CACHE_DIR = os.path.join(os.getcwd(), 'cache')

    # Model Paths
    YOLOV8_MODEL_PATH = './model/best36_class.pt'
    GROUNDING_DINO_MODEL_ID = 'IDEA-Research/grounding-dino-tiny'

    # Batch Processing
    BATCH_SIZE = 10 
    
    # Logging
    LOG_FILE = 'logs.csv'

    @classmethod
    def initialize_directories(cls):
        """Create necessary directories if they don't exist."""
        os.makedirs(cls.UPLOAD_FOLDER, exist_ok=True)
        os.makedirs(cls.CUSTOM_CACHE_DIR, exist_ok=True)
        os.environ['TRANSFORMERS_CACHE'] = cls.CUSTOM_CACHE_DIR