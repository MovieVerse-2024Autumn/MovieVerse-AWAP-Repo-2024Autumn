import { pool } from "../middleware/db.js";

// request to join a group
export const requestJoinGroup = async (groupId, userId) => {
  const query = `
    INSERT INTO group_member (group_id, account_id, member_status)
    VALUES ($1, $2, 'pending') 
    RETURNING *;
  `;
  const values = [groupId, userId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// admin receives join requests
export const getJoinRequests = async (groupId) => {
  const query = `
    SELECT account_id, member_status 
    FROM group_member 
    WHERE group_id = $1 AND member_status = 'pending';
  `;
  const values = [groupId];
  const result = await pool.query(query, values);
  return result.rows;
};

// accept or decline join requests
export const handleJoinRequest = async (groupId, userId, action) => {
  const newStatus = action === "accept" ? "accepted" : "declined";
  const query = `
    UPDATE group_member 
    SET member_status = $1 
    WHERE group_id = $2 AND account_id = $3 
    RETURNING *;
  `;
  const values = [newStatus, groupId, userId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// get groups joined by user
export const getUserJoinedGroups = async (userId) => {
  const query = `
    SELECT g.* 
    FROM movie_group g 
    INNER JOIN group_member gm ON g.id = gm.group_id 
    WHERE gm.account_id = $1 AND gm.member_status = 'accepted';
  `;
  const values = [userId];
  const result = await pool.query(query, values);
  return result.rows;
};
