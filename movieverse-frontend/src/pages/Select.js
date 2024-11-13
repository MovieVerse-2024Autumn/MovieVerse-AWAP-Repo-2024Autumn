import React from "react";
import MovieList from "../components/MovieList";

export default function MoviePage() {
  const exampleMovies = [
    {
      id: 1,
      title: "Inception",
      poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      vote_average: 8.8,
    },
    {
      id: 2,
      title: "Interstellar",
      poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      vote_average: 8.6,
    },
    {
      id: 3,
      title: "The Dark Knight",
      poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      vote_average: 9.0,
    },
    {
      id: 1,
      title: "Inception",
      poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      vote_average: 8.8,
    },
    {
      id: 2,
      title: "Interstellar",
      poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      vote_average: 8.6,
    },
    {
      id: 3,
      title: "The Dark Knight",
      poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      vote_average: 9.0,
    },
    // Add more example movies as needed
  ];

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
        <select style={dropdownStyle}>
          <option value="">Genre</option>
          <option value="action">Action</option>
          <option value="adventure">Adventure</option>
          <option value="animation">Animation</option>
          <option value="comedy">Comedy</option>
          <option value="crime">Crime</option>
          <option value="documentary">Documentary</option>
          <option value="drama">Drama</option>
          <option value="fantasy">Fantasy</option>
          <option value="horror">Horror</option>
          <option value="mystery">Mystery</option>
          <option value="romance">Romance</option>
          <option value="sci-fi">Sci-Fi</option>
          <option value="thriller">Thriller</option>
          <option value="western">Western</option>
        </select>

        <select style={dropdownStyle}>
          <option value="">Country</option>
          <option value="fi">Finland</option>
          <option value="us">United States</option>
          <option value="uk">United Kingdom</option>
          <option value="fr">France</option>
          <option value="de">Germany</option>
          <option value="in">India</option>
          <option value="jp">Japan</option>
          <option value="kr">South Korea</option>
          <option value="it">Italy</option>
          <option value="es">Spain</option>
          <option value="cn">China</option>
          <option value="ru">Russia</option>
          <option value="au">Australia</option>
          <option value="ca">Canada</option>
          <option value="mx">Mexico</option>
        </select>

        <select style={dropdownStyle}>
          <option value="top_rated">Top Rated</option>
          <option value="latest">Latest</option>
          <option value="popular">Popular</option>
          <option value="most view">Most View</option>
        </select>

        <button style={buttonStyle}>Search</button>
      </div>

      <MovieList movies={exampleMovies} />
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
