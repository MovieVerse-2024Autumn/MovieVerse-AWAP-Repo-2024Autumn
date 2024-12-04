import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../utils/UserProvider";
import "../styles/Navbar.css";
import logo from "../logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(query)}`);
      setIsMenuOpen(false); // Close menu after search
    } else {
      alert("Please enter a search term!");
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false); // Close menu after logout
    navigate("/");
  };

  const handleAccountClick = () => {
    setIsMenuOpen(false); // Close menu after navigating
    navigate(`/${user.profileUrl}/delete-account`);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false); // Close menu after any link is clicked
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/" onClick={handleLinkClick}>
          <img src={logo} alt="MovieVerse Logo" className="logo-image" />
        </Link>
      </div>

      {/* Hamburger Icon for Mobile */}
      <div className="hamburger-icon" onClick={toggleMenu}>
        {isMenuOpen ? "✖" : "☰"}
      </div>

      {/* Navbar Links */}
      <div className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
        <div className="navbar-center">
          <Link to="/" className="nav-link" onClick={handleLinkClick}>
            HOME
          </Link>
          <Link to="/select-movies" className="nav-link" onClick={handleLinkClick}>
            EXPLORE
          </Link>
          <Link to="/show-time" className="nav-link" onClick={handleLinkClick}>
            SHOWTIMES
          </Link>
          <Link to="/favorites" className="nav-link" onClick={handleLinkClick}>
            FAVOURITE
          </Link>
          <Link to="/groups" className="nav-link" onClick={handleLinkClick}>
            GROUPS
          </Link>
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
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* Account Section */}
        <div className="navbar-right">
          <div className="account-icon" onClick={handleAccountClick}>
            {isLoggedIn
              ? `${user.firstName.charAt(0).toUpperCase()}${user.lastName.charAt(0).toUpperCase()}`
              : "A"}
          </div>
          {!isLoggedIn && (
            <Link to="/authentication" className="signin-link" onClick={handleLinkClick}>
              Sign In
            </Link>
          )}
          {isLoggedIn && (
            <button className="signout-button" onClick={handleLogout}>
              Sign Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
