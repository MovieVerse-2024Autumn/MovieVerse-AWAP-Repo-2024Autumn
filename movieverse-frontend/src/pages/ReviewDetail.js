import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const url = "http://localhost:3001/api"; // Ensure this matches your API base URL

export default function ReviewDetail() {
  const { reviewId } = useParams(); // Get reviewId from URL params
  const [review, setReview] = useState(null);

  useEffect(() => {
    // Fetch the review by ID
    fetch(`${url}/reviews/${reviewId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched review data:", data[0]);
        setReview(data[0]); // Set the fetched review data
      })
      .catch((error) => console.error("Error fetching review:", error));
  }, [reviewId]); // Re-run the effect when the reviewId changes

  if (!review) {
    return <div>Loading...</div>; // Optionally, display a loading message
  }

  return (
    <div style={reviewDetailStyle}>
      <h2>{review.title}</h2>
      <div style={reviewInfoStyle}>
        <span>{review.author}</span>
        <span>{new Date(review.review_date).toLocaleDateString()}</span>
        <span>{review.rating}</span>
      </div>
      <p>{review.description}</p>
    </div>
  );
}

// Styling for the review detail page
const reviewDetailStyle = {
  padding: "20px",
  maxWidth: "800px",
  margin: "0 auto",
  fontFamily: "Arial, sans-serif",
};

const reviewInfoStyle = {
  display: "flex",
  gap: "10px",
  fontSize: "14px",
  color: "#666",
};

const reviewImageStyle = {
  width: "200px",
  height: "300px",
  objectFit: "cover",
  borderRadius: "8px",
  marginTop: "10px",
};
