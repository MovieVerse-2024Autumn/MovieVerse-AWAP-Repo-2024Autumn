import React, { useEffect, useState } from "react";

const Favorites = ({ accountId }) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        fetchFavorites();
    }, []);

   

    // Fetch favorites from the backend
    const fetchFavorites = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/favorites/${accountId}`);
            const data = await response.json();
            setFavorites(data); // Update state with the list of favorites
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    };

    // Remove a favorite
    const removeFavorite = async (movieId) => {
        try {
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
                // Filter out the movie that was just removed
                setFavorites((prevFavorites) => prevFavorites.filter(fav => fav.id !== movieId));
            } else {
                console.error("Failed to remove favorite");
            }
        } catch (error) {
            console.error("Error removing favorite:", error);
        }
    };
    
 

    return (
        <div>
            <h1>Your Favorites</h1>
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
                            {/* <button onClick={() => removeFavorite(fav.movie_id)}>Remove</button> */}
                            <button
    onClick={() => {
        console.log("Movie ID to remove:", fav.id || fav.movie_id);
        removeFavorite(fav.id || fav.movie_id);
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
