# Flask Server

Instructions to run the backend flask server.

## Prerequisites

- Python 3.\*
- pip 24.\*

## Instructions

1. Using the terminal, navigate to the flask-server folder path:

```
cd path/to/Snapfolia/web/flask-server
```

2. Create a virtual environment:

```
python -m venv venv
```

3. Activate the virtual environment. You should be in the **flask-server** folder:

```
venv\Scripts\activate
```

4. Install dependencies:

```
pip install -r requirements.txt
```

5. Run the Flask application. Make sure that you are on the flask-server folder:

```
python app.py
```

If that didn't work, try this:

```
flask run
```

You have now successfully started the backend server. If you haven't started running the frontend server, kindly do so and interact with the backend server to test the web application.

## Concerns

- If you encounter compatibility issues with the version dependencies, try to install the compatible version for the modules.

- When you initially click the scan button of the application, it needs to download the grounding-dino object detection model first.

- If a network issue persists, locate the `script.js` within the following folder:
  ```
  web/static/script/script.js
  ```

Review if you have the same url link as the current running backend url address of the Flask server with the corresponding url within the script.js file.

- The structure of the resulting data is as follows:
  ```
  results = {
    0: {
      'box': [
        int,
        int,
        int,
        int,
      ],
      'label': string,
      'confidence': float,
    }
  }
  ```

Happy coding!

- CHlNlTO
