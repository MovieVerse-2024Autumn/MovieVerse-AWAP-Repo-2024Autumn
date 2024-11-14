import fetch from "node-fetch";

const API_KEY = "159c3b0b72b70b61f703169a3153283a"; //TMDB API key
const BASE_URL = "https://api.themoviedb.org/3";

const getMovieDetails = async (req, res) => {
    const { id } = req.params; // Get movie ID from request parameters
    try {
        const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
        const data = await response.json();
        res.json(data); // Send the movie details back to the frontend
    } catch (error) {
        console.error("Error fetching movie details:", error);
        res.status(500).json({ error: "Failed to fetch movie details" });
    }
};

export { getMovieDetails };
