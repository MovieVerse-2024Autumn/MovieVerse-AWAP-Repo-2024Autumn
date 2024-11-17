import React, { useState } from "react";

const Favorites = () => {
    // Mock favorite movies list for testing
    const [favorites, setFavorites] = useState([
        { id: 558449, title: "Inception", poster: "https://image.tmdb.org/t/p/w500/path_to_image" },
        { id: 2, title: "Breaking Bad", poster: "https://image.tmdb.org/t/p/w500/path_to_image" },
        { id: 3, title: "The Dark Knight", poster: "https://image.tmdb.org/t/p/w500/path_to_image" },
    ]);

    // Function to handle sharing the favorites list
    const handleShare = () => {
        alert("Share URL copied to clipboard!");
        // Placeholder for functionality to generate a sharable URL
    };

    return (
        <div className="favorites-page">
            <h1>Your Favorites</h1>
            {favorites.length > 0 ? (
                <div className="favorites-list">
                    {favorites.map((movie) => (
                        <div key={movie.id} className="favorite-item">
                            <img src={movie.poster} alt={movie.title} />
                            <p>{movie.title}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>You have no favorites yet!</p>
            )}
            <button onClick={handleShare}>Share Favorites</button>
        </div>
    );
};

export default Favorites;
