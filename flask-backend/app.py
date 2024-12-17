import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from create_app import create_app
from services.detection_service import DetectionService

app = create_app()

detection_service = DetectionService()
detection_service.start_processing_thread()

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=False
    )