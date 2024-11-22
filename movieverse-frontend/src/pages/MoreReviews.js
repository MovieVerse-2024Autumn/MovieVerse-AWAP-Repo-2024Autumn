import React, { useEffect, useState } from "react";
import ReviewCardForHomePage from "../components/ReviewCardForHomePage";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const url = "http://localhost:3001/api";

export default function MoreReviews() {
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`${url}/movies-homepage`)
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        setMovies(data);
      })
      .catch((error) => console.error("Error fetching movies:", error));

    fetch(`${url}/reviews`)
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        setReviews(data);
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  }, []);

  return (
    <div>
      <Navbar />
      <div style={reviewlistStyle}>
        {reviews.map((review) => {
          const movie = movies.find((movie) => movie.id === review.movie_id);

          return (
            <ReviewCardForHomePage
              key={review.id}
              review={review}
              movie={movie}
            />
          );
        })}
      </div>
      <Footer />
    </div>
  );
}

const reviewlistStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};
