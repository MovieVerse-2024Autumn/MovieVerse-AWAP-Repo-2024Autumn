import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import './Navbar.css';  // Make sure to import the CSS file for styles

import logo from '../logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="navbar-logo">
        <img src={logo} alt="MovieVerse Logo" className="logo-image" />
      </div>

      {/* Hamburger Icon */}
      <div className="hamburger-icon" onClick={toggleMenu}>
        ☰
      </div>

      {/* Navbar Links */}
      <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
          <div className="navbar-center">
            <Link to="/" className="nav-link">HOME</Link>  {/* Updated to Link */}
            <Link to="/favorites" className="nav-link">FAVOURITE</Link>  {/* Updated to Link */}
            <Link to="/show-time" className="nav-link">SHOWTIMES</Link>  {/* Updated to Link */}
            <Link to="/groups" className="nav-link">GROUP</Link>  {/* Updated to Link */}
            <div className="search-container">
              <input type="text" className="search-bar" placeholder="Search movies..." />
              <button className="search-button">Search</button>
            </div>
          </div>
        
        <div className="navbar-right">
          <div className="account-icon">A</div>
          <a href="#signin" className="nav-link">Sign In</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
