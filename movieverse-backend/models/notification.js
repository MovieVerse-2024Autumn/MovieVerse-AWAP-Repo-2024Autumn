import { pool } from "../middleware/db.js";

// Fetch the unread notification count for a user
const getUnreadNotificationCount = async (userId) => {
  try {
    const query = `
      SELECT COUNT(*) AS unread_count
      FROM notification
      WHERE receiver_id = $1 AND is_read = 'unread'
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0].unread_count; // Return the unread count
  } catch (err) {
    throw new Error("Error fetching unread notification count: " + err.message);
  }
};

// request to join a group
const requestJoinGroup = async (groupId, userId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const groupQuery = `SELECT admin_id, name as group_name FROM movie_group WHERE id = $1`;
    const groupResult = await client.query(groupQuery, [groupId]);

    if (groupResult.rowCount === 0) {
      throw new Error("Group not found");
    }

    const { admin_id: adminId, group_name: groupName } = groupResult.rows[0];

    const existingMemberQuery = `SELECT * FROM group_member 
      WHERE group_id = $1 AND account_id = $2`;

    const existingMemberResult = await client.query(existingMemberQuery, [
      groupId,
      userId,
    ]);

    if (existingMemberResult.rowCount > 0) {
      const existingStatus = existingMemberResult.rows[0].member_status;

      if (existingStatus === "accepted") {
        throw new Error("You are already a member of this group.");
      }

      if (existingStatus === "pending") {
        throw new Error("Your join request is already pending.");
      }

      //update member_status to pending
      const updateMemberQuery = `
          UPDATE group_member 
          SET member_status = 'pending'
          WHERE group_id = $1 AND account_id = $2
          RETURNING *;
        `;
      await client.query(updateMemberQuery, [groupId, userId]);
    } else {
      const insertQuery = ` INSERT INTO group_member (group_id, account_id, member_status, admin_id)VALUES ($1, $2, 'pending', $3) RETURNING *;`;
      await client.query(insertQuery, [groupId, userId, adminId]);
    }

    // const memberResult = await client.query(memberStatusQuery, [
    //   groupId,
    //   userId,
    //   adminId,
    // ]);

    // insert notification, get user name
    const userQuery = `SELECT CONCAT(first_name, ' ', last_name) AS user_name FROM account WHERE id = $1`;
    const userResult = await client.query(userQuery, [userId]);

    if (userResult.rowCount === 0) {
      throw new Error("User not found");
    }

    const { user_name: userName } = userResult.rows[0];

    const notificationQuery = `INSERT INTO notification (sender_id, receiver_id, group_id, message, type)
      VALUES ($1, $2, $3, $4, 'join_request')
      RETURNING *;`;

    await client.query(notificationQuery, [
      userId,
      adminId,
      groupId,
      `User ${userName} has requested to join your group ${groupName}, please accept or decline.`,
    ]);

    await client.query("COMMIT");
    return { message: "Join request sent successfully." };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// admin receives join requests
const getJoinRequestNotification = async (receiverId) => {
  const query = `
    SELECT n.*, 
           CONCAT(a.first_name, ' ', a.last_name) AS sender_name,
           mg.name as group_name
    FROM notification n
    JOIN account a ON n.sender_id = a.id
    JOIN movie_group mg ON n.group_id = mg.id
    WHERE n.receiver_id = $1 AND n.is_read = 'unread' AND n.type = 'join_request'
    ORDER BY n.created_at DESC;
  `;
  const result = await pool.query(query, [receiverId]);
  return result.rows;
};

// admin handle join requests, accept or decline join requests, update member_status in group_member table
const handleJoinRequest = async (groupId, userId, action) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const newStatus = action === "accept" ? "accepted" : "declined";
    const memberQuery = `
    UPDATE group_member 
    SET member_status = $1 
    WHERE group_id = $2 AND account_id = $3 
    RETURNING *;
  `;
    const memberResult = await client.query(memberQuery, [
      newStatus,
      groupId,
      userId,
    ]);

    if (memberResult.rowCount === 0) {
      throw new Error("Join request not found");
    }

    const groupQuery = `SELECT name as group_name FROM movie_group WHERE id = $1`;
    const groupResult = await client.query(groupQuery, [groupId]);

    if (groupResult.rowCount === 0) {
      throw new Error("Group not found");
    }

    const { group_name: groupName } = groupResult.rows[0];

    const notificationQuery = `INSERT INTO notification (sender_id, receiver_id, group_id, message, type)
      VALUES ($1, $2, $3, $4, 'join_request_response')
      RETURNING *;`;

    await client.query(notificationQuery, [
      memberResult.rows[0].admin_id,
      userId,
      groupId,
      `Your request to join group ${groupName} is ${newStatus}.`,
    ]);

    await client.query("COMMIT");
    return memberResult.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// update notification status in notification table
const updateNotificationStatus = async (notificationId, actionStatus) => {
  const query = `
        UPDATE notification 
        SET is_read = 'read', action_status = $2
        WHERE id = $1
        RETURNING *;
    `;
  const values = [notificationId, actionStatus];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// user receives notifications to join requests
const getJoinResponseNotification = async (receiverId) => {
  const query = `
        SELECT n.*, 
             CONCAT(a.first_name, ' ', a.last_name) AS sender_name,
             mg.name as group_name
        FROM notification n
        JOIN account a ON n.sender_id = a.id
        JOIN movie_group mg ON n.group_id = mg.id
        WHERE n.receiver_id = $1 AND n.is_read = 'unread' AND n.type = 'join_request_response'
        ORDER BY n.created_at DESC;
    `;

  const result = await pool.query(query, [receiverId]);
  return result.rows;
};

// mark response notifications as read
const markNotificationAsRead = async (notificationId) => {
  try {
    const query = `
      UPDATE notification
      SET is_read = 'read'
      WHERE id = $1
      RETURNING *;
    `;

    const result = await pool.query(query, [notificationId]);

    if (result.rowCount === 0) {
      throw new Error("Notification not found");
    }

    return result.rows[0];
  } catch (err) {
    throw new Error("Error marking notification as read: " + err.message);
  }
};

export {
  getUnreadNotificationCount,
  requestJoinGroup,
  getJoinRequestNotification,
  handleJoinRequest,
  updateNotificationStatus,
  getJoinResponseNotification,
  markNotificationAsRead,
};
