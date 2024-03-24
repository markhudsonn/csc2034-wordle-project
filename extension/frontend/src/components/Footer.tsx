import React from 'react';
import { IoLogoGithub } from "react-icons/io";


const Footer = () => (
  <footer style={{ position: 'fixed', bottom: '0', left: '0', right: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#f0f0f0', color: 'grey' }}>
    <div style={{ marginLeft: '10px' }}>
      <a href="https://www.nytimes.com/games/wordle/index.html" target="_blank" rel="noopener noreferrer" style={{ color: 'grey', textDecoration: 'none' }}>Inspired by Wordle (NYT)</a>
    </div>
    <div>
      <p>Mark Hudson © 2024</p>
    </div>
    <div style={{ marginRight: '10px' }}>
      <a href="https://github.com/markhudsonn/csc2034-wordle-project" target="_blank" rel="noopener noreferrer" style={{ color: 'grey', textDecoration: 'none' }}>
        <IoLogoGithub size={20} />
      </a>
    </div>
  </footer>
);

export default Footer;
