import { emptyOrRows } from "../../middleware/util.js";
import { pool } from "../../middleware/db.js";
import {
  selectAllReviews,
  selectOneReview,
  insertReviewLikeCount,
} from "../../models/review.js";

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

const updateReviewLikeCount = async (req, res, next) => {
  const reviewId = req.params.id;
  try {
    const result = await insertReviewLikeCount(reviewId);
    return res.status(200).json({ like_count: result.rows[0].like_count });
  } catch (error) {
    return next(error);
  }
};

// New addReview function
const addReview = async (req, res, next) => {
  const {
    movie_id,
    movie_poster_path,
    account_id,
    title,
    description,
    rating,
  } = req.body;

  if (
    !movie_id ||
    !movie_poster_path ||
    !account_id ||
    !title ||
    !description ||
    !rating
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // First query to insert the review
    const insertQuery = `
      INSERT INTO review (movie_id, movie_poster_path, account_id, title, description, rating, like_count, review_date)
      VALUES ($1, $2, $3, $4, $5, $6, 0, NOW())
      RETURNING *;
    `;

    const insertValues = [
      movie_id,
      movie_poster_path,
      account_id,
      title,
      description,
      rating,
    ];

    const insertResult = await pool.query(insertQuery, insertValues);

    // Second query to get the review with the author's name
    const reviewId = insertResult.rows[0].id;
    const selectQuery = `
      SELECT r.id, r.movie_id, r.movie_poster_path, r.title, r.description,
             r.rating, r.review_date, r.like_count,
             CONCAT(a.first_name, ' ', a.last_name) AS author
      FROM review r
      JOIN account a ON r.account_id = a.id
      WHERE r.id = $1;
    `;

    const selectResult = await pool.query(selectQuery, [reviewId]);

    res.status(201).json(selectResult.rows[0]); // Return the newly created review with author's name
  } catch (error) {
    console.error("Error adding review:", error);
    return next(error);
  }
};

const getReviewsForMovie = async (req, res, next) => {
  const { movieId } = req.params; // Extract movieId from the request params
  try {
    const query = `
      SELECT r.id, r.movie_id, r.movie_poster_path, r.title, r.description,
             r.rating, r.review_date, r.like_count,
             CONCAT(a.first_name, ' ', a.last_name) AS author
      FROM review r
      JOIN account a ON r.account_id = a.id
      WHERE r.movie_id = $1
    `;
    const result = await pool.query(query, [movieId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this movie." });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching reviews for movie:", error);
    next(error);
  }
};

export {
  getReviews,
  addReview,
  getOneReview,
  getReviewsForMovie,
  updateReviewLikeCount,
};
