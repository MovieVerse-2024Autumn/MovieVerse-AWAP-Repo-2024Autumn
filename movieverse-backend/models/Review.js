import { pool } from "../middleware/db.js";

const selectAllReviews = async () => {
  return await pool.query(
    "SELECT review.id, review.movie_id, review.movie_poster_path, review.title, review.description, review.rating, review.review_date, account.first_name, account.last_name, CONCAT(account.first_name, ' ', account.last_name) AS author FROM review JOIN account ON review.account_id = account.id"
  );
};

const selectOneReview = async (reviewId) => {
  return await pool.query(
    "SELECT review.id, review.movie_id, review.movie_poster_path, review.title, review.description, review.rating, review.review_date, account.first_name, account.last_name, CONCAT(account.first_name, ' ', account.last_name) AS author FROM review JOIN account ON review.account_id = account.id WHERE review.id = $1",
    [reviewId]
  );
};

export { selectAllReviews, selectOneReview };
