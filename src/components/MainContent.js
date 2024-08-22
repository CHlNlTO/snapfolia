import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import ResultDisplay from './ResultDisplay';
import TreeInformation from './TreeInformation';

function MainContent() {
  const [scanResult, setScanResult] = useState(null);

  const handleScanComplete = (result) => {
    setScanResult(result);
  };

  return (
    <main className="flex-grow-1">
      <section className="container-fluid flex-container d-flex align-items-center">
        <section className="col-lg-5 col-12 container-fluid mx-auto mt-500">
          <ImageUpload onScanComplete={handleScanComplete} />
          {scanResult && <ResultDisplay result={scanResult} />}
        </section>
        <section className="container-fluid d-flex justify-content-center col-lg-7 col-12 mt-lg-5 mt-2 pt-lg-4 pt-2 animate-fade-in">
          <TreeInformation />
        </section>
      </section>
    </main>
  );
}

export default MainContent;