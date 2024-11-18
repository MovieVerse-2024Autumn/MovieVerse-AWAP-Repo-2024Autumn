import { Router } from "express";
import { getReviews } from "../controllers/localdbControllers/reviewController.js";
import { addReview } from "../controllers/localdbControllers/reviewController.js";


const router = Router();
router.get("/reviews", getReviews);
router.post("/movies/:id/reviews", addReview); // Add  POST route


export default router;

