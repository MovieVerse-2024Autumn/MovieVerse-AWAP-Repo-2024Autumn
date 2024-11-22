import React from "react";
import ReviewCardForHomePage from "./ReviewCardForHomePage";
import styles from "../styles/Home.module.css";

export default function ReviewList({ reviews, movies }) {
  return (
    <div className={styles.reviewList}>
      {reviews.map((review) => {
        const movie = movies.find((movie) => movie.id === review.movie_id);
        //console.log("Review:", review.movie_id);
        //console.log("Movies:", movie.id);

        return (
          <ReviewCardForHomePage
            key={review.id}
            review={review}
            movie={movie}
          />
        );
      })}
    </div>
  );
}
