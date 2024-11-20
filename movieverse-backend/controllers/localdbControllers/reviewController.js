import { emptyOrRows } from "../../middleware/util.js";
import { pool } from "../../middleware/db.js";
import { selectAllReviews, selectOneReview } from "../../models/Review.js";

const getReviews = async (req, res, next) => {
  try {
    const result = await selectAllReviews();
    return res.status(200).json(emptyOrRows(result));
  } catch (error) {
    return next(error);
  }
};

const getOneReview = async (req, res, next) => {
  const reviewId = req.params.id;
  try {
    const result = await selectOneReview(reviewId);
    return res.status(200).json(emptyOrRows(result));
  } catch (error) {
    return next(error);
  }
};

// New addReview function
const addReview = async (req, res, next) => {
  const { movie_id, account_id, title, description, rating } = req.body;

  if (!movie_id || !account_id || !title || !description || !rating) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const query = `
      INSERT INTO review (movie_id, account_id, title, description, rating, review_date)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *;
    `;

    const values = [movie_id, account_id, title, description, rating];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]); // Return the newly created review
  } catch (error) {
    console.error("Error adding review:", error);
    return next(error);
  }
};

export { getReviews, addReview, getOneReview };
