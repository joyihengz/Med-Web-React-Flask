import React from 'react';
import './Navbar.css'; // Create a CSS file for styling
import LogOutButton from "./LogOutButton.js";
import LogInButton from "./LogInButton.js";

function Navbar() {
  return (
    <nav>
      <a href="https://www.tcrinc.com/" className="home-button" target="_blank" rel="noopener noreferrer">TCR MED</a> 

      <div>
        <a href="http://localhost:3000/">Home</a>

        <a href="http://localhost:3000/About">About</a> 

        <a href="http://localhost:3000/Services">Services</a>

        <a href="http://localhost:3000/ProviderInformation">Providers</a> 
      </div>  

      <div>
        <LogInButton />
        <LogOutButton />
      </div>
    
    </nav>
  );
} 
export default Navbar;

