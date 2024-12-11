from flask import Flask
from flask_cors import CORS
from configuration.config import Config
import os

def create_app():
    Config.initialize_directories()
    
    app = Flask(__name__)
    
    if os.path.exists(Config.SSL_CERT) and os.path.exists(Config.SSL_KEY):
        app.logger.info("SSL certificate and key are loaded successfully.")
    else:
        app.logger.error("SSL certificate or key is missing.")
    
    CORS(app)
    
    from routes.routes import upload_bp
    app.register_blueprint(upload_bp)
    
    return app