import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import MovieList from "../components/MovieList";
import ReviewList from "../components/ReviewList";
const url = "http://localhost:3001/api";

export default function Home() {
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
  }, []);

  useEffect(() => {
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
      <SectionTitle title="MOVIES" linkPath="/select-movies" />
      <div>
        <MovieList movies={movies} />
      </div>
      <SectionTitle title="REVIEWS" linkPath="/more-reviews" />
      <ReviewList reviews={reviews} movies={movies} />
      <Link to={"/show-time"}>
        <h3>ShowTime</h3>
      </Link>
      <Link to={"/favorites"}>
        <h3>Favorites</h3>
      </Link>
    </div>
  );
}
