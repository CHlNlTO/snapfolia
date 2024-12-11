import os 
import logging

logger = logging.getLogger(__name__)

class Config:
    UPLOAD_FOLDER = 'uploads'
    CUSTOM_CACHE_DIR = os.path.join(os.path.dirname(__file__), 'cache')

    YOLOV8_MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model_files', 'best36_class.pt')
    
    if not os.path.exists(YOLOV8_MODEL_PATH):
        logger.info(f"Error: YOLOv8 model file not found at {YOLOV8_MODEL_PATH}")
        
    if not os.path.exists(CUSTOM_CACHE_DIR):
        logger.info(f"Error: Grounding Dino Cache file not found at {CUSTOM_CACHE_DIR}")

    GROUNDING_DINO_MODEL_ID = 'IDEA-Research/grounding-dino-tiny'

    LOG_FILE = os.path.join(os.path.dirname(__file__), '..', 'app.log')

    CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL', 'redis://localhost:6379/0')
    CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
    
    CERTIFICATES_DIR = os.path.join(os.path.dirname(__file__), 'certificates')
    SSL_CERT = os.environ.get('SSL_CERT', os.path.join(CERTIFICATES_DIR, 'treesbe.firstasia.edu.ph-crt.pem'))
    SSL_KEY = os.environ.get('SSL_KEY', os.path.join(CERTIFICATES_DIR, 'treesbe.firstasia.edu.ph-key.pem'))

    if os.path.exists(SSL_CERT) and os.path.exists(SSL_KEY):
        logger.info("Both SSL certificate and key files exist.")
    else:
        if not os.path.exists(SSL_CERT):
            logger.error(f"SSL certificate file does not exist: {SSL_CERT}")
        if not os.path.exists(SSL_KEY):
            logger.error(f"SSL key file does not exist: {SSL_KEY}")
            
    # For Development Purposes
    HOST = '172.16.101.124'
    PORT = 5000
    
    
    @classmethod
    def initialize_directories(cls):
        os.makedirs(cls.UPLOAD_FOLDER, exist_ok=True)
        os.makedirs(cls.CUSTOM_CACHE_DIR, exist_ok=True)
        os.environ['HF_HOME'] = cls.CUSTOM_CACHE_DIR