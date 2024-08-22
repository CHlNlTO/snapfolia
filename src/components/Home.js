import React, { useState, useEffect } from 'react';
import UserGuide from './UserGuide';
import '../styles/Home.css';

function Home() {
  const initialScanResult = {
    filipinoName: 'Filipino Name',
    englishName: 'English Name',
    scientificName: 'Scientific Name',
    scanTime: 'Not Yet Scanned',
    probability: 'Probability'
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [scanResult, setScanResult] = useState(initialScanResult);
  const [isUploading, setIsUploading] = useState(false);
  const [showScanCapture, setShowScanCapture] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    showScanButton();
  };

  const handleCapture = (event) => {
    setSelectedFile(event.target.files[0]);
    setShowScanCapture(true);
  };

  const showScanButton = () => {
    setShowScanCapture(false);
  };

  const handleScan = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }
    setIsUploading(true);
    setTimeout(() => {
      setScanResult({
        filipinoName: 'Sample Filipino Name',
        englishName: 'Sample English Name',
        scientificName: 'Sample Scientific Name',
        scanTime: '2 seconds',
        probability: '95%'
      });
      setIsUploading(false);
    }, 2000);
  };

  const handleScanAgain = () => {
    setSelectedFile(null);
    setScanResult(initialScanResult);
    setIsUploading(false);
    setShowScanCapture(false);
  };

  return (
    <section className="d-flex flex-column min-vh-100">
      <section className="container-fluid flex-container d-flex align-items-center flex-grow-1">
        <section className="col-lg-5 col-12 container-fluid mx-auto mt-500">
          <div className="row">
            <div className="d-flex flex-column align-items-center mt-lg-0 pt-lg-0 mt-5 pt-5">
              <div className="bg-lgreen img-upload border-r d-flex justify-content-center mt-xl-5 mt-sm-3">
                <div className="d-flex flex-column justify-content-center align-items-center border-r" id="dropArea">
                  <i className="fas fa-image color-img-upload img-icon mt-4 mb-2" id="fa-image"></i>
                  <div className="d-flex flex-column justify-content-center">
                    <label
                      className="btn text-light fs-responsive mb-2 hide-btn show-btn"
                      htmlFor="capture"
                      id="btn-capture"
                      style={{ backgroundColor: '#55a375' }}
                    >
                      <i className="fas fa-plus me-1"></i>
                      Take a photo
                    </label>
                    <input
                      style={{ display: 'none' }}
                      type="file"
                      accept="image/*"
                      name="image"
                      id="capture"
                      capture="user"
                      onChange={handleCapture}
                    />
                    <label
                      className="btn text-light fs-responsive"
                      htmlFor="file"
                      id="btn-upload"
                      style={{ backgroundColor: '#55a375' }}
                    >
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
                  <div
                    className="border-r img-uploaded"
                    id="imgBox"
                    style={{ backgroundImage: `url(${URL.createObjectURL(selectedFile)})` }}
                  ></div>
                )}
              </div>

              <progress className="my-4 d-none" id="upload-progress" value="0" max="100"></progress>

              {showScanCapture && (
                <button
                  className="btn text-light my-3 fs-responsive show-scan-capture"
                  id="btn-scan-capture"
                  onClick={handleScan}
                  style={{ backgroundColor: '#1E5434' }}
                >
                  Scan Leaf
                </button>
              )}

              {!showScanCapture && (
                <button
                  className="btn text-light my-3 fs-responsive"
                  id="btn-scan"
                  onClick={handleScan}
                  disabled={isUploading}
                  style={{ backgroundColor: '#1E5434' }}
                >
                  {isUploading ? 'Scanning...' : 'Scan Leaf'}
                </button>
              )}

              <button
                className="btn bg-dgreen text-light my-3 fs-responsive"
                id="btn-cancel"
                onClick={handleScanAgain}
                style={{ display: selectedFile ? 'block' : 'none' }}
              >
                Cancel
              </button>

              <button
                className="btn bg-green text-light my-3 fs-responsive"
                id="btn-scan-again"
                onClick={handleScanAgain}
                style={{ display: scanResult !== initialScanResult ? 'block' : 'none' }}
              >
                Scan Again
              </button>
            </div>

            <div className="my-auto text-center pb-3">
              <h1
                className="color-dgreen fw-bold animate-slide-in"
                id="filipino-name"
                style={{ fontSize: '27.2px' }}
              >
                {scanResult.filipinoName}
              </h1>
              <h2
                className="color-dgreen animate-slide-in"
                id="english-name"
                style={{ fontSize: '19.2px' }}
              >
                {scanResult.englishName}
              </h2>
              <h2
                className="color-dgreen fst-italic animate-slide-in"
                id="scientific-name"
                style={{ fontSize: '19.2px' }}
              >
                {scanResult.scientificName}
              </h2>
              <h2
                className="color-dgreen animate-slide-in"
                id="scan-time"
                style={{ fontSize: '19.2px' }}
              >
                Scan Time: {scanResult.scanTime}
              </h2>
              <div className="row ps-3">
                <div className="d-flex flex-row justify-content-center align-items-center animate-slide-in">
                  <h3 style={{ fontSize: '11.2px' }}>
                    <i className="fas fa-square color-dgreen me-1" style={{ fontSize: '11.2px' }}></i>
                  </h3>
                  <h3
                    className="color-dgreen col-4 fw-bold"
                    id="probability"
                    style={{ fontSize: '11.2px' }}
                  >
                    {scanResult.probability}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="container-fluid d-flex justify-content-center col-lg-7 col-12 mt-lg-5 mt-2 pt-lg-4 pt-2 animate-fade-in">
          <div className="col-11 bg-lgreen border-r tree-div mb-4 shadow-sm" id="tree">
            <div id="tree-div">
              <UserGuide />
            </div>
            <div className="container"></div>
          </div>
        </section>
      </section>
      <footer className="d-flex justify-content-end">
        <p className="btn m-0 color-dgreen copyright">© BSCS Batch 2025</p>
      </footer>
    </section>
  );
}

export default Home;
