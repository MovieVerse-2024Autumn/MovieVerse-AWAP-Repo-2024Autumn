import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import ReviewCardForHomePage from "../components/ReviewCardForHomePage";
import { useFetchData } from "../utils/useFetchData";
import "../styles/Profile.css";
const url = "http://localhost:3001/api";

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

  useEffect(() => {
    fetchUserReviews();
    fetchUserDetails();
  }, []);

  // Handle fetching user's reviews
  const fetchUserReviews = async () => {
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
  };
  // get user's first name, last name, email
  const fetchUserDetails = async () => {
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
  };

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

  // Delete account handler
  const handleDeleteAccount = async () => {};

  return isLoading ? (
    <p>Loading your profile...</p>
  ) : (
    <div className="profile-page">
      <h1>Your Profile</h1>

      <div>
        <h3>User Details</h3>
        {isEditing ? (
          <>
            <p>
              <strong>First Name: </strong>
              <input
                type="text"
                value={editFirstName}
                onChange={(e) => setEditFirstName(e.target.value)}
              />
            </p>
            <p>
              <strong>Last Name: </strong>
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
          <p>(You can not change your email.)</p>
        </p>
        {isEditing ? (
          <button onClick={handleUpdateUserDetails}>Save</button>
        ) : (
          <button onClick={handleEditUserDetails}>Edit</button>
        )}
      </div>

      <div>
        {/* Favorites Section */}
        <h3>Profile Details</h3>
        <p>
          <strong>Favorites</strong>
          <a href={favoritesLink} target="_blank" rel="noopener noreferrer">
            {favoritesLink}
          </a>
          <button onClick={handleShareFavorites}>
            <i>🔗</i>
          </button>
        </p>
        <div>
          <strong>Groups</strong>
          <p>
            Go to{" "}
            <strong
              onClick={navigateToGroups}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              Groups
            </strong>{" "}
            page to check your groups.
          </p>
        </div>

        {/* Review Section */}
        <strong>Reviews</strong>
        <div>
          <div>
            {reviews.map((review) => {
              const movie = movies.find(
                (movie) => movie.id === review.movie_id
              );
              return (
                <div key={review.id}>
                  <ReviewCardForHomePage
                    key={review.id}
                    review={review}
                    movie={movie}
                  />
                  {/* Delete review icon next to each review */}
                  <div>
                    <button onClick={() => handleDeleteReview(review.id)}>
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Delete & Share Account */}

      <button className="delete-account-button">Delete Account</button>
    </div>
  );
};

export default Profile;
