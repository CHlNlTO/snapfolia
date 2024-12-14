import React, { useState, useEffect } from 'react';
import '../styles/Snackbar.css';

function Snackbar({ message, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div className="snackbar">
      {message}
    </div>
  );
}

export default Snackbar;