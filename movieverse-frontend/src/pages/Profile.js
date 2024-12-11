import React, { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import ReviewCard from "../components/ReviewCard";
import DeleteAccountFlow from "./DeleteAccount";
import { useFetchData } from "../utils/useFetchData";
import "../styles/Profile.css";

const url = `${process.env.REACT_APP_BACKEND_API}api`;

const Profile = () => {
  const { data: movies } = useFetchData(`${url}/movies-homepage`);
  const [reviews, setReviews] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [favoritesLink, setFavoritesLink] = useState("");
  const [uniqueProfileUrl, setUniqueProfileUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // New state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [showDeleteFlow, setShowDeleteFlow] = useState(false);

  const navigate = useNavigate();

  const getAccountId = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      return decoded.id; // Assuming `id` is part of the decoded JWT payload
    }
    return null;
  };
  const accountId = getAccountId();

  // Handle fetching user's reviews
  const fetchUserReviews = useCallback(async () => {
    try {
      const response = await fetch(`${url}/profile/reviews/${accountId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("userReview data", data);
      setReviews(data);
    } catch (error) {
      console.error("Error fetching user reviews:", error.message);
    }
  }, [accountId]);
  // get user's first name, last name, email
  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await fetch(`${url}/profile/${accountId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      //console.log("Account ID:", accountId);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("userDetail data", data);
      setFirstName(data.first_name);
      setLastName(data.last_name);
      setEmail(data.email);
      setFavoritesLink(data.link);
      setUniqueProfileUrl(data.unique_profile_url);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user details:", error.message);
      setIsLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    fetchUserReviews();
    fetchUserDetails();
  }, [fetchUserReviews, fetchUserDetails]);

  // handle editing user's first name and last name
  const handleEditUserDetails = () => {
    setEditFirstName(firstName);
    setEditLastName(lastName);
    setIsEditing(true);
  };

  // handle saving user's first name and last name
  const handleUpdateUserDetails = async () => {
    try {
      const response = await fetch(`${url}/profile/update/${accountId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ firstName: firstName, lastName: lastName }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user details");
      }

      // Update local state with new values
      setFirstName(editFirstName);
      setLastName(editLastName);

      alert("User details updated successfully.");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user details:", error.message);
      alert("Failed to update user details. Please try again.");
    }
  };

  // Handle sharing user's favorites list
  const handleShareFavorites = async () => {
    try {
      await navigator.clipboard.writeText(favoritesLink);
      alert("Favorites link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link", err);
      alert("Failed to copy link. Please copy manually.");
    }
  };

  // Navigate to Groups page
  const navigateToGroups = () => {
    navigate(`/${uniqueProfileUrl}/groups`);
  };

  // Handle deleting a review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const response = await fetch(
        `${url}/profile/reviews/delete/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== reviewId)
      );
      alert("Review deleted successfully.");
    } catch (error) {
      console.error("Error deleting review:", error.message);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteFlow(false);
  };

  return isLoading ? (
    <p>Loading your profile...</p>
  ) : (
    <div className="profile-page">
      <h1>Your Profile</h1>

      <div className="user-details">
        <h3>User Details</h3>
        {isEditing ? (
          <>
            <p>
              <strong>First Name </strong>
              <input
                type="text"
                value={editFirstName}
                onChange={(e) => setEditFirstName(e.target.value)}
              />
            </p>
            <p>
              <strong>Last Name </strong>
              <input
                type="text"
                value={editLastName}
                onChange={(e) => setEditLastName(e.target.value)}
              />
            </p>
          </>
        ) : (
          <>
            <p>
              <strong>First Name</strong>
              {firstName}
            </p>
            <p>
              <strong>Last Name</strong>
              {lastName}
            </p>
          </>
        )}
        <p>
          <strong>Email</strong>
          {email}
          <span>(You can not change your email.)</span>
        </p>
        {isEditing ? (
          <button onClick={handleUpdateUserDetails}>Save</button>
        ) : (
          <button onClick={handleEditUserDetails}>Edit</button>
        )}
      </div>

      <div className="profile-details">
        {/* Favorites Section */}
        <h3>Profile Details</h3>
        <p>
          <strong>Favorites</strong>
          <a href={favoritesLink} target="_blank" rel="noopener noreferrer">
            {favoritesLink}
          </a>
          <button
            className="profile-details-favorite-icon"
            onClick={handleShareFavorites}
          >
            <i>🔗</i>
          </button>
        </p>
        <div className="profile-groups-section">
          <strong>Groups</strong>
          <p className="profile-groups-nav">
            Go to{" "}
            <strong
              className="profile-groups-link"
              onClick={navigateToGroups}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              Groups
            </strong>{" "}
            page to check your groups.
          </p>
        </div>

        {/* Review Section */}
        <div className="profile-review-section">
          <p>
            <strong>Reviews</strong>
          </p>

          <div className="profile-review-card">
            {reviews.map((review) => {
              const movie = movies.find(
                (movie) => movie.id === review.movie_id
              );
              return (
                <div key={review.id}>
                  <div className="profile-review-card-content">
                    <ReviewCard key={review.id} review={review} movie={movie} />
                  </div>
                  {/* Delete review icon next to each review */}
                  <div>
                    <button
                      className="profile-review-delete-btn"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Delete Account */}
      <div className="profile-delete-account-container">
        <button onClick={() => setShowDeleteFlow(true)}>Delete Account</button>
        {showDeleteFlow && (
          <DeleteAccountFlow onAccountDelete={handleCancelDelete} />
        )}
      </div>
    </div>
  );
};

export default Profile;
