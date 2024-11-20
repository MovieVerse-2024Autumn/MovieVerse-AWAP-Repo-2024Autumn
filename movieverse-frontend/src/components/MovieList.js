import React from "react";
import MovieCard from "./MovieCard";

export default function MovieList({ movies }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
      {movies.map((movie) => (
        <div key={movie.id} style={{ width: "200px", textAlign: "center" }}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            style={{ width: "100%", borderRadius: "8px" }}
          />
          <h3 style={{ fontSize: "16px", margin: "10px 0" }}>{movie.title}</h3>
          <p style={{ color: "#888" }}>Rating: {movie.vote_average}</p>
        </div>
      ))}
    </div>
  );
}
