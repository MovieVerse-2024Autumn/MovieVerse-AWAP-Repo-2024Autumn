import { pool } from "../../middleware/db.js";

import fetch from "node-fetch";

const API_KEY = "159c3b0b72b70b61f703169a3153283a";
const BASE_URL = "https://api.themoviedb.org/3";

// Get user's favorite movies
const getFavorites = async (req, res, next) => {
    const { account_id } = req.params;

    try {
        // Fetch favorite movie IDs from the database
        const query = `
            SELECT f.movie_id
            FROM favourite f
            WHERE f.account_id = $1;
        `;
        const result = await pool.query(query, [account_id]);
        const favoriteIds = result.rows.map((row) => row.movie_id);

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
        const query = `
            INSERT INTO favourite (account_id, movie_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING;
        `;
        await pool.query(query, [account_id, movie_id]);
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
        const query = `
            DELETE FROM favourite
            WHERE account_id = $1 AND movie_id = $2;
        `;
        const result = await pool.query(query, [account_id, movie_id]);

        if (result.rowCount > 0) {
            res.status(200).json({ message: "Movie removed from favorites" });
        } else {
            res.status(404).json({ error: "Favorite not found" });
        }
    } catch (error) {
        console.error("Error removing favorite:", error);
        return next(error);
    }
};


// Enable or disable sharing for a user's favorites
import dotenv from "dotenv";
dotenv.config();

export {
    getFavorites,
    addFavorite,
    removeFavorite,
};
