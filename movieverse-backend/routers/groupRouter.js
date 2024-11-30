import { Router } from "express";
import authenticate from "../middleware/auth.js";

const router = Router();

import {
  createGroupController,
  getUserCreatedGroupsController,
  getUserJoinedGroupsController,
  getAvailableGroupsController,
  requestJoinGroupController,
  handleJoinRequestController,
} from "../controllers/localdbControllers/groupController.js";

router.post("/groups/create", authenticate, createGroupController);
router.get("/groups/my-groups", authenticate, getUserCreatedGroupsController);
router.get(
  "/groups/joined-groups",
  authenticate,
  getUserJoinedGroupsController
);
router.get(
  "/groups/available-groups",
  authenticate,
  getAvailableGroupsController
);
router.post("/groups/join", authenticate, requestJoinGroupController);
router.post(
  "/groups/handle-request",
  authenticate,
  handleJoinRequestController
);

export default router;
