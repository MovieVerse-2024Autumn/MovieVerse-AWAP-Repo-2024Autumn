import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useFetchData } from "../utils/useFetchData";
import SectionTitle from "../components/SectionTitle";
import MovieList from "../components/MovieList";
import ReviewList from "../components/ReviewList";
import styles from "../styles/Home.module.css";
import PosterImage from "../assest/Redone.jpg";

const url = `${process.env.REAC_APP_API}/api`;

export default function Home() {
  const { data: movies = [] } = useFetchData(`${url}/movies-homepage`);
  const { data: reviews = [] } = useFetchData(`${url}/reviews`);
  const [currentPage, setCurrentPage] = useState(0);
  const [moviesPerPage, setMoviesPerPage] = useState(10);

  useEffect(() => {
    const updateMoviesPerPage = () => {
      const movieListElement = document.querySelector(`.${styles.movieList}`);
      if (movieListElement) {
        const computedStyle = window.getComputedStyle(movieListElement);
        const columnCount = parseInt(
          computedStyle.getPropertyValue("grid-template-columns").split(" ").length,
          10
        );
        const movieRowCount = 2;
        setMoviesPerPage(columnCount * movieRowCount);
      }
    };

    updateMoviesPerPage();
    window.addEventListener("resize", updateMoviesPerPage);
    return () => window.removeEventListener("resize", updateMoviesPerPage);
  }, []);

  const startIndex = currentPage * moviesPerPage;
  const currentMovies = movies.slice(startIndex, startIndex + moviesPerPage);

  const sortedReviews = reviews.sort(
    (a, b) => new Date(b.review_date) - new Date(a.review_date)
  );
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
        <div className={styles.posterOverlay}>
       
        </div>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.section}>
          <SectionTitle title="MOVIES" linkPath="/select-movies" />
          <MovieList movies={currentMovies} />
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
