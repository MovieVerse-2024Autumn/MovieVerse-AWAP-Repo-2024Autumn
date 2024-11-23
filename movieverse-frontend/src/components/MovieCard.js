import React from "react";
import { Link } from "react-router-dom";
const API_IMG = "https://image.tmdb.org/t/p/w500";

export default function MovieCard({ id, title, poster_path, vote_average }) {
  return (
    <div
      style={moviecardStyle}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <Link to={`/movies/${id}`} style={movielinkStyle}>
        <div style={imageContainerStyle}>
          <img src={API_IMG + poster_path} alt="" style={movieimageStyle} />
        </div>
        <div style={infoContainerStyle}>
          <h6 style={movietitleStyle}>{title}</h6>
          <p style={movieratingStyle}>{vote_average}</p>
        </div>
      </Link>
    </div>
  );
}

const moviecardStyle = {
  flex: "0 1 150px",
  height: "250px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  margin: "8px",
  transition: "transform 0.3s ease",
};

const movielinkStyle = {
  textDecoration: "none",
  color: "inherit",
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const imageContainerStyle = {
  flexShrink: 0,
  width: "100%",
  height: "70%",
  padding: "5px 5px 0 5px",
};

const movieimageStyle = {
  width: "100%",
  height: "100%",
  display: "block",
};

const infoContainerStyle = {
  padding: "8px",
  textAlign: "center",
  width: "100%",
  boxSizing: "border-box",
};

const movietitleStyle = {
  fontSize: "15px",
  margin: "5px 0",
};

const movieratingStyle = {
  fontSize: "13px",
  color: "#666",
  margin: "0",
};
