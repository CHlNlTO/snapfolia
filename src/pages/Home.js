import React, { useState } from 'react';
import LeafScanner from '../components/LeafScanner';
import TreeInformation from '../components/TreeInformation';
import '../styles/Home.css';

function Home() {
  const [scanResult, setScanResult] = useState(null);

  const handleScanComplete = (result) => {
    setScanResult(result);
  };

  return (
    <div className="home">
      <h1>Welcome to Snapfolia</h1>
      <div className="scanner-section">
        <LeafScanner onScanComplete={handleScanComplete} />
      </div>
      {scanResult && (
        <div className="result-section">
          <h2>{scanResult.label}</h2>
          <p>English Name: {scanResult.englishName}</p>
          <p>Scientific Name: {scanResult.scientificName}</p>
          <p>Probability: {scanResult.probability}%</p>
          <TreeInformation treeId={scanResult.label} />
        </div>
      )}
    </div>
  );
}

export default Home;