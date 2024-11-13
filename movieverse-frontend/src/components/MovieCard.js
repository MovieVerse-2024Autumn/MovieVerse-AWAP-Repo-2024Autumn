import React from "react";
const API_IMG = "https://image.tmdb.org/t/p/w500";

export default function MovieCard({ title, poster_path, vote_average }) {
  return (
    <div
      style={{
        width: "200px",
        height: "320px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "10px",
        transition: "transform 0.3s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <img
        src={API_IMG + poster_path}
        alt=""
        style={{
          width: "90%",
          height: "70%",
          objectFit: "cover",
          padding: "10px",
        }}
      />
      <div
        style={{
          padding: "10px",
          textAlign: "center",
        }}
      >
        <h6 style={{ fontSize: "15px", margin: "5px 0" }}>{title}</h6>
        <p style={{ fontSize: "15px", color: "#666", margin: "0" }}>
          {vote_average}
        </p>
      </div>
    </div>
  );
}
