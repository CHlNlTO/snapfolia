import React, { useState } from 'react';
import { scan, scanCapture } from '../utils/scanUtils';

function ImageUpload({ onScanComplete }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleScan = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }
    setIsUploading(true);
    const result = await scan(selectedFile);
    setIsUploading(false);
    onScanComplete(result);
  };

  const handleCapture = async (event) => {
    const file = event.target.files[0];
    setIsUploading(true);
    const result = await scanCapture(file);
    setIsUploading(false);
    onScanComplete(result);
  };

  return (
    <div className="d-flex flex-column align-items-center mt-lg-0 pt-lg-0 mt-5 pt-5">
      <div className="bg-lgreen img-upload border-r d-flex justify-content-center mt-xl-5 mt-sm-3">
        <div id="dropArea" className="d-flex flex-column justify-content-center align-items-center border-r">
          <i className="fas fa-image color-img-upload img-icon mt-4 mb-2" id="fa-image"></i>
          <div className="d-flex flex-column justify-content-center">
            {/* <label className="btn bg-green text-light fs-responsive mb-2 hide-btn show-btn" htmlFor="capture">
              <i className="fas fa-plus me-1"></i>
              Take a photo
            </label> */}
            <input
              style={{ display: 'none' }}
              type="file"
              accept="image/*"
              name="image"
              id="capture"
              capture="user"
              onChange={handleCapture}
            />
            <label className="btn bg-green text-light fs-responsive" htmlFor="file">
              <i className="fas fa-plus me-1"></i>
              Upload an image
            </label>
            <input
              style={{ display: 'none' }}
              type="file"
              accept="image/*"
              name="image"
              id="file"
              onChange={handleFileChange}
            />
          </div>
        </div>
        {selectedFile && (
          <div className="border-r img-uploaded" style={{backgroundImage: `url(${URL.createObjectURL(selectedFile)})`}}></div>
        )}
      </div>
      <button
        className="btn bg-dgreen text-light my-3 fs-responsive"
        onClick={handleScan}
        disabled={isUploading}
      >
        {isUploading ? 'Scanning...' : 'Scan Leaf'}
      </button>
    </div>
  );
}

export default ImageUpload;