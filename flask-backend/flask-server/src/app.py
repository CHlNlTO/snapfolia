import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from src import create_app
from .services.detection_service import DetectionService
from .models.object_detector import ObjectDetector

# Create the Flask application
app = create_app()

if __name__ == '__main__':
    object_detector = ObjectDetector()
    object_detector.initialize_models()
    
    detection_service = DetectionService()
    # detection_service.start_processing_thread()
    
    app.run(
        host='0.0.0.0',
        port=5000,
        ssl_context=("C:\\certificates\\treesbe.firstasia.edu.ph-crt.pem", "C:\\certificates\\treesbe.firstasia.edu.ph-key.pem"),
        debug=False,
    )