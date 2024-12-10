from flask import Blueprint, request, jsonify
from celery_worker import process_image_task
from configuration.config import Config
from services.logging_service import LoggingService
import logging
import os

upload_bp = Blueprint('upload', __name__)
logging_service = LoggingService(Config)
logger = logging.getLogger(__name__)

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

    file_size = file.content_length 
    logger.info(f"File size: {file_size} bytes")
    
    file_path = os.path.join(Config.UPLOAD_FOLDER, file.filename)
    
    file.save(file_path)

    task = process_image_task.apply_async(args=[file_path])  
    result = task.get()

    if "error" in result:
        return jsonify({'error': result['error']}), 500

    return jsonify(result), 200

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