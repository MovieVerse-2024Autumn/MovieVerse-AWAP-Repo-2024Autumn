import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(query)}`);
    } else {
      alert('Please enter a search term!');
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); // Redirect to home page after logout
  };
  const handleAccountClick = () => {
    navigate('/delete-account');
  };
    return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="MovieVerse Logo" className="logo-image" />
        </Link>
      </div>

      {/* Hamburger Icon for Mobile */}
      <div className="hamburger-icon" onClick={toggleMenu}>
        {isMenuOpen ? '✖' : '☰'}
      </div>

      {/* Navbar Links */}
      <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
        <div className="navbar-center">
          <Link to="/" className="nav-link">HOME</Link>
          <Link to="/select-movies" className="nav-link">EXPLORE</Link>
          <Link to="/favorites" className="nav-link">FAVOURITE</Link>
          <Link to="/show-time" className="nav-link">SHOWTIMES</Link>
          <Link to="/groups" className="nav-link">GROUP</Link>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="search-button" onClick={handleSearch}>Search</button>
        </div>

        {/* Account Icon and Sign In / Sign Out */}
        <div className="navbar-right">
          <div className="account-icon" onClick={handleAccountClick}>
            <span className="account-letter">A</span>
          </div>

          {isLoggedIn ? (
            <button className="signout-button" onClick={handleLogout}>Sign Out</button>
          ) : (
            <Link to="/Authentication" className="signin-link">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
