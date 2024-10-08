@echo off
:: Change to the directory containing the virtual environment and Flask app
cd /d "E:\Snapfolia - CS\snapfolia\flask-backend\flask-server"

:: Activate the virtual environment
call .\venv\Scripts\activate

:: Run the Flask application
python app.py

:: Deactivate the virtual environment when the Flask app exits
call deactivate

:: Pause to keep the window open in case of errors
pause