import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FiThumbsUp } from "react-icons/fi";
import { TbShare3 } from "react-icons/tb";
import styles from "../styles/Home.module.css";
const API_IMG = "https://image.tmdb.org/t/p/w500";

const url = `${process.env.REACT_APP_API}api`;

export default function ReviewDetail() {
  const { reviewId } = useParams(); // Get reviewId from URL params
  const [review, setReview] = useState(null);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    // Fetch the review by ID
    fetch(`${url}/reviews/${reviewId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched review data:", data[0]);
        setReview(data[0]); // Set the fetched review data
        setLikes(data[0].like_count || 0); // Set the initial like count
      })
      .catch((error) => console.error("Error fetching review:", error));
  }, [reviewId]); // Re-run the effect when the reviewId changes

  if (!review) {
    return <div>Loading...</div>; // Optionally, display a loading message
  }

  const movie_link = `/movies/${review.movie_id}`;
  const poster_path = review.movie_poster_path;

  const handleLike = () => {
    // Optimistically update likes in the UI
    setLikes((prevLikes) => prevLikes + 1);

    // Send updated likes count to the backend
    fetch(`${url}/reviews/${reviewId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((error) => {
      console.error("Error updating likes:", error);
      // Revert the like count in case of error
      setLikes((prevLikes) => prevLikes - 1);
    });
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    alert("Review link copied to clipboard!");
  };

  // Helper function to render stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(
        <span key={i} style={reviewStarStyle}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div>
      <div style={reviewDetailStyle}>
        <Link to="/more-reviews">
          <p>Back to Reviews</p>
        </Link>
        <div style={contentWrapperStyle}>
          <Link to={movie_link}>
            <div>
              <img
                src={API_IMG + poster_path}
                alt=""
                style={reviewPosterStyle}
              />
            </div>
          </Link>
          <div style={reviewInfoStyle}>
            <h3>{review.title}</h3>
            <div style={reviewMetaStyle}>
              <span>Reviewed by {review.author}</span>
              <span style={starsWrapperStyle}>
                {renderStars(review.rating)}
              </span>
            </div>
            <div style={reviewMetaStyle}>
              <span>{new Date(review.review_date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <p style={reviewDescriptionStyle}>{review.description}</p>

        <div className={styles.reviewActions}>
          <button className={styles.likeButton} onClick={handleLike}>
            <FiThumbsUp /> {likes} Likes
          </button>
          <button className={styles.shareButton} onClick={handleShare}>
            <TbShare3 /> Share
          </button>
        </div>
      </div>
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

const contentWrapperStyle = {
  display: "flex",
  alignItems: "flex-start", // Align poster and text vertically at the top
  gap: "20px",
};

const reviewPosterStyle = {
  maxWidth: "90px", // Set a maximum width for the poster
  borderRadius: "8px",
};

const reviewInfoStyle = {
  display: "flex",
  flexDirection: "column", // Stack text elements vertically
};

const reviewMetaStyle = {
  display: "flex",
  alignItems: "center",
  color: "#666", // Lighter color for meta text
  fontSize: "14px",
  gap: "15px",
  marginBottom: "15px",
};

const reviewDescriptionStyle = {
  marginTop: "20px",
  lineHeight: "1.6", // Improve readability with proper line height
  fontSize: "16px",
};

const reviewStarStyle = {
  color: "#FFD700", // Yellow color for the stars
  fontSize: "16px",
  marginRight: "2px",
};

const starsWrapperStyle = {
  display: "flex", // Ensure stars align horizontally
};
