import sys
import os
import logging
from create_app import create_app
from processors.object_detector import ObjectDetector

sys.path.append(os.path.abspath(os.path.dirname(__file__)))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info("Initializing Flask app...")
app = create_app()

obj_det = ObjectDetector()
obj_det._initialize_models()

logger.info("Gunicorn Now Running.")