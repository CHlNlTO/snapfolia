import React from 'react';
import '../styles/Leaf.css';

const Leaf = ({ leaf }) => {
  return (
    <div className="leaf-container">
      <h2>{leaf.englishName} ({leaf.scientificName})</h2>
      {leaf.otherNames.length > 0 && (
        <p><strong>Also known as:</strong> {leaf.otherNames.join(', ')}</p>
      )}
      <img src={leaf.imageUrl} alt={leaf.englishName} className="leaf-image" />
      
      <h3>Description</h3>
      <p>{leaf.description.generalInfo}</p>
      
      <h3>Botany</h3>
      <p>{leaf.description.botany}</p>
      
      <h3>Distribution</h3>
      <ul>
        {leaf.description.distribution.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      
      <h3>Uses</h3>
      <ul>
        {leaf.uses.map((use, index) => (
          <li key={index}>{use}</li>
        ))}
      </ul>
      
      {leaf.folklore.length > 0 && (
        <>
          <h3>Folklore</h3>
          <ul>
            {leaf.folklore.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Leaf;