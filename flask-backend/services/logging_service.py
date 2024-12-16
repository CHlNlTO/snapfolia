import logging
import os 
from configuration.config import Config

class LoggingService: 
    def __init__(self, config):
        self.config = Config()
        self._setup_logging()

    def _setup_logging(self):
        log_dir = os.path.dirname(self.config.LOG_FILE)
        os.makedirs(log_dir, exist_ok=True)

        # Configure logging
        logging.basicConfig(
            filename=self.config.LOG_FILE, 
            level=logging.INFO,
            format='%(asctime)s,%(levelname)s,%(message)s',
            datefmt='%Y/%m/%d %H:%M:%S'
        )

    def log_detection(self, predicted_class, confidence, scan_time):
        """
        Log leaf detection details.
        
        :param predicted_class: Detected leaf class
        :param confidence: Detection confidence
        :param scan_time: Time taken for scanning
        """
        log_message = f"{predicted_class},{confidence},{scan_time}"
        logging.info(log_message)
        
        # Optional: Print to console as well
        print(log_message)