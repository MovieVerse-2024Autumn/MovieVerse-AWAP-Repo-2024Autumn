import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance"; // Axios instance configured for API requests
import "../styles/Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null); // Holds user profile data
  const [error, setError] = useState(""); // Error message
  const navigate = useNavigate();

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token"); // Check for token
      if (!token) {
        navigate("/authentication"); // Redirect to login if not authenticated
        return;
      }

      try {
        const response = await axios.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data); // Store profile data
      } catch (err) {
        console.error(err);
        setError("Failed to load profile. Please try again later.");
      }
    };

    fetchProfile();
  }, [navigate]);

  // Delete account handler
  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Your account has been deleted.");
      localStorage.removeItem("token"); // Clear token
      navigate("/authentication"); // Redirect to login
    } catch (err) {
      console.error(err);
      setError("Failed to delete account.");
    }
  };

  // Placeholder for review sharing functionality
  const handleShare = (reviewId) => {
    alert(`Share functionality for review ID: ${reviewId} is pending.`);
  };

  // Placeholder for review deletion functionality
  const handleDeleteReview = (reviewId) => {
    alert(`Delete functionality for review ID: ${reviewId} is pending.`);
  };

  if (!profile && !error) return <p>Loading...</p>; // Show loading state

  return (
    <div className="profile-page">
      <h1>Your Profile</h1>
      {error && <p className="error-message">{error}</p>} {/* Display errors */}
      {profile && (
        <div className="profile-details">
          <p>
            <strong>First Name:</strong> {profile.first_name}
          </p>
          <p>
            <strong>Last Name:</strong> {profile.last_name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Favorites:</strong>{" "}
            <a href={profile.favoritesLink} target="_blank" rel="noreferrer">
              View Shared Favorites
            </a>
          </p>
          <p>
            <button
              className="group-button"
              onClick={() => navigate("/groups")}
            >
              Go to Groups Page
            </button>
          </p>
        </div>
      )}
      <h2>Reviews</h2>
      <div className="reviews-section">
        {profile?.reviews?.map((review) => (
          <div key={review.id} className="review-card">
            <h3>{review.title}</h3>
            <p>
              <strong>Rating:</strong> {review.rating}/5
            </p>
            <p>{review.description}</p>
            <div className="review-actions">
              <button
                className="share-button"
                onClick={() => handleShare(review.id)}
              >
                Share
              </button>
              <button
                className="delete-button"
                onClick={() => handleDeleteReview(review.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="delete-account-button" onClick={handleDeleteAccount}>
        Delete Account
      </button>
    </div>
  );
};

export default Profile;
