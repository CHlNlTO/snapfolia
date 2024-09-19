import React from 'react';

function SearchBar({ searchTerm, setSearchTerm, location, setLocation }) {
  return (
    <div className="mb-3">
      <div className="input-group mb-3" style={{maxWidth: '300px'}}>
        <input
          type="text"
          className="form-control"
          placeholder="Search leaves..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="input-group-append">
          <button className="btn btn-outline-secondary" type="button">Search</button>
        </div>
      </div>
      <div className="input-group mb-3" style={{maxWidth: '300px'}}>
        <select
          className="form-select"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="all">All</option>
          <option value="faith-colleges">FAITH Colleges</option>
          <option value="batangas-lakelands">Batangas Lakelands</option>
          <option value="marian-orchard">Marian Orchard</option>
        </select>
      </div>
    </div>
  );
}

export default SearchBar;