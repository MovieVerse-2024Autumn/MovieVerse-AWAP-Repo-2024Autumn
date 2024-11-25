import React from "react";
import logo from "../logo.png"; // Replace with the actual path to your logo file
import '../styles/Footer.css';  // Import the footer-specific CSS

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Logo Section */}
        <div className="footer-logo-section">
          <img src={logo} alt="MovieVerse Logo" className="footer-logo" />
        </div>

        {/* Social Media Icons Section */}
        <div className="social-media-icons">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>

        {/* Footer Links Section */}
        <div className="footer-columns">
          <div className="footer-column">
            <h4>COMMUNITY</h4>
            <a href="#privacy" className="footer-link">Privacy</a>
            <a href="#terms" className="footer-link">Terms of Use</a>
            <a href="#support" className="footer-link">Support</a>
          </div>

          <div className="footer-column">
            <h4>ABOUT US</h4>
            <a href="#about" className="footer-link">Our Story</a>
            <a href="#news" className="footer-link">News</a>
            <a href="#careers" className="footer-link">Careers</a>
          </div>

          <div className="footer-column">
            <h4>CHANNELS</h4>
            <a href="#tv" className="footer-link">TV Shows</a>
            <a href="#movies" className="footer-link">Movies</a>
            <a href="#originals" className="footer-link">Originals</a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; 2024 MovieVerse | All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
