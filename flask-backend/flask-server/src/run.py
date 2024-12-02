import os
from app import leaf_app  # Import leaf_app, which is an instance of LeafDetectionApp

def main():
    # Check if SSL certificate and key exist
    cert_path = "C:\\certificates\\treesbe.firstasia.edu.ph-crt.pem"
    key_path = "C:\\certificates\\treesbe.firstasia.edu.ph-key.pem"
    
    if not os.path.exists(cert_path) or not os.path.exists(key_path):
        print("SSL certificate or key file not found.")
        return
    
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
