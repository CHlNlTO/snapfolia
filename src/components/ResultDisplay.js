import React from 'react';

function ResultDisplay({ result }) {
  return (
    <div className="my-auto text-center pb-3">
      <h1 className="color-dgreen fw-bold animate-slide-in" id="filipino-name">
        {result.label}
      </h1>
      <h2 className="color-dgreen animate-slide-in" id="english-name">
        {result.englishName}
      </h2>
      <h2 className="color-dgreen fst-italic animate-slide-in" id="scientific-name">
        {result.scientificName}
      </h2>
      <h2 className="color-dgreen animate-slide-in" id="scan-time">
        Scan Time: {result.scanTime || 'Not Available'}
      </h2>
      <div className="row ps-3">
        <div className="d-flex flex-row justify-content-center animate-slide-in">
          <h3><i className="fas fa-square color-dgreen me-1"></i></h3>
          <h3 className="color-dgreen col-4 fw-bold" id="probability">
            Probability: {(result.probability * 100).toFixed(2)}%
          </h3>
        </div>
      </div>
    </div>
  );
}

export default ResultDisplay;