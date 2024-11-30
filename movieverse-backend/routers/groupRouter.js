import { Router } from "express";
import authenticate from "../middleware/auth.js";

const router = Router();

import {
  createGroupController,
  getUserCreatedGroupsController,
  getUserJoinedGroupsController,
  getAvailableGroupsController,
} from "../controllers/localdbControllers/groupController.js";

import {
  getUnreadNotificationCountController,
  requestJoinGroupController,
  handleJoinRequestController,
  getJoinRequestNotificationController,
  getJoinResponseNotificationController,
} from "../controllers/localdbControllers/notificationController.js";

/**** Groups Page ******/
// create groups
router.post("/groups/create", authenticate, createGroupController);
router.get("/groups/my-groups", authenticate, getUserCreatedGroupsController);
// more groups for users to join
router.get(
  "/groups/available-groups",
  authenticate,
  getAvailableGroupsController
);
// get the groups joined by user
router.get(
  "/groups/joined-groups",
  authenticate,
  getUserJoinedGroupsController
);

/**** Notification ******/
// send requests to join groups to admins
router.post("/groups/join-request", authenticate, requestJoinGroupController);

// admin receives join requests
router.get(
  "/groups/notifications",
  authenticate,
  getJoinRequestNotificationController
);

// admin handles join requests
router.patch(
  "/groups/notifications/handle-request",
  authenticate,
  handleJoinRequestController
);

// user receives responses to join requests
router.get(
  "/groups/notifications",
  authenticate,
  getJoinResponseNotificationController
);

// unread notification count
router.get(
  "/groups/notifications/unread-count",
  authenticate,
  getUnreadNotificationCountController
);

export default router;
