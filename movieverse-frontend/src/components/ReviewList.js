import React from "react";
import ReviewCardForHomePage from "./ReviewCardForHomePage";

export default function ReviewList({ reviews, movies }) {
  return (
    <div style={reviewlistStyle}>
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

const reviewlistStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};
