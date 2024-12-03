from queue import Queue
import time
from threading import Thread

from models.object_detector import ObjectDetector
from models.image_processor import ImageProcessor
from config import Config

class DetectionService:
    def __init__(self):
        self.object_detector = ObjectDetector()
        self.image_processor = ImageProcessor()
        self.request_queue = Queue()
        self.results = {}

    def process_image(self, file):
        print("Processing Image...")
        image = self.image_processor.convert_to_jpg(file)
        
        if image is None:
            print("Image conversion failed.")
            return {"leaf_detected": False}
        
        print(image)
        dino_results = self.object_detector.detect_object_with_dino(image)
        print(f"Dino results: {dino_results}")

        if not dino_results or "boxes" not in dino_results[0] or dino_results[0]["boxes"].shape[0] == 0:
            print("No objects detected with Dino.")
            return {"leaf_detected": False}

        yolov8_results = self.object_detector.detect_and_classify_leaf(image)
        print(f"YOLOv8 results: {yolov8_results}")
        return yolov8_results


    def start_processing_thread(self):
        print("START PROCESSING THREAD")
        processing_thread = Thread(target=self._process_request_queue)
        processing_thread.daemon = True
        processing_thread.start()
        print("Processing thread started.")

    def _process_request_queue(self):
        while True:
            if self.request_queue.qsize() > 0:
                file, request_id = self.request_queue.get()
                print(f"Processing request {request_id}...")
                self.results[request_id] = self.process_image(file)
                self.request_queue.task_done()
            else:
                print("No requests to process, waiting...")
                time.sleep(0.1)

    def add_request(self, file):
        request_id = str(time.time())
        self.request_queue.put((file, request_id))
        print(f"REQUEST ADDED: {request_id}")
        print(f"Queue size: {self.request_queue.qsize()}")  
        return request_id


    def get_result(self, request_id):
        while request_id not in self.results:
            time.sleep(0.1)

        result = self.results.pop(request_id)
        return result