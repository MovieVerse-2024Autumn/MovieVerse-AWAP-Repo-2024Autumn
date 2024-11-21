import React, { useEffect, useState } from "react";

const Favorites = ({ accountId }) => {
    const [favorites, setFavorites] = useState([]);
    const [shareUrl, setShareUrl] = useState(null); // State for shareable link

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
            console.log("Removing Movie ID:", movieId); // Debug
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
                alert(`Shareable Link: ${data.share_url}`);
            } else {
                console.error("Failed to share favorites");
            }
        } catch (error) {
            console.error("Error sharing favorites:", error);
        }
    };

    return (
        <div>
            <h1>Your Favorites</h1>
            <button onClick={shareFavorites}>Share</button>
            {shareUrl && (
                <p>
                    Share this link: <a href={shareUrl}>{shareUrl}</a>
                </p>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {favorites.length ? (
                    favorites.map((fav) => (
                        <div key={fav.movie_id} style={{ textAlign: "center", width: "150px" }}>
                            <img
                                src={`https://image.tmdb.org/t/p/w500${fav.poster_path}`}
                                alt={fav.title}
                                style={{ width: "100%", borderRadius: "8px" }}
                            />
                            <h3 style={{ fontSize: "16px" }}>{fav.title}</h3>
                            <button
                                onClick={() => {
                                    console.log("Movie ID to remove:", fav.id || fav.movie_id); // Use appropriate key
                                    removeFavorite(fav.id || fav.movie_id); // Pass the correct ID
                                }}
                            >
                                Remove
                            </button>


                        </div>
                    ))
                ) : (
                    <p>No favorites found.</p>
                )}
            </div>
        </div>
    );
};

export default Favorites;
