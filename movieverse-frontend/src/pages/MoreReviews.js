import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import { useFetchData } from "../hooks/useFetchData";
import ReviewCardForHomePage from "../components/ReviewCardForHomePage";
import styles from "../styles/Home.module.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const url = "http://localhost:3001/api";

const ITEMS_PER_PAGE = 5;

export default function MoreReviews() {
  const { data: movies } = useFetchData(`${url}/movies-homepage`);
  const { data: reviews } = useFetchData(`${url}/reviews`);
  console.log("reviews", reviews);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortByDate, setSortByDate] = useState(true);
  const [sortByLikes, setSortByLikes] = useState(false);

  // Sort reviews based on the active sorting method (date or likes)
  const sortedReviews = reviews
    ? [...reviews].sort((a, b) => {
        if (sortByLikes) {
          return b.like_count - a.like_count;
        }
        return new Date(b.review_date) - new Date(a.review_date);
      })
    : [];

  // get current reviews
  const currentReviews = sortedReviews.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handleSortByDate = () => {
    setSortByDate(true);
    setSortByLikes(false); // Ensure sorting by likes is false when sorting by date
  };

  const handleSortByLikes = () => {
    setSortByLikes(true);
    setSortByDate(false); // Ensure sorting by date is false when sorting by likes
  };

  return (
    <div>
      <Navbar />
      <div className={styles.reviewList}>
        <div className={styles.labelContainer}>
          <h3>All Reviews</h3>
          <div className={styles.sortLabels}>
            <span
              className={sortByDate ? styles.activeLabel : styles.sortLabel}
              onClick={handleSortByDate}
            >
              Recently Added
            </span>
            <span>|</span>
            <span
              className={sortByLikes ? styles.activeLabel : styles.sortLabel}
              onClick={handleSortByLikes}
            >
              Most Liked
            </span>
          </div>
        </div>

        {currentReviews.map((review) => {
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
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={({ selected }) => setCurrentPage(selected)}
        pageRangeDisplayed={5}
        pageCount={Math.ceil(reviews.length / ITEMS_PER_PAGE)}
        previousLabel="<"
        renderOnZeroPageCount={null}
        containerClassName={styles.pagination}
        activeClassName={styles.activePage}
      />
      <Footer />
    </div>
  );
}
