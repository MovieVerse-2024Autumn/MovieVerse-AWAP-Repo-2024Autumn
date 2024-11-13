import React from "react";
import MovieCard from "./MovieCard";

export default function MovieList({ movies }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "1px",
      }}
    >
      {movies.map((movie) => (
        <MovieCard key={movie.id} {...movie} />
      ))}
    </div>
  );
}
