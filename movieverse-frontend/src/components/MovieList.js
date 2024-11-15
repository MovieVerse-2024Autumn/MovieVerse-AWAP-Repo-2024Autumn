import React from "react";
import MovieCard from "./MovieCard";

export default function MovieList({ movies }) {
  return (
    <div style={moviecardStyle}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} {...movie} />
      ))}
    </div>
  );
}

const moviecardStyle = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: "1px",
};
