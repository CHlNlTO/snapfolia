import React, { useState } from 'react';
import LeafModal from './LeafModal';
import '../styles/Datasets.css';

function LeafCard({ leaf }) {
    const [showModal, setShowModal] = useState(false);
  
    return (
      <div className="leaf-card">
        <button
          className="leaf-button"
          onClick={() => setShowModal(true)}
        >
          <div className="leaf-image-container">
            <img
              className="leaf-image"
              src={leaf.image}
              alt={leaf.name}
            />
          </div>
          <div className="leaf-info">
            <h2 className="leaf-name">{leaf.name}</h2>
            <p className="leaf-english-name">{leaf.englishName}</p>
          </div>
        </button>
        <LeafModal leaf={leaf} show={showModal} onHide={() => setShowModal(false)} />
      </div>
    );
  }
export default LeafCard;