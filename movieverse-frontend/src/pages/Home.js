import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useFetchData } from "../utils/useFetchData";
import SectionTitle from "../components/SectionTitle";
import MovieList from "../components/MovieList";
import ReviewList from "../components/ReviewList";
import styles from "../styles/Home.module.css";

const url = "http://localhost:3001/api";

export default function Home() {
  const { data: movies = [] } = useFetchData(`${url}/movies-homepage`);
  const { data: reviews = [] } = useFetchData(`${url}/reviews`); // Default to empty array
  const [currentPage, setCurrentPage] = useState(0);
  const [moviesPerPage, setMoviesPerPage] = useState(1);

  // Update the moviesPerPage whenever window is resized
  useEffect(() => {
    const updateMoviesPerPage = () => {
      const movieCardWidth = 180; // Each movie card's width
      const newMoviesPerPage = Math.floor(window.innerWidth / movieCardWidth); // Calculate how many movies fit in one row
      setMoviesPerPage(newMoviesPerPage || 1);
    };

    // Initial call to set the correct moviesPerPage
    updateMoviesPerPage();

    // Add event listener to handle resizing
    window.addEventListener("resize", updateMoviesPerPage);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", updateMoviesPerPage);
  }, []);

  // Check if movies and reviews are arrays
  const startIndex = currentPage * moviesPerPage;
  const currentMovies = Array.isArray(movies)
    ? movies.slice(startIndex, startIndex + moviesPerPage)
    : [];

  const sortedReviews = Array.isArray(reviews)
    ? [...reviews].sort(
        (a, b) => new Date(b.review_date) - new Date(a.review_date)
      )
    : [];

  const homepageReviews = sortedReviews.slice(0, 5);

  return (
    <div>
      <div className={styles.contentWrapper}>
        <div className={styles.section}>
          <SectionTitle title="MOVIES" linkPath="/select-movies" />
          <MovieList movies={currentMovies} />

          {/* Pagination controls */}
          <ReactPaginate
            breakLabel="..."
            previousLabel="<"
            nextLabel=">"
            pageCount={Math.ceil(movies.length / moviesPerPage)}
            onPageChange={({ selected }) => setCurrentPage(selected)}
            pageRangeDisplayed={5}
            containerClassName={styles.pagination}
            activeClassName={styles.active}
          />
        </div>
        <div className={styles.section}>
          <SectionTitle title="REVIEWS" linkPath="/more-reviews" />
          <ReviewList reviews={homepageReviews} movies={movies} />
        </div>
      </div>
    </div>
  );
}
