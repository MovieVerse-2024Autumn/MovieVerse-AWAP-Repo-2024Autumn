import React from "react";
import { Link } from "react-router-dom";
const API_IMG = "https://image.tmdb.org/t/p/w500";

export default function ReviewCardForHomePage({ review, movie }) {
  const {
    movie_id,
    movie_poster_path,
    title,
    review_date,
    description,
    rating,
    author,
  } = review;
  const movie_link = `/movies/${movie_id}`;
  const review_link = `/reviews/${review.id}`;
  const poster_path = movie_poster_path;

  // Helper function to render stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(
        <span key={i} style={reviewStarsStyle}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div style={reviewcardStyle}>
      <Link to={movie_link}>
        <div style={reviewimagecontainerStyle}>
          <img src={API_IMG + poster_path} alt="" style={reviewimageStyle} />
        </div>
      </Link>

      <div style={reviewtextStyle}>
        <h4 style={reviewtitleStyle}>{title}</h4>
        <div style={reviewinfoStyle}>
          <span>{author}</span>
          <span>{new Date(review_date).toLocaleDateString()}</span>
          <span>{renderStars(rating)}</span>
        </div>
        <p style={reviewdescriptionStyle}>
          {description.split(" ").slice(0, 40).join(" ")}
          {description.split(" ").length > 40 && (
            <>
              {"... "}
              <Link to={review_link} style={reviewlinkStyle}>
                (more)
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

const reviewcardStyle = {
  display: "flex",
  border: "1px solid #ddd",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  padding: "20px",
  marginBottom: "2px",
};

const reviewimagecontainerStyle = { flexShrink: 0, marginRight: "20px" };

const reviewtextStyle = { flex: 1 };

const reviewimageStyle = {
  width: "100px",
  height: "150px",
  objectFit: "cover",
  borderRadius: "4px",
};

const reviewtitleStyle = { margin: "0 0 10px 0" };

const reviewinfoStyle = {
  display: "flex",
  gap: "10px",
  fontSize: "13px",
  color: "#666",
  alignItems: "center",
};

const reviewdescriptionStyle = {
  margin: "10px 40px 10px 0",
  fontSize: "15px",
  lineHeight: "1.5em",
};

const reviewlinkStyle = {
  color: "#007bff",
  textDecoration: "none",
};

const reviewStarsStyle = {
  color: "#FFD700",
  fontSize: "16px",
  marginRight: "2px",
};
