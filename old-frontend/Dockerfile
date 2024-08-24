# Use an official CUDA-enabled Python runtime as a parent image
FROM nvidia/cuda:12.1.1-cudnn8-runtime-ubuntu20.04

# Set the working directory in the container
WORKDIR /app

# Install dependencies, including Python 3.9.12
RUN apt-get update && \
    apt-get install -y software-properties-common wget && \
    add-apt-repository -y ppa:deadsnakes/ppa && \
    apt-get update && \
    apt-get install -y python3.9 python3.9-dev python3.9-distutils libgl1-mesa-glx libglib2.0-0 libsm6 libxext6 libxrender1 libx11-dev && \
    wget https://bootstrap.pypa.io/get-pip.py && \
    python3.9 get-pip.py && \
    rm -rf /var/lib/apt/lists/* && \
    rm get-pip.py

# Set Python 3.9 as the default python3 and pip3
RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.9 1 && \
    update-alternatives --install /usr/bin/pip3 pip3 /usr/local/bin/pip3.9 1

# Copy the requirements file into the container
COPY requirements.txt ./

# Install Python packages
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the rest of the working directory contents into the container
COPY . .

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Run the application
CMD ["python3.9", "app.py"]
