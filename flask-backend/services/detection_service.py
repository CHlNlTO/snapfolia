from queue import Queue
import time
from threading import Thread

from models.object_detector import ObjectDetector
from models.image_processor import ImageProcessor
from configuration.config import Config


class DetectionService:
    def __init__(self):
        self.object_detector = ObjectDetector()
        self.image_processor = ImageProcessor()
        self.request_queue = Queue()
        self.results = {}
        self.processing_thread = None

    def process_image(self, file):
        print("\nProcessing Image...")
        image = self.image_processor.convert_to_jpg(file)

        if image is None:
            return {"leaf_detected": False}

        dino_results = self.object_detector.detect_objects_with_dino(image)
        if not dino_results or "boxes" not in dino_results[0] or dino_results[0]["boxes"].shape[0] == 0:
            return {"leaf_detected": False}

        yolov8_results = self.object_detector.detect_and_classify_leaf(image)
        
        # Save image if leaf detected and confidence is low
        if yolov8_results.get("leaf_detected"):
            confidence = yolov8_results.get("confidence", 0)
            if confidence < 0.9:
                self.image_processor.save_image(file, confidence)

        return yolov8_results

    def start_processing_thread(self):
        self.processing_thread = Thread(target=self._process_request_queue)
        self.processing_thread.daemon = True
        self.processing_thread.start()

    def _process_request_queue(self):
        while True:
            batch = []
            
            # Collect a batch of requests
            for _ in range(Config.BATCH_SIZE):
                if not self.request_queue.empty():
                    batch.append(self.request_queue.get())
                else:
                    break
                    
            if not batch:
                time.sleep(1)  # Wait if queue is empty
                continue
                
            # Process the batch
            for file, request_id in batch:
                self.results[request_id] = self.process_image(file)
                
            # Signal that batch processing is complete
            for _ in range(len(batch)):
                self.request_queue.task_done()

    def add_request(self, file):
        request_id = str(time.time())
        self.request_queue.put((file, request_id))
        return request_id

    def get_result(self, request_id):
        while request_id not in self.results:
            time.sleep(0.1)

        result = self.results.pop(request_id)
        return result