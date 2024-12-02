from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import time
import os
from queue import Queue
from threading import Thread

from config import Config
from models import ModelLoader
from logger import LeafLogger
from image_processor import ImageProcessor

class LeafDetectionApp:
    def __init__(self):
        # Configuration
        self.config = Config
        self.config.initialize_directories()

        # Flask Setup
        self.app = Flask(__name__)
        CORS(self.app)

        # Model and processing setup
        self.model_loader = ModelLoader(self.config)
        self.models = self._initiaize_models()

        # Logger
        self.logger = LeafLogger(self.config)

        # Image Processor
        self.image_processor = ImageProcessor(self.models)
        
        # Request queue
        self.request_queue = Queue()
        self.results = {}

        # Setup routes
        self._setup_routes()
    
    def _initiaize_models(self):
        class Models:
            def __init__(self, yolo, dino_model, dino_processor, device):
                self.yolov8_model = yolo
                self.grounding_dino_model = dino_model
                self.grounding_dino_processor = dino_processor
                self.device = device
        
        yolo = self.model_loader.load_yolov8()
        dino_model, dino_processor, device = self.model_loader.load_grounding_dino()
        print("Models Sucessfully Loaded")
        
        return Models(yolo, dino_model, dino_processor, device)
    
    def _setup_routes(self):
        self.app.route('/')(self.index)
        self.app.route('/upload', methods=['POST'])(self.upload_file)
        self.app.route('/scan-time', methods=['POST'])(self.get_scan_time)

    def index(self):
        print("Server is running...")
        return jsonify({'message': 'Server is running'})

    def upload_file(self):
        if 'file' not in request.files:
            print("No file part in request")
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']
        if file.filename == '':
            print("No selected file")
            return jsonify({'error': 'No selected file'}), 400

        # Add file to the processing queue
        request_id = str(time.time())
        self.request_queue.put((file, request_id))

        # Wait for the result
        while request_id not in self.results:
            time.sleep(0.1)

        # Retrieve the processing result
        result = self.results.pop(request_id)

        if result.get("leaf_detected"):
            confidence = result.get("confidence", 0)
            if confidence < 0.9:
                # Use the confidence score to create the file name
                file_name = f"{confidence:.2f}_{secure_filename(file.filename)}"
                file_path = os.path.join(self.config.UPLOAD_FOLDER, file_name)
                file.seek(0)
                file.save(file_path)
                print(f"Leaf image saved to {file_path}")
        else:
            print("No leaf detected. Image not saved.")

        return jsonify(result)

    def get_scan_time(self):
        scan_time = request.form.get('time')
        if scan_time:
            try:
                scan_time = float(scan_time)
                print(f"Scan time received: {scan_time} seconds")
                print("--------------------------------------------")
                
            except ValueError:
                print("Invalid scan_time value received")
        return jsonify({'success': 'Time Received'}), 200

    def process_request(self):
        while True:
            batch = []
            
            for _ in range(self.config.BATCH_SIZE):
                if not self.request_queue.empty():
                    batch.append(self.request_queue.get())
                else:
                    break
                    
            if not batch:
                time.sleep(1) 
                continue
                
            for file, request_id in batch:
                self.results[request_id] = self.image_processor.process_image(file)
                
            for _ in range(len(batch)):
                self.request_queue.task_done()

    def run(self):
        processing_thread = Thread(target=self.process_request)
        processing_thread.daemon = True
        processing_thread.start()