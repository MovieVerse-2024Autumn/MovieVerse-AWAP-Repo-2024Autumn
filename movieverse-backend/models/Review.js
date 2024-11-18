import { pool } from "../middleware/db.js";

const selectAllReviews = async () => {
  return await pool.query(
    "SELECT review.id, review.movie_id, review.title, review.description, review.rating, review.review_date FROM review JOIN account ON review.account_id = account.id"
  );
};

export { selectAllReviews };
