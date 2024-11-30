import {
  getUnreadNotificationCount,
  requestJoinGroup,
  getJoinRequestNotification,
  handleJoinRequest,
  updateNotificationStatus,
  getJoinResponseNotification,
} from "../../models/notification.js";

// Function to fetch unread notification count
const getUnreadNotificationCountController = async (req, res, next) => {
  const userId = req.user.id; // Authenticated user's ID (either admin or regular user)

  try {
    const unreadCount = await getUnreadNotificationCount(userId); // Call the model function

    res.status(200).json({ count: unreadCount }); // Return the unread count as a response
  } catch (err) {
    next(err);
  }
};

// request to join a group
const requestJoinGroupController = async (req, res, next) => {
  const { groupId } = req.body;
  const userId = req.user.id; // Authenticated user's ID

  try {
    // Validate the groupId and userId (ensure both exist in their respective tables)
    if (!groupId) {
      return res.status(400).json({ message: "Invalid groupId." });
    }

    const request = await requestJoinGroup(groupId, userId);
    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
};

// admin receive join requests
const getJoinRequestNotificationController = async (req, res, next) => {
  const adminId = req.user.id; // Authenticated user's ID (must be an admin)

  try {
    const joinRequests = await getJoinRequestNotification(adminId);
    res.status(200).json(joinRequests);
  } catch (err) {
    next(err);
  }
};

// admin handles join requests
const handleJoinRequestController = async (req, res, next) => {
  const { groupId, userId, action, notificationId } = req.body;
  const adminId = req.user.id;

  try {
    if (!groupId || !userId || !action || !notificationId) {
      return res.status(400).json({
        message: "groupId, userId, action, and notificationId are required.",
      });
    }

    // Validate that the current user is the admin of the group
    const groupQuery = `SELECT admin_id FROM movie_group WHERE id = $1`;
    const groupResult = await pool.query(groupQuery, [groupId]);

    if (groupResult.rowCount === 0) {
      return res.status(404).json({ message: "Group not found." });
    }

    if (groupResult.rows[0].admin_id !== adminId) {
      return res.status(403).json({
        message: "Unauthorized: You are not the admin of this group.",
      });
    }

    // Update the membership status in group_member table and send response notification
    const updatedStatus = await handleJoinRequest(groupId, userId, action);

    const updatedNotification = await updateNotificationStatus(
      notificationId,
      updatedStatus.member_status
    );
    res.status(200).json({
      message: `Successfully ${updatedStatus.member_status} the join request.`,
      notification: updatedNotification,
    });
  } catch (err) {
    next(err);
  }
};

// user receives responses to join requests
const getJoinResponseNotificationController = async (req, res, next) => {
  const userId = req.user.id; // Authenticated user's ID (regular user)
  try {
    const notifications = await getJoinResponseNotification(userId);
    res.status(200).json(notifications);
  } catch (err) {
    next(err);
  }
};

export {
  getUnreadNotificationCountController,
  requestJoinGroupController,
  handleJoinRequestController,
  getJoinRequestNotificationController,
  getJoinResponseNotificationController,
};
