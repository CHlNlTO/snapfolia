import React, { useState } from 'react';
import Leaf from './Leaf';
import leafData from '../data/leafData.json';
import '../styles/LeafGallery.css';

const LeafGallery = () => {
  const [selectedLeaf, setSelectedLeaf] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLeaves = leafData.leaves.filter(leaf => 
    leaf.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leaf.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="leaf-gallery">
      <input
        type="text"
        placeholder="Search leaves..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className="leaf-list">
        {filteredLeaves.map(leaf => (
          <div 
            key={leaf.id} 
            className="leaf-item"
            onClick={() => setSelectedLeaf(leaf)}
          >
            <img src={leaf.imageUrl} alt={leaf.englishName} />
            <p>{leaf.englishName}</p>
          </div>
        ))}
      </div>
      {selectedLeaf && (
        <div className="leaf-details">
          <button onClick={() => setSelectedLeaf(null)}>Close</button>
          <Leaf leaf={selectedLeaf} />
        </div>
      )}
    </div>
  );
};

export default LeafGallery;