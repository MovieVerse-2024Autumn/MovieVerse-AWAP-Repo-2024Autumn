import { Router } from "express";
import {
  getReviews,
  getOneReview,
  addReview,
  updateReviewLikeCount,
} from "../controllers/localdbControllers/reviewController.js";

const router = Router();
router.get("/reviews", getReviews); // get all reviews
router.get("/reviews/:id", getOneReview); // get one review
router.post("/reviews/:id/like", updateReviewLikeCount); // update like count
router.post("/movies/:id/reviews", addReview); // Add  POST route

export default router;
