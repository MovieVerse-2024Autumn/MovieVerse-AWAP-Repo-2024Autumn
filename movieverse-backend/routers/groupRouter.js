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
} from "../controllers/groupController.js";

router.post("/create", authenticate, createGroupController);
router.get("/my-groups", authenticate, getUserCreatedGroupsController);
router.get("/joined-groups", authenticate, getUserJoinedGroupsController);
router.get("/available-groups", authenticate, getAvailableGroupsController);
router.post("/join", authenticate, requestJoinGroupController);
router.post("/handle-request", authenticate, handleJoinRequestController);

export default router;
