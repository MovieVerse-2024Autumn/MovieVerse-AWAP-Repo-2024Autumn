import React from "react";
import ReviewCardForHomePage from "../components/ReviewCardForHomePage";

export default function MoreReviews() {
  const reviewArray = [
    {
      title: "The Dark Knight",
      content: "This is a review of the movie The Dark Knight.",
    },
    {
      title: "The Dark Knight",
      content: "This is a review of the movie The Dark Knight.",
    },
  ];
  return (
    <div>
      {reviewArray.map((review, index) => (
        <ReviewCardForHomePage key={index} review={review} />
      ))}
    </div>
  );
}
