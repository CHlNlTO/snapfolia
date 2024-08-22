import React, { useState } from "react";
import UserGuide from "./UserGuide";
import "../styles/Home.css";
import { uploadImage, sendScanTime } from "../services/api";
import leaves from "../data/leaves";
import ResultDisplay from "./ResultDisplay";

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    showScanButton();
    displayImage(file);
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
      dropArea.style.backgroundSize = "contain";
      dropArea.style.backgroundRepeat = "no-repeat";
      dropArea.style.backgroundPosition = "center";
    };
    reader.readAsDataURL(file);
  };

  const showScanButton = () => {
    setShowScanCapture(false);
  };

  // Utility function to start the timer
  const startTimer = () => {
    return Date.now();
  };

  // Utility function to stop the timer and calculate duration
  const stopTimer = (startTime) => {
    const endTime = Date.now();
    return ((endTime - startTime) / 1000).toFixed(2);
  };

  // Function to find a matching leaf in the database
  const findMatchingLeaf = (label) => {
    return leaves.find(
      (leaf) => leaf.name.toLowerCase() === label.toLowerCase()
    );
  };

  // Function to format the scan result
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

  // Function to handle the case when no leaf is detected
  const handleNoLeafDetected = (scanTime) => {
    return {
      filipinoName: "No leaf detected",
      englishName: "N/A",
      scientificName: "N/A",
      scanTime: `${scanTime} seconds`,
      probability: "N/A",
    };
  };

  // Main handleScan function
  const handleScan = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }
    setIsUploading(true);
    setIsScanned(false);

    const startTime = startTimer();

    try {
      const result = await uploadImage(selectedFile);
      const scanTime = stopTimer(startTime);

      await sendScanTime(parseFloat(scanTime));

      let scanResult;
      if (result.leaf_detected) {
        const matchingLeaf = findMatchingLeaf(result.label);
        scanResult = formatScanResult(
          matchingLeaf,
          result.confidence,
          scanTime
        );
      } else {
        scanResult = handleNoLeafDetected(scanTime);
      }

      setScanResult(scanResult);
      setIsScanned(true);
    } catch (error) {
      console.error("Error during scan:", error);
      setScanResult({
        filipinoName: "Error occurred",
        englishName: "N/A",
        scientificName: "N/A",
        scanTime: "N/A",
        probability: "N/A",
      });
    } finally {
      setIsUploading(false);
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
                          style={{ backgroundColor: "#55a375" }}
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
                          style={{ backgroundColor: "#55a375" }}
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
                  backgroundColor: "#1E5434",
                  display: isScanned ? "none" : "block",
                  cursor:
                    isUploading || !selectedFile ? "not-allowed" : "pointer",
                }}
              >
                {isUploading ? "Scanning..." : "Scan Leaf"}
              </button>

              <button
                className="btn bg-dgreen text-light my-3 fs-responsive"
                id="btn-cancel"
                onClick={handleScanAgain}
                style={{
                  display: selectedFile && !isScanned ? "block" : "none",
                  backgroundColor: "#1E5434",
                }}
              >
                Cancel
              </button>

              <button
                className="btn bg-green text-light my-3 fs-responsive"
                id="btn-scan-again"
                onClick={handleScanAgain}
                style={{
                  display: isScanned ? "block" : "none",
                  backgroundColor: "#1E5434",
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
    </section>
  );
}

export default Home;
