import { Router } from "express";
import authenticate from "../middleware/auth.js";

const router = Router();

import {
  createGroupController,
  getUserCreatedGroupsController,
  getUserJoinedGroupsController,
  getAvailableGroupsController,
  getGroupDetailsController,
  deleteGroupController
} from "../controllers/localdbControllers/groupsController.js";

import {
  getUnreadNotificationCountController,
  requestJoinGroupController,
  handleJoinRequestController,
  getJoinRequestNotificationController,
  getJoinResponseNotificationController,
  markNotificationAsReadController,
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
// delete group
router.delete("/groups/delete/:id", authenticate, deleteGroupController);

/**** Notification ******/
// requests to join groups to admins
router.post("/groups/join-request", authenticate, requestJoinGroupController);

// admin receives join requests
router.get(
  "/groups/notifications/request",
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
  "/groups/notifications/response",
  authenticate,
  getJoinResponseNotificationController
);

// unread notification count
router.get(
  "/groups/notifications/unread-count",
  authenticate,
  getUnreadNotificationCountController
);

// mark a notification as read
router.patch(
  "/groups/notifications/mark-as-read",
  authenticate,
  markNotificationAsReadController
);
router.post("/groups/getdetails", authenticate,  getGroupDetailsController);



export default router;
