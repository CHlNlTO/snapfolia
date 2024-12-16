import React, { useState } from 'react';
import { useDragDrop } from '../utils/dragDrop';
import { uploadImage, sendScanTime } from '../services/api';
import '../styles/LeafScanner.css';

function LeafScanner({ onScanComplete }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileDrop = (file) => {
    setSelectedFile(file);
  };

  const { isDragging, handleDragEnter, handleDragLeave, handleDragOver, handleDrop } = useDragDrop(handleFileDrop);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleScan = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    setIsUploading(true);
    const startTime = Date.now();

    try {
      const result = await uploadImage(selectedFile);

      if (!result.leaf_detected) {
        alert('Image does not contain a leaf.');
        return;
      }

      const scanTime = (Date.now() - startTime) / 1000; // Convert to seconds
      await sendScanTime(scanTime);

      onScanComplete({
        label: result.label,
        englishName: result.english_name,
        scientificName: result.scientific_name,
        probability: (result.confidence * 100).toFixed(2),
        scanTime: scanTime.toFixed(2)
      });
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while scanning the leaf');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div 
      className={`leaf-scanner ${isDragging ? 'dragging' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input type="file" onChange={handleFileChange} accept="image/*" />
      {selectedFile && (
        <div className="image-preview" style={{backgroundImage: `url(${URL.createObjectURL(selectedFile)})`}}></div>
      )}
      <button onClick={handleScan} disabled={isUploading}>
        {isUploading ? 'Scanning...' : 'Scan Leaf'}
      </button>
      {isDragging && <div className="drag-overlay">Drop your image here</div>}
    </div>
  );
}

export default LeafScanner;