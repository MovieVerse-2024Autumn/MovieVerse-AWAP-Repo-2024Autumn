import { Router } from "express";
import authenticate from "../middleware/auth.js";

const router = Router();

import {
  getGroupDetailsController,
  createPostController,
  getPostsByGroupIdController,
  deleteMemberFromGroupController,
} from "../controllers/localdbControllers/groupsController.js";

/**** Group Details Page ******/
router.post("/groups/getdetails", authenticate, getGroupDetailsController);

router.post("/groups/createpost", authenticate, createPostController);

router.get(
  "/groups/getgrouppost/:id",
  authenticate,
  getPostsByGroupIdController
);

router.delete(
  "/groups/removegroupmember",
  authenticate,
  deleteMemberFromGroupController
);

export default router;
