from flask import Flask
from flask_cors import CORS
from configuration.config import Config

def create_app():
    Config.initialize_directories()
    
    app = Flask(__name__)
    
    CORS(app)
    
    from routes.routes import upload_bp
    app.register_blueprint(upload_bp)
    
    return app