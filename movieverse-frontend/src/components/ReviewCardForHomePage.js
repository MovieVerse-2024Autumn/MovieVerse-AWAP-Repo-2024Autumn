import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiThumbsUp } from "react-icons/fi";
import { TbShare3 } from "react-icons/tb";
import styles from "../styles/Home.module.css";
const API_IMG = "https://image.tmdb.org/t/p/w500";

export default function ReviewCardForHomePage({ review }) {
  const {
    movie_id,
    movie_poster_path,
    title,
    review_date,
    description,
    rating,
    author,
    like_count,
  } = review;
  const movie_link = `/movies/${movie_id}`;
  const review_link = `/reviews/${review.id}`;
  const poster_path = movie_poster_path;

  // Helper function to render stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(
        <span key={i} className={styles.reviewStars}>
          ★
        </span>
      );
    }
    return stars;
  };

  // Like functionality
  const [likeCount, setLikeCount] = useState(like_count);

  const handleLike = async () => {
    try {
      // Optional: Update like count in backend
      const response = await fetch(
        `http://localhost:3001/api/reviews/${review.id}/like`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update like count");
      }
      const data = await response.json();
      setLikeCount(data.like_count);
    } catch (err) {
      console.error("Error updating like count:", err);
    }
  };

  return (
    <div className={styles.reviewCard}>
      <Link to={movie_link}>
        <div className={styles.reviewImageContainer}>
          <img
            src={API_IMG + poster_path}
            alt=""
            className={styles.reviewImage}
          />
        </div>
      </Link>

      <div className={styles.reviewText}>
        <h4 className={styles.reviewTitle}>{title}</h4>
        <div className={styles.reviewInfo}>
          <span>{author}</span>
          <span>{new Date(review_date).toLocaleDateString()}</span>
          <span>{renderStars(rating)}</span>
        </div>
        <p className={styles.reviewDescription}>
          {description.split(" ").slice(0, 40).join(" ")}
          {description.split(" ").length > 40 && (
            <>
              {"... "}
              <Link to={review_link} className={styles.reviewLink}>
                (more)
              </Link>
            </>
          )}
        </p>
        <div className={styles.reviewActions}>
          <button className={styles.likeButton} onClick={handleLike}>
            <FiThumbsUp /> {likeCount > 0 && likeCount} Likes
          </button>
          <button
            className={styles.shareButton}
            onClick={() =>
              navigator.clipboard.writeText(
                window.location.origin + review_link
              )
            }
          >
            <TbShare3 />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
