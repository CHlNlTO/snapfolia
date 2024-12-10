from flask import Flask
from celery import Celery
from configuration.config import Config
from services.detection_service import DetectionService
import logging

logger = logging.getLogger(__name__)

def make_celery(app):
    celery = Celery(
        app.import_name,
        backend=Config.CELERY_RESULT_BACKEND,
        broker=Config.CELERY_BROKER_URL
    )
    
    celery.conf.update(
        broker_connection_retry_on_startup=True,
        task_always_eager=False
    )
        
    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery

flask_app = Flask(__name__)
celery = make_celery(flask_app)
detection_service = DetectionService()

@celery.task(name='tasks.process_image')
def process_image_task(file_path):
    try:
        result = detection_service.process_image(file_path)
        return result
    
    except Exception as e:
        return {'error': str(e)}  # Catch and return errors

    
