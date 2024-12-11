import sys
import os
import logging
from create_app import create_app
from celery_worker import celery
from processors.object_detector import ObjectDetector
from configuration.config import Config

sys.path.append(os.path.abspath(os.path.dirname(__file__)))

# Set up logging only once
if not logging.getLogger().hasHandlers():
    logging.basicConfig(level=logging.INFO)

logger = logging.getLogger(__name__)

logger.info("Initializing Flask app...")
app = create_app()

logger.info("Initializing Celery Worker...")
celery_app = celery

logger.info("Starting Flask app...")

# Initialize Object Detector
obj_detector = ObjectDetector()
obj_detector._initialize_models()

# Gunicorn will bind to the host and port, log them
host = Config.HOST if hasattr(Config, 'HOST') else '0.0.0.0'

port = Config.PORT if hasattr(Config, 'PORT') else 5000
logger.info(f"Gunicorn will bind to: {host}:{port}")
