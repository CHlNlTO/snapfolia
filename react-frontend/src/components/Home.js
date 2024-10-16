import React, { useState, useEffect } from "react";
import UserGuide from "./UserGuide";
import "../styles/Home.css";
import { uploadImage, sendScanTime } from "../services/api";
import leaves from "../data/leaves";
import ResultDisplay from "./ResultDisplay";
import heic2any from 'heic2any';
import ErrorAlertDialog from "./ErrorAlertDialog";

function Home() {
  const initialScanResult = {
    filipinoName: "Filipino Name",
    englishName: "English Name",
    scientificName: "Scientific Name",
    scanTime: "Not Yet Scanned",
    probability: "Probability",
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [scanResult, setScanResult] = useState(initialScanResult);
  const [isUploading, setIsUploading] = useState(false);
  const [showScanCapture, setShowScanCapture] = useState(false);
  const [isScanned, setIsScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log('ErrorDialog state changed:', { isErrorDialogOpen, errorMessage });
  }, [isErrorDialogOpen, errorMessage]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
        try {
          const jpegBlob = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.8
          });
          displayImage(jpegBlob);
          setSelectedFile(new File([jpegBlob], file.name.replace('.heic', '.jpg'), { type: 'image/jpeg' }));
        } catch (error) {
          console.error('Error converting HEIC to JPEG:', error);
          handleFailedLeafDetection('Error processing the image. Please try a different file.');
        }
      } else {
        displayImage(file);
        setSelectedFile(file);
      }
      showScanButton();
    }
  };

  const handleCapture = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setShowScanCapture(true);
    displayImage(file);
  };

  const displayImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dropArea = document.getElementById("dropArea");
      dropArea.style.backgroundImage = `url(${e.target.result})`;
      dropArea.style.backgroundSize = "cover";
      dropArea.style.backgroundRepeat = "no-repeat";
      dropArea.style.backgroundPosition = "center";
    };
    reader.readAsDataURL(file);
  };

  const showScanButton = () => {
    setShowScanCapture(false);
  };

  const startTimer = () => {
    return Date.now();
  };

  const stopTimer = (startTime) => {
    const endTime = Date.now();
    return ((endTime - startTime) / 1000).toFixed(2);
  };

  const findMatchingLeaf = (label) => {
    return leaves.find(
      (leaf) => leaf.name.toLowerCase() === label.toLowerCase()
    );
  };

  const formatScanResult = (matchingLeaf, confidence, scanTime) => {
    if (matchingLeaf) {
      return {
        filipinoName: matchingLeaf.name,
        englishName: matchingLeaf.englishName,
        scientificName: matchingLeaf.scientificName,
        scanTime: `${scanTime} seconds`,
        probability: `${(confidence * 100).toFixed(2)}%`,
        image: matchingLeaf.image,
        treeImage: matchingLeaf.treeImage,
        generalInfo: matchingLeaf.generalInfo,
        botany: matchingLeaf.botany,
        distribution: matchingLeaf.distribution,
        reference: matchingLeaf.reference,
        uses: matchingLeaf.uses,
        folklore: matchingLeaf.folklore,
        description: matchingLeaf.description,
        location: matchingLeaf.location,
      };
    } else {
      return {
        filipinoName: "Not found",
        englishName: "Not found",
        scientificName: "Not found",
        scanTime: `${scanTime} seconds`,
        probability: `${(confidence * 100).toFixed(2)}%`,
      };
    }
  };

  const handleFailedLeafDetection = (message) => {
    console.log('handleFailedLeafDetection called', message);
    setErrorMessage(message);
    setIsErrorDialogOpen(true);
    console.log('State updated', { errorMessage: message, isErrorDialogOpen: true 
    });
};

  const handleScan = async () => {
    if (!selectedFile) {
      handleFailedLeafDetection("Please select a file first");
      return;
    }
    setIsUploading(true);
    setIsScanned(false);
    setIsLoading(true);
    setScanProgress(0);

    const startTime = startTimer();

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setScanProgress(prevProgress => {
          if (prevProgress >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prevProgress + 10;
        });
      }, 300);

      const result = await uploadImage(selectedFile);
      console.log('Scan result:', result);
      const scanTime = stopTimer(startTime);
  
      clearInterval(progressInterval);
      setScanProgress(100);
  
      await sendScanTime(parseFloat(scanTime));
  
      if (result.leaf_detected === false) {
        console.log('No leaf detected');
        handleFailedLeafDetection("No leaf detected. Please try again.");
        return;
      } 
      
      else if (result.confidence < 0.9) {
        console.log('Low confidence:', result.confidence);
        handleFailedLeafDetection("Image quality is low. Please take a photo again.");
        return;
      }

      let scanResult;
      if (result.leaf_detected) {
        const matchingLeaf = findMatchingLeaf(result.label);
        scanResult = formatScanResult(
          matchingLeaf,
          result.confidence,
          scanTime
        );
      }

      setScanResult(scanResult);
      setIsScanned(true);
    } catch (error) {
    console.error("Error during scan:", error);
    handleFailedLeafDetection("An error occurred during the scan. Please try again.");
  } finally {
    setIsUploading(false);
    setIsLoading(false);
    setScanProgress(0);
  }
  };

  const handleScanAgain = () => {
    setSelectedFile(null);
    setScanResult(initialScanResult);
    setIsUploading(false);
    setShowScanCapture(false);
    setIsScanned(false);
    const dropArea = document.getElementById("dropArea");
    dropArea.style.backgroundImage = "none";
  };

  console.log('Render - ErrorDialog state:', { isErrorDialogOpen, errorMessage });

  return (
    <section className="d-flex flex-column min-vh-100">
      <section className="container-fluid flex-container d-flex align-items-center flex-grow-1">
        <section className="col-lg-5 col-12 container-fluid mx-auto">
          <div className="row">
            <div className="d-flex flex-column align-items-center mt-lg-0 pt-lg-0 mt-5 pt-5">
              <div className="bg-lgreen img-upload border-r d-flex justify-content-center mt-xl-5 mt-sm-3">
                <div
                  className="d-flex flex-column justify-content-center align-items-center border-r"
                  id="dropArea"
                  style={{
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                >
                  {!selectedFile && (
                    <>
                      <i
                        className="fas fa-image color-img-upload img-icon mt-4 mb-2"
                        id="fa-image"
                      ></i>
                      <div className="d-flex flex-column justify-content-center">
                        <label
                          className="btn text-light fs-responsive mb-2 hide-btn show-btn"
                          htmlFor="capture"
                          id="btn-capture"
                          style={{
                            backgroundColor: "#55a375",
                            fontSize: "0.70rem",
                            display: "none",
                          }}
                        >
                          <i className="fas fa-plus me-1"></i>
                          Take a photo
                        </label>
                        <input
                          style={{ display: "none" }}
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
                          style={{
                            backgroundColor: "#55a375",
                            fontSize: "0.70rem",
                          }}
                        >
                          <i className="fas fa-plus me-1"></i>
                          Upload an image
                        </label>
                        <input
                          style={{ display: "none" }}
                          type="file"
                          accept="image/*"
                          name="image"
                          id="file"
                          onChange={handleFileChange}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <button
                className="btn text-light my-3 fs-responsive"
                id="btn-scan"
                onClick={handleScan}
                disabled={isUploading || !selectedFile}
                style={{
                  backgroundColor: "rgb(30, 84, 52)",
                  display: isScanned ? "none" : "block",
                  cursor:
                    isUploading || !selectedFile ? "not-allowed" : "pointer",
                  fontSize: "0.70rem",
                  opacity: isUploading ? 0.7 : 1,
                }}
              >
                {isUploading ? "Scanning..." : "Scan Leaf"}
              </button>

              {isLoading && (
                <div style={{ width: '90%', maxWidth: '300px', margin: '0 auto', marginBottom: '1rem' }}>
                  <div className="progress" style={{ height: '10px' }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      aria-valuenow={scanProgress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{ width: `${scanProgress}%`, backgroundColor: 'rgb(85, 163, 117)' }}
                    ></div>
                  </div>
                </div>
              )}

              <button
                className="btn bg-dgreen text-light my-3 fs-responsive"
                id="btn-cancel"
                onClick={handleScanAgain}
                style={{
                  backgroundColor: "rgb(30, 84, 52)",
                  display: selectedFile && !isScanned ? "block" : "none",
                  fontSize: "0.70rem",
                }}
              >
                Cancel
              </button>

              <button
                className="btn bg-green text-light my-3 fs-responsive"
                id="btn-scan-again"
                onClick={handleScanAgain}
                style={{
                  backgroundColor: "rgb(30, 84, 52)",
                  display: isScanned ? "block" : "none",
                  fontSize: "0.70rem",
                }}
              >
                Scan Again
              </button>
            </div>

            <div className="my-auto text-center pb-3">
              <h1
                className="color-dgreen fw-bold animate-slide-in"
                id="filipino-name"
                style={{ fontSize: "27.2px" }}
              >
                {scanResult.filipinoName}
              </h1>
              <h2
                className="color-dgreen animate-slide-in"
                id="english-name"
                style={{ fontSize: "19.2px" }}
              >
                {scanResult.englishName}
              </h2>
              <h2
                className="color-dgreen fst-italic animate-slide-in"
                id="scientific-name"
                style={{ fontSize: "19.2px" }}
              >
                {scanResult.scientificName}
              </h2>
              <h2
                className="color-dgreen animate-slide-in"
                id="scan-time"
                style={{ fontSize: "19.2px" }}
              >
                Scan Time: {scanResult.scanTime}
              </h2>
              <div className="row ps-3">
                <div className="d-flex flex-row justify-content-center align-items-center animate-slide-in">
                  <h3 style={{ fontSize: "11.2px" }}>
                    <i
                      className="fas fa-square color-dgreen me-1"
                      style={{ fontSize: "11.2px" }}
                    ></i>
                  </h3>
                  <h3
                    className="color-dgreen col-4 fw-bold"
                    id="probability"
                    style={{ fontSize: "11.2px" }}
                  >
                    {scanResult.probability}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="container-fluid d-flex justify-content-center col-lg-7 col-12 mt-lg-5 mt-2 pt-lg-4 pt-2 animate-fade-in">
          <div
            className="col-11 bg-lgreen border-r tree-div mb-4 shadow-sm"
            id="tree"
          >
            <div id="tree-div">
              {isScanned ? (
                <ResultDisplay result={scanResult} />
              ) : (
                <UserGuide />
              )}
            </div>
            <div className="container"></div>
          </div>
        </section>
      </section>
      <footer className="d-flex justify-content-end">
        <p className="btn m-0 color-dgreen copyright">© BSCS Batch 2025</p>
      </footer>

      <ErrorAlertDialog
      isOpen={isErrorDialogOpen}
      onClose={() => {
        console.log('Closing dialog');
        setIsErrorDialogOpen(false);
  }}
      errorMessage={errorMessage}
/>
    </section>
  );
}

export default Home;