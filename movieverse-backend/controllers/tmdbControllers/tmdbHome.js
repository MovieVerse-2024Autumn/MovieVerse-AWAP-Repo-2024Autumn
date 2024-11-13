const API_URL =
  "https://api.themoviedb.org/3/movie/now_playing?api_key=159c3b0b72b70b61f703169a3153283a";

const getHomeMovies = async (req, res) => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
};

export { getHomeMovies };
