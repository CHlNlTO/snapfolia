import axios from 'axios';

const API_URL = "http://localhost:5000";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const sendScanTime = async (time) => {
  const formData = new FormData();
  formData.append('time', time.toFixed(2));

  try {
    const response = await axios.post(`${API_URL}/scan-time`, formData);
    return response.data;
  } catch (error) {
    console.error('Error sending scan time:', error);
    throw error;
  }
};
