# Use the official Python image from the Docker Hub
FROM python:3.12.4-slim

# Set the working directory in the container
WORKDIR /app

# Copy the Flask server files into the container
COPY flask-server/ .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port Flask is running on
EXPOSE 5000

# Define the command to run the application
CMD ["python", "app.py"]
