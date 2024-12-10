import io
from PIL import Image, UnidentifiedImageError
import imageio.v3 as iio
from pillow_heif import read_heif
from werkzeug.utils import secure_filename
import os
from configuration.config import Config
import logging

logger = logging.getLogger(__name__)

class ImageProcessor:
    @staticmethod
    def convert_to_jpg(file):
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
            
            return image

        except UnidentifiedImageError as e:
            print(f"Error: Cannot identify image file {file.filename} - {e}")
            return None
        except Exception as e:
            print(f"Error converting {file.filename} to JPG: {e}")
            return None

    @staticmethod
    def save_image(file, confidence):
        file_name = f"{confidence:.2f}_{secure_filename(file.filename)}"
        file_path = os.path.join(Config.UPLOAD_FOLDER, file_name)
        file.seek(0)
        file.save(file_path)
        print(f"Leaf image saved to {file_path}")
        return file_path