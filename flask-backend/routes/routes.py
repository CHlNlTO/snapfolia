from flask import Blueprint, request, jsonify
from services.detection_service import DetectionService
from configuration.config import Config
from services.logging_service import LoggingService

# Initialize services
upload_bp = Blueprint('upload', __name__)
detection_service = DetectionService()
logging_service = LoggingService(Config)

@upload_bp.route('/')
def index():
    print("Server is running...")
    return jsonify({'message': 'Server is running'})

@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        print("No file part in request")
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        print("No selected file")
        return jsonify({'error': 'No selected file'}), 400
    
    result = detection_service.process_image(file)

    return jsonify(result)

@upload_bp.route('/scan-time', methods=['POST'])
def get_scan_time():
    scan_time = request.form.get('time')
    predicted_class = request.form.get('predicted_class', 'Unknown')
    confidence = request.form.get('confidence', 0)
    
    if scan_time:
        try:
            scan_time = float(scan_time)
            confidence = float(confidence)
            
            logging_service.log_detection(
                predicted_class, 
                confidence, 
                scan_time
            )
            
            print(f"Scan time received: {scan_time} seconds")
            print("--------------------------------------------")
            
            return jsonify({'success': 'Time Received'}), 200
        
        except ValueError:
            print("Invalid scan_time or confidence value received")
            return jsonify({'error': 'Invalid values'}), 400
    
    return jsonify({'error': 'No scan time provided'}), 400