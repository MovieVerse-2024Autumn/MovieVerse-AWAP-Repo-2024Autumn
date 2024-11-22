const API_KEY = "159c3b0b72b70b61f703169a3153283a"; //TMDB API key
const BASE_URL = "https://api.themoviedb.org/3";

const API_URL = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=2`;

const getHomeMovies = async (req, res) => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    res.json(data.results);
    //console.log("Fetching URL:", API_URL);
    //console.log("API Response:", data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
};

export { getHomeMovies };
