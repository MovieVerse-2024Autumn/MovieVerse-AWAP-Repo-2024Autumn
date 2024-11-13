import React from "react";
import ReviewCardForHomePage from "./ReviewCardForHomePage";

export default function ReviewList({ reviews }) {
  return (
    <div>
      {reviews.map((review, index) => (
        <ReviewCardForHomePage key={index} review={review} />
      ))}
    </div>
  );
}
