import React from 'react';

const Footer = () => (
  <footer style={{ position: 'fixed', bottom: '0', left: '0', right: '0', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px', backgroundColor: '#f0f0f0', color: 'grey' }}>
    <div style={{ marginLeft: '10px' }}>
      <a href="https://www.nytimes.com/games/wordle/index.html" target="_blank" rel="noopener noreferrer" style={{ color: 'grey', textDecoration: 'none' }}>Inspired by Wordle (NYT)</a>
    </div>
    <span style={{ margin: '0 10px' }}>|</span>
    <div style={{ marginRight: '10px' }}>
      <p>Mark Hudson © 2024</p>
    </div>
  </footer>
);

export default Footer;
