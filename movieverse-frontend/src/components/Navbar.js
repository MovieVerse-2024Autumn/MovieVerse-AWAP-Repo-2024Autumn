import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../utils/UserProvider";
import AccountDisplay from "../pages/AccountDisplay";
import "../styles/Navbar.css";
import logo from "../logo.png";

const Navbar = ({
  handleAction,
  availableGroups,
  setAvailableGroups,
  joinedGroups,
  setJoinedGroups,
  hadleLogout,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { user } = useUser();
  const navigate = useNavigate();
  const url = `${process.env.REACT_APP_API}api/groups`;

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(query)}`);
      setIsMenuOpen(false);
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

  const handleLinkClick = () => {
    setIsMenuOpen(false);
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
          {!user.isAuthenticated ? (
            <>
              <Link to="/favorites" className="nav-link" onClick={handleLinkClick}>
                FAVOURITE
              </Link>
              <Link to="/groups" className="nav-link" onClick={handleLinkClick}>
                GROUPS
              </Link>
            </>
          ) : (
            <>
              <Link to={`/${user.profileUrl}/favorites`} className="nav-link" onClick={handleLinkClick}>
                FAVOURITES
              </Link>
              <Link to={`/${user.profileUrl}/groups`} className="nav-link" onClick={handleLinkClick}>
                GROUPS
              </Link>
            </>
          )}
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

        {/* Account Icon and Dropdown */}
        <div className="navbar-right">
          {user.isAuthenticated ? (
            <AccountDisplay
              handleAction={handleAction}
              url={url}
              availableGroups={availableGroups}
              setAvailableGroups={setAvailableGroups}
              joinedGroups={joinedGroups}
              setJoinedGroups={setJoinedGroups}
              hadleLogout={hadleLogout}
              closeHamburgerMenu={() => setIsMenuOpen(false)}
            />
          ) : (
            <Link to="/authentication" className="signin-link" onClick={handleLinkClick}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
