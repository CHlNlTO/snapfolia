# docker run -p 8080:8080 flask-backend
FROM pytorch/pytorch:2.3.1-cuda12.1-cudnn8-runtime

RUN python --version

RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /snap-backend

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

CMD ["python", "app.py"]


