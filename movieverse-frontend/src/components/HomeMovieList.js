import React from "react";
import MovieCard from "./MovieCard";
import styles from "../styles/Home.module.css";

export default function HomeMovieList({ movies }) {
  return (
    <div className={styles.homePageMovieList}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} {...movie} />
      ))}
    </div>
  );
}
