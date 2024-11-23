import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Home.module.css";
const API_IMG = "https://image.tmdb.org/t/p/w500";

export default function MovieCard({ id, title, poster_path, vote_average }) {
  return (
    <div
      className={styles.movieCard}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <Link to={`/movies/${id}`} className={styles.movieLink}>
        <div>
          <img
            src={API_IMG + poster_path}
            alt=""
            className={styles.movieImage}
          />
        </div>
        <div className={styles.movieInfo}>
          <h6 className={styles.movieTitle}>{title}</h6>
          <p className={styles.movieRating}>{vote_average.toFixed(1)}</p>
        </div>
      </Link>
    </div>
  );
}
