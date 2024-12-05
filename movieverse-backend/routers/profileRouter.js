import { Router } from "express";
import authenticate from "../middleware/auth.js";
const router = Router();

import {
  getUserDetailController,
  getUserAllReviewsController,
  deleteUserReviewController,
  updateUserNameController,
} from "../controllers/localdbControllers/profileController.js";

router.get("/profile/reviews/:id", authenticate, getUserAllReviewsController);

router.get("/profile/:id", authenticate, getUserDetailController);

router.patch("/profile/update/:id", authenticate, updateUserNameController);

router.delete(
  "/profile/reviews/delete/:id",
  authenticate,
  deleteUserReviewController
);

export default router;
