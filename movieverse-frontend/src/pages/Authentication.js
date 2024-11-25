import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance"; // Import your axios instance
import "../pages/Authentication.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import logo from "../logo.png"; // Import your logo

const Authentication = () => {
  const [isSignIn, setIsSignIn] = useState(true); // Toggle between Sign In and Sign Up
  const [passwordVisible, setPasswordVisible] = useState(false); // Toggle password visibility
  const [errorMessage, setErrorMessage] = useState(""); // Error messages
  const [successMessage, setSuccessMessage] = useState(""); // Success messages
  const [token, setToken] = useState(localStorage.getItem("token") || ""); // Store token
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if already logged in
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleToggle = () => {
    setIsSignIn(!isSignIn); // Switch between Sign In and Sign Up
    setErrorMessage(""); // Clear error messages
    setSuccessMessage(""); // Clear success messages
  };

  const handleSignOut = () => {
    setToken("");
    localStorage.removeItem("token"); // Clear token from localStorage
    navigate("/auth"); // Redirect to authentication page
  };

  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;

    if (!email || !password || !firstName || !lastName) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      const response = await axiosInstance.post("/register", {
        email,
        password,
        firstName,
        lastName,
      });
      console.log("Registration Response:", response.data);
      setSuccessMessage("Registration successful!");
      setErrorMessage("");
      setIsSignIn(true); // Switch to Sign In after successful registration
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Registration failed.");
      setSuccessMessage("");
    }
  };

  // Handle Login
  const handleSignIn = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });
      const receivedToken = response.data.token;
      setToken(receivedToken); // Store token
      localStorage.setItem("token", receivedToken); // Persist token in localStorage
      setErrorMessage("");
      setSuccessMessage("Login successful!");
      navigate("/"); // Redirect to home page
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed.");
      setToken("");
      setSuccessMessage("");
    }
  };

  return (
    <>
      {/* <Navbar token={token} handleSignOut={handleSignOut} /> */}
      <div className="auth-container">
        <div className="auth-box">
          {/* Logo */}
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo-image" />
          </div>

          {/* Sign In Form */}
          {isSignIn ? (
            <>
              <h2>Sign In</h2>
              <form onSubmit={handleSignIn}>
                <input type="email" name="email" placeholder="Email" required />
                <div className="password-field">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    required
                  />
                  <span
                    className="eye-icon"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? "👁️" : "👁️‍🗨️"}
                  </span>
                </div>
                <button type="submit">Sign In</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && (
                  <p className="success-message">{successMessage}</p>
                )}
              </form>

              {/* OR Section */}
              <div className="or-divider">
                <hr />
                <span>OR</span>
                <hr />
              </div>
              <p>
                Don't have an account?{" "}
                <span className="toggle-link" onClick={handleToggle}>
                  Sign Up here
                </span>
              </p>
            </>
          ) : (
            <>
              {/* Sign Up Form */}
              <h2>Sign Up</h2>
              <form onSubmit={handleRegister}>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  required
                />
                <input type="email" name="email" placeholder="Email" required />
                <div className="password-field">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    title="Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character."
                    required
                  />
                  <span
                    className="eye-icon"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? "👁️" : "👁️‍🗨️"}
                  </span>
                </div>
                <button type="submit">Sign Up</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && (
                  <p className="success-message">{successMessage}</p>
                )}
              </form>

              {/* OR Section */}
              <div className="or-divider">
                <hr />
                <span>OR</span>
                <hr />
              </div>
              <p>
                Already have an account?{" "}
                <span className="toggle-link" onClick={handleToggle}>
                  Sign In here
                </span>
              </p>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Authentication;
