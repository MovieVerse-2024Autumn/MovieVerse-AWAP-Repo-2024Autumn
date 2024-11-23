import React from "react";
import MovieCard from "./MovieCard";
import styles from "../styles/Home.module.css";

export default function MovieList({ movies }) {
  return (
    <div className={styles.movieList}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} {...movie} />
      ))}
    </div>
  );
}
