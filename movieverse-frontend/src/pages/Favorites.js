import styles from "../styles/Favorites.module.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Favorites = ({ accountId }) => {
    const [favorites, setFavorites] = useState([]);
    const [shareUrl, setShareUrl] = useState(null); // State for shareable link
    const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        fetchFavorites();
    }, [accountId]);

    // Fetch favorites from the backend
    const fetchFavorites = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/favorites/${accountId}`);
            const data = await response.json();
            console.log("Fetched favorites:", data);
            setFavorites(data); // Update state with the list of favorites
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    };

    // Remove a favorite
    const removeFavorite = async (movieId) => {
        try {
            console.log("Removing Movie ID:", movieId); 
            const response = await fetch(`http://localhost:3001/api/favorites`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    account_id: accountId,
                    movie_id: movieId,
                }),
            });

            if (response.ok) {
                // Update the state immediately by filtering out the removed movie
                setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.movie_id !== movieId));
                console.log("Movie removed successfully");
            } else {
                console.error("Failed to remove favorite");
            }
        } catch (error) {
            console.error("Error removing favorite:", error);
        }
    };

    // Share the favorites list
    const shareFavorites = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/favorites/share`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ account_id: accountId, share: true }),
            });

            if (response.ok) {
                const data = await response.json();
                setShareUrl(data.share_url);
                setShowPopup(true); // Show popup when share URL is generated
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
            navigate(`/movies/${movieId}`); // Navigate to movie details
        } else {
            console.error("Invalid movie ID:", movieId); // Handle the error gracefully
        }
    };

    return (
        <>
            <h1 className={styles.title}>Your Favorites</h1>
            <div className={styles.favorites}>
                <div style={{ padding: "20px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
                        {favorites.length ? (
                            favorites.map((fav) => (
                                <div
                                    key={fav.id || fav.movie_id} // Use the correct key
                                    className={styles['favorite-item']}
                                    onClick={() => handleCardClick(fav.id || fav.movie_id)} // Use the correct movie ID property
                                >
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${fav.poster_path}`}
                                        alt={fav.title}
                                        className={styles['favorite-img']}
                                    />
                                    <h3 className={styles['favorite-title']}>{fav.title}</h3>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent card click
                                            removeFavorite(fav.movie_id); // Remove favorite
                                        }}
                                        className={styles['favorite-button']}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No favorites found.</p>
                        )}
                    </div>

                    {/* Share Button */}
                    <div className={styles["share-button-container"]}>
                        <button className={styles["share-button"]} onClick={shareFavorites}>
                            Share
                        </button>
                    </div>
                </div>

                {/* Popup Modal for Shareable Link */}
                {showPopup && (
                    <div className={styles["popup-modal"]}>
                        <h2>Copy Link</h2>
                        <p>
                            <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                                {shareUrl}
                            </a>
                        </p>
                        <button className={styles["share-button"]} onClick={() => setShowPopup(false)}>
                            Close
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Favorites;
