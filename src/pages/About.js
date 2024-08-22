import React from 'react';
import '../styles/About.css';

function About() {
  return (
    <div className="about-container">
      <h1>About Snapfolia</h1>
      <p>
        Snapfolia is a leaf identification application that uses AI and machine learning 
        to help users identify tree species based on leaf images. Our goal is to make 
        nature exploration and botanical research more accessible to everyone.
      </p>
      <h2>How It Works</h2>
      <ol>
        <li>Take or upload a photo of a leaf</li>
        <li>Our AI analyzes the image</li>
        <li>Receive information about the identified tree species</li>
      </ol>
      <h2>Our Mission</h2>
      <p>
        We aim to promote environmental awareness and education by providing an easy-to-use 
        tool for leaf identification. Snapfolia is designed to be a valuable resource for 
        students, researchers, nature enthusiasts, and anyone curious about the trees around them.
      </p>
    </div>
  );
}

export default About;