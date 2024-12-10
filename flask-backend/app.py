import sys
import os
import logging
from create_app import create_app
from celery_worker import celery
from processors.object_detector import ObjectDetector

sys.path.append(os.path.abspath(os.path.dirname(__file__)))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info("Initializing Flask app...")
app = create_app()

logger.info("Creating Celery Worker...")
celery_app = celery

if __name__ == '__main__':
    obj_detector = ObjectDetector()
    obj_detector._initialize_models()

    logger.info("Starting Flask app...")
    app.run(
        host='0.0.0.0',
        port=8080,
        debug=False
    )
