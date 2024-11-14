import { Router } from "express";
import { getReviews } from "../controllers/localdbControllers/reviewController.js";

const router = Router();
router.get("/reviews", getReviews);

export default router;
