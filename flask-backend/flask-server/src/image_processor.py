import io 
import torch
from PIL import Image, UnidentifiedImageError
import imageio.v3 as iio
from pillow_heif import read_heif

class ImageProcessor:
    def __init__(self, models):
        """
        Initialize image processor with models.
        
        :param models: ModelLoader instance with loaded models
        """
        self.yolov8_model = models.yolov8_model
        self.grounding_dino_model = models.grounding_dino_model
        self.grounding_dino_processor = models.grounding_dino_processor
        self.device = models.device
    
    def convert_to_jpg(self, file):
        try:
            file_content = file.read()
            file.seek(0)

            if file.filename.lower().endswith('.heic'):
                heif_file = read_heif(io.BytesIO(file_content))
                image = Image.frombytes(
                    heif_file.mode, 
                    heif_file.size, 
                    heif_file.data, 
                    "raw", 
                    heif_file.mode, 
                    heif_file.stride
                )
            elif file.filename.lower().endswith('.avif'):
                avif_image = iio.imread(io.BytesIO(file_content))
                image = Image.fromarray(avif_image)
            else:
                image = Image.open(io.BytesIO(file_content))

            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            print(f"Converted {file.filename} to JPG")
            return image

        except UnidentifiedImageError as e:
            print(f"Error: Cannot identify image file {file.filename} - {e}")
            return None
        except Exception as e:
            print(f"Error converting {file.filename} to JPG: {e}")
            return None

    def detect_objects_with_dino(self, image):
        print("Running Grounding Dino...")
        inputs = self.grounding_dino_processor(
            images=image,
            text=" a leaf. leaves. ",
            return_tensors="pt"
        ).to(self.device)

        with torch.no_grad():
            outputs = self.grounding_dino_model(**inputs)
        
        results = self.grounding_dino_processor.post_process_grounded_object_detection(
            outputs,
            inputs.input_ids,
            box_threshold=0.4,
            text_threshold=0.3,
            target_sizes=[image.size[::-1]]
        )
        
        return results

    def detect_and_classify_leaf(self, image):
        print("Detecting & Classifying Leaf...")
        results = self.yolov8_model(image)
        
        if len(results) > 0 and len(results[0].boxes) > 0:
            predictions = []
            for box in results[0].boxes:
                predicted_class = results[0].names[int(box.cls)]
                confidence = round(float(box.conf), 2)
                predictions.append((predicted_class, confidence))
            
            predictions.sort(key=lambda x: x[1], reverse=True)

            print("\nTop 3 Predictions:")
            for i in range(min(3, len(predictions))):
                predicted_class, confidence = predictions[i]
                print(f"{i+1}. {predicted_class} - Confidence: {confidence}")
            print()

            return {
                "leaf_detected": True,
                "label": predicted_class,
                "confidence": confidence,
            }
            
        return {"leaf_detected": False}

    def process_image(self, file):
        print("\nProcessing Image...")
        image = self.convert_to_jpg(file)

        dino_results = self.detect_objects_with_dino(image)
        if not dino_results or "boxes" not in dino_results[0] or dino_results[0]["boxes"].shape[0] == 0:
            return {"leaf_detected": False}

        yolov8_results = self.detect_and_classify_leaf(image)
        return yolov8_results