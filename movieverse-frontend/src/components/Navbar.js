import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../logo.png';

const Navbar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(query)}`);
    } else {
      alert("Please enter a search term!");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="navbar-logo">
        <img src={logo} alt="MovieVerse Logo" className="logo-image" />
      </div>

      {/* Hamburger Icon */}
      <div className="hamburger-icon">
        ☰
      </div>

      {/* Navbar Links */}
      <div className="navbar-links">
        <div className="navbar-center">
          <Link to="/" className="nav-link">HOME</Link>
          <Link to="/favorites" className="nav-link">FAVOURITE</Link>
          <Link to="/show-time" className="nav-link">SHOWTIMES</Link>
          <Link to="/groups" className="nav-link">GROUP</Link>
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
