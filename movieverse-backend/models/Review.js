import { pool } from "../middleware/db.js";

const selectAllReviews = async () => {
  const result = await pool.query(
    "SELECT review.id, review.movie_id, review.movie_poster_path, review.title, review.description, review.rating, review.review_date, review.like_count, account.first_name, account.last_name, CONCAT(account.first_name, ' ', account.last_name) AS author FROM review JOIN account ON review.account_id = account.id"
  );
  return result;
};

const selectOneReview = async (reviewId) => {
  return await pool.query(
    "SELECT review.id, review.movie_id, review.movie_poster_path, review.title, review.description, review.rating, review.review_date, review.like_count, account.first_name, account.last_name, CONCAT(account.first_name, ' ', account.last_name) AS author FROM review JOIN account ON review.account_id = account.id WHERE review.id = $1",
    [reviewId]
  );
};

const insertReviewLikeCount = async (reviewId) => {
  return await pool.query(
    "UPDATE review SET like_count = like_count + 1 WHERE id = $1 RETURNING like_count",
    [reviewId]
  );
};

export { selectAllReviews, selectOneReview, insertReviewLikeCount };
