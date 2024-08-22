import React from 'react';
import '../styles/Developers.css';

const developers = [
  {
    name: "NIKKA YSABEL FAROFALDANE",
    role: "PROJECT LEADER",
    image: "/static/img/img-farofaldane.jpg"
  },
  {
    name: "MARICEL DEAN GASPAR",
    role: "PROJECT MANAGER",
    image: "/static/img/img-deanmaricel.JPG"
  },
  // Add more developers here
];

function Developers() {
  return (
    <div className="developers-container">
      <h1>Our Team</h1>
      <div className="developers-grid">
        {developers.map((dev, index) => (
          <div key={index} className="developer-card">
            <img src={dev.image} alt={dev.name} />
            <h3>{dev.name}</h3>
            <p>{dev.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Developers;