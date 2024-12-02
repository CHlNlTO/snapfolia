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
    """Main Flask application for leaf detection."""
    
    def __init__(self):
        """Initialize the application components."""
        # Configuration
        self.config = Config
        self.config.initialize_directories()
        
        # Flask setup
        self.app = Flask(__name__)
        CORS(self.app)
        
        # Model and processing setup
        self.model_loader = ModelLoader(self.config)
        self.models = self._initialize_models()
        
        # Logger
        self.logger = LeafLogger(self.config)
        
        # Image processor
        self.image_processor = ImageProcessor(self.models)
        
        # Request queue
        self.request_queue = Queue()
        self.results = {}
        
        # Setup routes
        self._setup_routes()

    def _initialize_models(self):
        """
        Load and return models.
        
        :return: Object with loaded models
        """
        class Models:
            def __init__(self, yolo, dino_model, dino_processor, device):
                self.yolov8_model = yolo
                self.grounding_dino_model = dino_model
                self.grounding_dino_processor = dino_processor
                self.device = device
        
        yolo = self.model_loader.load_yolov8()
        dino_model, dino_processor, device = self.model_loader.load_grounding_dino()
        
        return Models(yolo, dino_model, dino_processor, device)
    
    def _setup_routes(self):
        self.app.add_url_rule('/', 'index', self.index)
        self.app.add_url_rule('/upload', 'upload_file', self.upload_file, methods=['POST'])
        self.app.add_url_rule('/scan-time', 'get_scan_time', self.get_scan_time, methods=['POST'])
    
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

        request_id = str(time.time())
        self.request_queue.put((file, request_id))

        # Wait until the result is processed
        while request_id not in self.results:
            time.sleep(0.1)

        result = self.results.pop(request_id)

        # Handle saving the file if a leaf is detected
        if result.get("leaf_detected"):
            confidence = result.get("confidence", 0)
            if confidence < 0.9:
                # Save the image with a confidence-based filename
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
        """Process requests in batches using a background thread."""
        while True:
            batch = []
            
            # Collect a batch of requests up to BATCH_SIZE
            for _ in range(self.config.BATCH_SIZE):
                if not self.request_queue.empty():
                    batch.append(self.request_queue.get())
                else:
                    break
                    
            if not batch:
                time.sleep(1)  # Wait if queue is empty
                continue
                
            # Process each request in the batch
            for file, request_id in batch:
                print(f"Processing request {request_id}...")  # Debug print to track requests
                self.results[request_id] = self.image_processor.process_image(file)
                
            # Signal that batch processing is complete
            for _ in range(len(batch)):
                self.request_queue.task_done()
    
    def run(self):
        """Run the Flask app and start the background thread for processing."""
        # Start the background thread for request processing
        processing_thread = Thread(target=self.process_request)
        processing_thread.daemon = True
        processing_thread.start()

        # Start the Flask app
        self.app.run(debug=True)
