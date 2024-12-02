from app import LeafDetectionApp
import os

def main():
    # Check if SSL certificate and key exist
    cert_path = "C:\\certificates\\treesbe.firstasia.edu.ph-crt.pem"
    key_path = "C:\\certificates\\treesbe.firstasia.edu.ph-key.pem"
    
    if not os.path.exists(cert_path) or not os.path.exists(key_path):
        print("SSL certificate or key file not found.")
        return
    
    # Create the Flask application instance
    leaf_app = LeafDetectionApp()
    
    try:
        # Run the application with SSL context
        leaf_app.app.run(
            host='0.0.0.0',
            port=5000,
            ssl_context=(cert_path, key_path),
            debug=False
        )
    except Exception as e:
        print(f"Error starting the server: {e}")

if __name__ == '__main__':
    main()
