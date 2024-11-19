import React, { useEffect, useState } from "react";

const Favorites = ({ accountId }) => {
    const [favorites, setFavorites] = useState([]);

    const fetchFavorites = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/favorites/${accountId}`);
            const data = await response.json();
            setFavorites(data);
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    };

    const removeFavorite = async (movieId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/favorites`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ account_id: accountId, movie_id: movieId }),
            });

            if (response.ok) {
                setFavorites((prev) => prev.filter((fav) => fav.movie_id !== movieId));
            } else {
                console.error("Failed to remove favorite:", await response.text());
            }
        } catch (error) {
            console.error("Error removing favorite:", error);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    return (
        <div>
            <h1>Your Favorites</h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {favorites.map((fav) => (
                    <div key={fav.movie_id} style={{ textAlign: "center", width: "150px" }}>
                        <h3 style={{ fontSize: "16px" }}>{fav.title}</h3>
                        <button onClick={() => removeFavorite(fav.movie_id)}>Remove</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Favorites;
