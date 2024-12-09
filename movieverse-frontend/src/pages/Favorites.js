import styles from "../styles/Favorites.module.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [shareUrl, setShareUrl] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  // Function to extract account ID from JWT
  const getAccountId = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      return decoded.id; // Assuming `id` is part of the decoded JWT payload
    }
    return null;
  };

  const accountId = getAccountId();

  // Fetch favorites from the backend
  const fetchFavorites = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/favorites/${accountId}`
      );
      const data = await response.json();
      console.log("Fetched favorites data structure:", data); // Log data here
      setFavorites(data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };
  useEffect(() => {
    if (accountId) {
      fetchFavorites();
    } else {
      console.error("User is not logged in.");
    }
  }, [accountId, fetchFavorites]);

  const removeFavorite = async (movieId) => {
    console.log("Attempting to remove Movie ID:", movieId); // Debugging step
    if (!movieId) {
      console.error("Movie ID is undefined or null!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/favorites`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account_id: accountId, // Ensure accountId is correct
          movie_id: movieId, // Ensure movieId is passed here
        }),
      });

      if (response.ok) {
        setFavorites((prevFavorites) =>
          prevFavorites.filter((fav) => fav.movie_id !== movieId)
        );
        console.log("Movie removed successfully");
      } else {
        const errorData = await response.json();
        console.error(
          "Failed to remove favorite:",
          errorData.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  // Share the favorites list
  const shareFavorites = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/favorites/share`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ account_id: accountId, share: true }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setShareUrl(data.share_url);
        setShowPopup(true);
      } else {
        console.error("Failed to share favorites");
      }
    } catch (error) {
      console.error("Error sharing favorites:", error);
    }
  };

  // Navigate to the movie details page
  const handleCardClick = (movieId) => {
    if (movieId) {
      navigate(`/movies/${movieId}`);
    } else {
      console.error("Invalid movie ID:", movieId);
    }
  };

  if (!accountId) {
    return <p>Please log in to view your favorites.</p>;
  }

  return (
    <>
      <h1 className={styles.title}>Your Favorites</h1>
      <div className={styles.favorites}>
        <div style={{ padding: "20px" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              justifyContent: "center",
            }}
          >
            {favorites.length ? (
              favorites.map((fav) => (
                <div
                  key={fav.id} // Use `id` as the unique key
                  className={styles["favorite-item"]}
                  onClick={() => handleCardClick(fav.id)} // Pass `id` for navigation
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${fav.poster_path}`}
                    alt={fav.title}
                    className={styles["favorite-img"]}
                  />
                  <h3 className={styles["favorite-title"]}>{fav.title}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      console.log("Attempting to remove Movie ID:", fav.id); // Log the correct ID
                      removeFavorite(fav.id); // Pass `id` instead of `movie_id`
                    }}
                    className={styles["favorite-button"]}
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p>No favorites found.</p>
            )}
          </div>
          <div className={styles["share-button-container"]}>
            <button className={styles["share-button"]} onClick={shareFavorites}>
              Share
            </button>
          </div>
        </div>
        {showPopup && (
          <div className={styles["popup-modal"]}>
            <h2>Copy Link</h2>
            <p>
              <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                {shareUrl}
              </a>
            </p>
            <button
              className={styles["share-button"]}
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Favorites;
