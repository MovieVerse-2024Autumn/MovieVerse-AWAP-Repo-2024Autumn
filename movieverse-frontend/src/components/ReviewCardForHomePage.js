import React from "react";

export default function ReviewCardForHomePage({ review }) {
  return (
    <div>
      <div>
        <h5>{review.title}</h5>
        <p>{review.content}</p>
      </div>
    </div>
  );
}
