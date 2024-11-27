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



// Fetch movie cast details from TMDB
const getMovieCast = async (req, res) => {
    const { id } = req.params; // Extract movie ID from the URL
    try {
        // Make a request to the TMDB API for movie credits (cast and crew)
        const response = await fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`);
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data.status_message || "Failed to fetch cast details" });
        }

        // Only return the cast information
        const cast = data.cast.map((actor) => ({
            id: actor.id,
            name: actor.name,
            character: actor.character,
            profile_path: actor.profile_path,
        }));

        res.json(cast); // Send the cast details back to the frontend
    } catch (error) {
        console.error("Error fetching movie cast details:", error);
        res.status(500).json({ error: "Failed to fetch movie cast details" });
    }
};



export { getMovieDetails, getMovieCast};
