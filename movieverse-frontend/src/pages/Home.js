import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import SectionTitle from "../components/SectionTitle";
import HomeMovieList from "../components/HomeMovieList";
import ReviewList from "../components/ReviewList";
import styles from "../styles/Home.module.css";
import PosterImage from "../assest/Redone.jpg";

const url = process.env.REACT_APP_API;

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [moviesPerPage, setMoviesPerPage] = useState(1);

  // Fetch movies data
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${url}api/movies-homepage`);
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error.message);
      }
    };

    fetchMovies();
  }, []);

  // Fetch reviews data
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${url}api/reviews`);
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error.message);
      }
    };

    fetchReviews();
  }, []);

  // Update the moviesPerPage whenever window is resized
  useEffect(() => {
    const updateMoviesPerPage = () => {
      const movieCardWidth = 180;
      const movieRowCount = 2;
      const newMoviesPerPage =
        Math.floor(window.innerWidth / movieCardWidth) * movieRowCount;
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
      {/* Poster Section */}
      <div className={styles.posterWrapper}>
        <img
          src={PosterImage}
          alt="Featured Movie"
          className={styles.posterImage}
        />
        <div className={styles.posterOverlay}></div>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.section}>
          <SectionTitle title="MOVIES" linkPath="/select-movies" />
          <HomeMovieList movies={currentMovies} />

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
