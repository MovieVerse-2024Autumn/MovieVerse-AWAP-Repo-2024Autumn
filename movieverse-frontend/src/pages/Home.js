import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import SectionTitle from "../components/SectionTitle";
import MovieList from "../components/MovieList";
import ReviewList from "../components/ReviewList";
import styles from "../styles/Home.module.css";

const url = "http://localhost:3001/api";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const moviesPerPage = 4;

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

  // Handle page change for pagination
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Get the current movies for the page
  const currentMovies = movies.slice(
    currentPage * moviesPerPage,
    (currentPage + 1) * moviesPerPage
  );

  return (
    <div>
      <SectionTitle title="MOVIES" linkPath="/select-movies" />
      <div>
        <MovieList movies={currentMovies} />
      </div>
      {/* Pagination controls */}
      <ReactPaginate
        previousLabel="<"
        nextLabel=">"
        pageCount={Math.ceil(movies.length / moviesPerPage)}
        onPageChange={handlePageChange}
        containerClassName={styles.pagination}
        activeClassName={styles.active}
      />

      <SectionTitle title="REVIEWS" linkPath="/more-reviews" />
      <ReviewList reviews={reviews} movies={movies} />
      <Link to={"/search"}>
        <h3>Search</h3>
      </Link>
      <Link to={"/show-time"}>
        <h3>ShowTime</h3>
      </Link>
      <Link to={"/favorites"}>
        <h3>Favorites</h3>
      </Link>
    </div>
  );
}
