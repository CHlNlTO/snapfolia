import React, { useState } from 'react';
import LeafCard from './LeafCard';
import SearchBar from './SearchBar';
import leaves from '../data/leaves';
import '../styles/Datasets.css';

function Datasets() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('all');

  const filteredLeaves = leaves.filter(leaf => 
    leaf.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (location === 'all' || leaf.location === location)
  );

  return (
    <section className="container-fluid d-flex flex-column justify-content-center align-items-center p-3 pt-5 mt-5 animate-fade-in">
      <h1 className="d-flex justify-content-center fw-bold py-3 color-dgreen">Leaf Datasets</h1>
      <SearchBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        location={location}
        setLocation={setLocation}
      />
      <div className="leaf-grid">
        {filteredLeaves.map(leaf => (
          <LeafCard key={leaf.id} leaf={leaf} />
        ))}
      </div>
    </section>
  );
}

export default Datasets;