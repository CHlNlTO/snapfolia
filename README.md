# Update Notes
## Version v2.2.0
### Key Features and Changes
- **Gunicorn Integration**
  - Added Gunicorn as the WSGI HTTP server for serving the Flask application.
  - Configured the Docker Compose file to use Gunicorn with 4 worker processes and SSL support.
  - Command used:
    ```
    gunicorn -w 4 -b 0.0.0.0:5000 --certfile=${SSL_CERT} --keyfile=${SSL_KEY} app:app
    ```
- **Modified Files**:
  - `docker-compose.yml`: Added configurations for Gunicorn command and SSL certificate paths.
  - `app.py`: Adjusted the application initialization to ensure compatibility with Gunicorn.
  - `create_app.py`: Ensured the application factory is optimized for deployment.
    
- **Certificate Fixes**:
  - Validated paths and existence of SSL certificate and key files during startup.
  - Improved error logging for missing or invalid certificate files.

### Configuration Updates
1. **Environment Variables**:
   - `SSL_CERT` and `SSL_KEY` are now required for SSL support.
   - These should point to the paths of the certificate and key files, respectively.
2. **Docker Compose**:
   - Updated the `flask-backend` service in the `d
