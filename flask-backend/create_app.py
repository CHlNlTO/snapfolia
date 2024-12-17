from flask import Flask
from flask_cors import CORS
from configuration.config import Config

def create_app():
    # Initialize directories
    Config.initialize_directories()
    
    # Create Flask app instance
    app = Flask(__name__)
    
    # Enable Cross-Origin Resource Sharing
    CORS(app)
    
    # Register blueprints
    from routes.routes import upload_bp
    app.register_blueprint(upload_bp)
    
    return app