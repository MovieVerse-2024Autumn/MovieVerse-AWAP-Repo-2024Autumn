const API_KEY = "159c3b0b72b70b61f703169a3153283a"; //TMDB API key
const BASE_URL = "https://api.themoviedb.org/3";

const API_URL_Countries = `${BASE_URL}/configuration/countries?api_key=${API_KEY}`;
const API_URL_Genre = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`;

//const API_URL = 'https://api.themoviedb.org/3/configuration/countries?api_key=159c3b0b72b70b61f703169a3153283a';

const getCountryList = async (req, res) => {
  try {
    const response = await fetch(API_URL_Countries);
    const data = await response.json();
    res.json(data);
    //console.log("API Response:", data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch countries" });
  }
};

const getGenreList = async (req, res) => {
  try {
    const response = await fetch(API_URL_Genre);
    const data = await response.json();
    res.json(data);
    //console.log("API Response:", data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch Genre" });
  }
};

export { getCountryList, getGenreList };
