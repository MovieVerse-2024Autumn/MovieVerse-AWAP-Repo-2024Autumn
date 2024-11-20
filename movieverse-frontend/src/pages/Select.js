import React, { useEffect, useState } from "react";
import MovieList from "../components/MovieList";

const API_KEY = "159c3b0b72b70b61f703169a3153283a";

export default function MoviePage() {
  const [genres, setGenres] = useState([]);
  const [countries, setCountries] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRating, setSelectedRating] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch genres
        const genresResponse = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
        );
        const genresData = await genresResponse.json();
        setGenres(genresData.genres || []);

        // Fetch countries
        const countriesResponse = await fetch(
          `https://api.themoviedb.org/3/configuration/countries?api_key=${API_KEY}`
        );
        const countriesData = await countriesResponse.json();
        setCountries(countriesData || []);

        // Fetch initial movies
        const moviesResponse = await fetch(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
        );
        const moviesData = await moviesResponse.json();
        setMovies(moviesData.results || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        api_key: API_KEY,
        language: "en-US",
        with_genres: selectedGenre,
        region: selectedCountry,
        sort_by: selectedRating || "popularity.desc", // Default sorting if none selected
      });

      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?${queryParams.toString()}`
      );
      const data = await response.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error("Error fetching filtered movies:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Select Movies</h1>

      {/* Filters Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
          marginBottom: "20px",
          justifyContent: "space-between",
        }}
      >
        {/* Genre Dropdown */}
        <select
          style={dropdownStyle}
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">Genre</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>

        {/* Country Dropdown */}
        <select
          style={dropdownStyle}
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          <option value="">Country</option>
          {countries.map((country, index) => (
            <option key={index} value={country.iso_3166_1}>
              {country.english_name}
            </option>
          ))}
        </select>

        {/* Top Rated Dropdown */}
        <select
          style={dropdownStyle}
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
        >
          <option value="">Rating</option>
          <option value="popularity.desc">Popular</option>
          <option value="release_date.desc">Latest</option>
          <option value="vote_average.desc">Top Rated</option>
          <option value="vote_count.desc">Most Viewed</option>
        </select>

        {/* Search Button */}
        <button style={buttonStyle} onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Movie List */}
      <MovieList movies={movies} />
    </div>
  );
}

// Inline CSS for dropdown and button styling
const dropdownStyle = {
  padding: "10px",
  fontSize: "16px",
  borderRadius: "5px",
  border: "1px solid #ddd",
  backgroundColor: "#fff",
  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  cursor: "pointer",
  width: "150px",
};

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  color: "#fff",
  backgroundColor: "#007bff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  transition: "background-color 0.3s ease",
};

buttonStyle["&:hover"] = { backgroundColor: "#0056b3" };
