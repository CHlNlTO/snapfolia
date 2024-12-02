import torch
from transformers import AutoProcessor, AutoModelForZeroShotObjectDetection
from ultralytics import YOLO

class ModelLoader:
    """Handles loading and managing machine learning models. """

    def __init__(self, config):
        """
        Initialize model loader with configuration.
        """
        
        self.config = config
        self.device = None
        self.yolov8_model = None
        self.grounding_dino_model = None
        self.grounding_dino_processor = None
        
    def _setup_device(self):
        if torch.cuda.is_available():
            self.device = torch.device('cuda')
            print(f"Using CUDA: {torch.version.cuda}")
        else:
            self.device = torch.device('cpu')
            print("CUDA not available, using CPU.")
        
        return self.device
    
    def load_yolov8(self):
        self.yolov8_model = YOLO(self.config.YOLOV8_MODEL_PATH)
        print("YOLOV8 Model Loaded.")
        return self.yolov8_model
    
    def load_grounding_dino(self):
        device = self._setup_device()

        self.grounding_dino_processor = AutoProcessor.from_pretrained(
            self.config.GROUNDING_DINO_MODEL_ID,
            cache_dir = self.config.CUSTOM_CACHE_DIR
        )
        
        self.grounding_dino_model = AutoModelForZeroShotObjectDetection.from_pretrained(
        self.config.GROUNDING_DINO_MODEL_ID, 
        cache_dir=self.config.CUSTOM_CACHE_DIR
        ).to(device)
        
        self.grounding_dino_model.eval()
        print(f"Grounding DINO model loaded with cache at {self.config.CUSTOM_CACHE_DIR}.")
        
        return self.grounding_dino_model, self.grounding_dino_processor, device