import React, { useState, useEffect } from 'react';
import '../styles/Datasets.css';

function Datasets() {
  const [trees, setTrees] = useState([]);
  const [filteredTrees, setFilteredTrees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('all');

  useEffect(() => {
    // Fetch tree data from your API or import from a local file
    // For now, we'll use a placeholder
    const fetchTrees = async () => {
      // Replace this with actual API call or data import
      const dummyTrees = [
        { id: 'acacia', name: 'Acacia', englishName: 'Acacia', location: 'faith-colleges' },
        { id: 'alibangbang', name: 'Alibangbang', englishName: 'Butterfly Tree', location: 'batangas-lakelands' },
        // ... add more trees
      ];
      setTrees(dummyTrees);
      setFilteredTrees(dummyTrees);
    };
    fetchTrees();
  }, []);

  useEffect(() => {
    const results = trees.filter(tree =>
      (tree.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       tree.englishName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (location === 'all' || tree.location === location)
    );
    setFilteredTrees(results);
  }, [searchTerm, location, trees]);

  return (
    <div className="datasets-container">
      <h1>Leaf Datasets</h1>
      <div className="filters">
        <input
          type="text"
          placeholder="Search trees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="all">All Locations</option>
          <option value="faith-colleges">FAITH Colleges</option>
          <option value="batangas-lakelands">Batangas Lakelands</option>
          <option value="marian-orchard">Marian Orchard</option>
        </select>
      </div>
      <div className="tree-grid">
        {filteredTrees.map(tree => (
          <div key={tree.id} className="tree-card">
            <img src={`/static/img/leaf-${tree.id}.jpg`} alt={tree.name} />
            <h3>{tree.name}</h3>
            <p>{tree.englishName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Datasets;