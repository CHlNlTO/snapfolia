import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Datasets from './components/Datasets';
import Developers from './components/Developers';
import UserGuide from './components/UserGuide';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/datasets" element={<Datasets />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/guide" element={<UserGuide />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;