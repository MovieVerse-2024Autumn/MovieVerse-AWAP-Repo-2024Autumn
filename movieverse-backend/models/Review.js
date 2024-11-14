import { pool } from "../middleware/db.js";

const selectAllReviews = async () => {
  return await pool.query(
    "SELECT reviews.id, reviews.movie_id, reviews.title, reviews.content, reviews.review_date, account.user_name AS author FROM reviews JOIN account ON reviews.user_id = account.id"
  );
};

export { selectAllReviews };
