import sys
import os
import logging
from create_app import create_app

sys.path.append(os.path.abspath(os.path.dirname(__file__)))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info("Initializing Flask app...")
app = create_app()

if __name__ == '__main__':
    logger.info("Starting Flask app...")
    app.run(
            host='0.0.0.0',
            port=5000,
            ssl_context=("../../certificates/treesbe.firstasia.edu.ph-crt.pem",
                         "../../certificates/treesbe.firstasia.edu.ph-key.pem"),
            debug=False
        )