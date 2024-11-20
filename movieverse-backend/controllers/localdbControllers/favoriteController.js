import Favorite from "../../models/FavoriteModel.js"; // Import the Favorite model
import fetch from "node-fetch";

const API_KEY = "159c3b0b72b70b61f703169a3153283a";
const BASE_URL = "https://api.themoviedb.org/3";

// Get user's favorite movies
const getFavorites = async (req, res, next) => {
    const { account_id } = req.params;

    try {
        // Fetch favorite movie IDs using the model
        const favoriteIds = await Favorite.getFavoritesByAccountId(account_id);

        // Fetch movie details from TMDB for each movie ID
        const favoriteDetails = await Promise.all(
            favoriteIds.map(async (id) => {
                const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
                return response.json();
            })
        );

        res.status(200).json(favoriteDetails);
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return next(error);
    }
};

// Add a movie to favorites
const addFavorite = async (req, res, next) => {
    const { account_id, movie_id } = req.body;

    if (!account_id || !movie_id) {
        return res.status(400).json({ error: "Both account_id and movie_id are required" });
    }

    try {
        // Use the model to add the favorite
        await Favorite.addFavorite(account_id, movie_id);
        res.status(201).json({ message: "Movie added to favorites" });
    } catch (error) {
        console.error("Error adding favorite:", error);
        return next(error);
    }
};

// Remove a movie from favorites
const removeFavorite = async (req, res, next) => {
    const { account_id, movie_id } = req.body;

    if (!account_id || !movie_id) {
        return res.status(400).json({ error: "Both account_id and movie_id are required" });
    }

    try {
        // Use the model to remove the favorite
        const wasRemoved = await Favorite.removeFavorite(account_id, movie_id);
        if (wasRemoved) {
            res.status(200).json({ message: "Movie removed from favorites" });
        } else {
            res.status(404).json({ error: "Favorite not found" });
        }
    } catch (error) {
        console.error("Error removing favorite:", error);
        next(error);
    }
};

export {
    getFavorites,
    addFavorite,
    removeFavorite,
};
