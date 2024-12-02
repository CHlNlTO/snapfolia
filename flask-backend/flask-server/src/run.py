from app import LeafDetectionApp

def main():
    snapfolia = LeafDetectionApp()

    snapfolia.app.run(
        host='0.0.0.0',
        port=5000,
        ssl_context=(
            "C:\\certificates\\treesbe.firstasia.edu.ph-crt.pem", 
            "C:\\certificates\\treesbe.firstasia.edu.ph-key.pem"
        ),
        debug=False
    )

if __name__ == '__main__':
    main()