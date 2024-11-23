import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import SectionTitle from "../components/SectionTitle";
import MovieList from "../components/MovieList";
import ReviewList from "../components/ReviewList";
import styles from "../styles/Home.module.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const url = "http://localhost:3001/api";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [moviesPerPage, setMoviesPerPage] = useState(1);

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
        const sortedReviews = data.sort(
          (a, b) => new Date(b.review_date) - new Date(a.review_date)
        );
        console.log("Sorted Reviews data", sortedReviews);
        setReviews(sortedReviews);
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  }, []);

  // Adjust movies per page dynamically
  useEffect(() => {
    const updateMoviesPerPage = () => {
      const screenWidth = window.innerWidth;
      const moviesPerRow = Math.floor(screenWidth / 180); // 180px for each card (150px + margin)
      setMoviesPerPage(moviesPerRow);
    };
    updateMoviesPerPage();
    window.addEventListener("resize", updateMoviesPerPage);
    return () => window.removeEventListener("resize", updateMoviesPerPage);
  }, []);

  // Handle page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Get current movies for the page
  const startIndex = currentPage * moviesPerPage;
  const currentMovies = movies.slice(startIndex, startIndex + moviesPerPage);

  const homepageReviews = reviews.slice(0, 5);

  return (
    <div className={styles.homeContainer}>
      <Navbar />
      <div className={styles.contentWrapper}>
        <div className={styles.section}>
          <SectionTitle title="MOVIES" linkPath="/select-movies" />
          <MovieList movies={currentMovies} />

          {/* Pagination controls */}
          <ReactPaginate
            previousLabel="<"
            nextLabel=">"
            pageCount={Math.ceil(movies.length / moviesPerPage)}
            onPageChange={handlePageChange}
            containerClassName={styles.pagination}
            activeClassName={styles.active}
          />
        </div>
        <div className={styles.section}>
          <SectionTitle title="REVIEWS Most Popular" linkPath="/more-reviews" />
          <ReviewList reviews={homepageReviews} movies={movies} />
        </div>
      </div>
      <Footer /> {/* Add Footer to the bottom of the page */}
    </div>
  );
}
