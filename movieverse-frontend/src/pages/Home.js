import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import MovieList from "../components/MovieList";
import ReviewList from "../components/ReviewList";
const url = "http://localhost:3001/api";

export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`${url}/movies-homepage`)
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        setMovies(data);
      })
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

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
      <SectionTitle title="MOVIES" linkPath="/more-movies" />
      <div className="grid">
        <MovieList movies={movies} />
      </div>
      <SectionTitle title="REVIEWS" linkPath="/more-reviews" />
      <ReviewList reviews={reviewArray} />
      <Link to={"/show-time"}>
        <h3>ShowTime</h3>
      </Link>
    </div>
  );
}
