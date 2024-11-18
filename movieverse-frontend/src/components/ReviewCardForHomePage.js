import React from "react";
const API_IMG = "https://image.tmdb.org/t/p/w500";

export default function ReviewCardForHomePage({ review, movie }) {
  const { title, review_date, description, rating } = review;
  const movie_link = movie ? `/movies/${movie.id}` : "#";
  const poster_path = movie ? movie.poster_path : "";

  return (
    <div style={reviewcardStyle}>
      <div style={reviewimagecontainerStyle}>
        <img src={API_IMG + poster_path} alt="" style={reviewimageStyle} />
      </div>

      <div style={reviewtextStyle}>
        <h4 style={reviewtitleStyle}>{title}</h4>
        <div style={reviewinfoStyle}>
          <span>{new Date(review_date).toLocaleDateString()}</span>
          <span>{rating}</span>
        </div>
        <p style={reviewdescriptionStyle}>
          {description.length > 100
            ? `${description.substring(0, 100)}...`
            : description}
        </p>
        <a href={movie_link} style={reviewlinkStyle}>
          View Movie Details
        </a>
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
  padding: "10px",
  marginBottom: "2px",
};

const reviewimagecontainerStyle = { flexShrink: 0, marginRight: "10px" };

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
  fontSize: "10px",
  color: "#666",
};

const reviewdescriptionStyle = {
  marginTop: "10px",
  fontSize: "14px",
  lineHeight: "1.5em",
};

const reviewlinkStyle = {
  marginTop: "10px",
  display: "inline-block",
  color: "#007bff",
};
