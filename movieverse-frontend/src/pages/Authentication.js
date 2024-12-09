import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../utils/UserProvider";
import axiosInstance from "../utils/axiosInstance";
import "../styles/Authentication.css";
import logo from "../logo.png";

const Authentication = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  //const [token, setToken] = useState(localStorage.getItem("token") || "");
  const { user, login } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isAuthenticated) {
      navigate(`/${user.profileUrl}`);
    }
  }, [user.isAuthenticated, navigate]); ///eslint-disable-next-line react-hooks/exhaustive-deps

  const handleToggle = () => {
    setIsSignIn(!isSignIn);
    setErrorMessage("");
    setSuccessMessage("");
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
      const { profileUrl } = response.data.user;
      if (!profileUrl) {
        throw new Error("Profile URL not generated");
      }

      setSuccessMessage("Registration successful!");
      setErrorMessage("");
      setIsSignIn(true);
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
      const { token, profileUrl, firstName, lastName } = response.data;
      console.log("Login Response:", response.data, "in Authentication.js");

      if (!token || !profileUrl) {
        throw new Error("Invalid server response");
      }
      login(token, profileUrl, firstName, lastName);

      setErrorMessage("");
      setSuccessMessage("Login successful!");
      navigate(`/${profileUrl}`);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed.");
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
                {errorMessage && (
                  <p className="error-message">{errorMessage}</p>
                )}
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
                {errorMessage && (
                  <p className="error-message">{errorMessage}</p>
                )}
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
    </>
  );
};

export default Authentication;
