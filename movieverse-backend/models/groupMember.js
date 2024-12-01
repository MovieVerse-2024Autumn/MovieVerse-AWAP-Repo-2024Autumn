import { pool } from "../middleware/db.js";

// get groups joined by user
const getUserJoinedGroups = async (userId) => {
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

export { getUserJoinedGroups };
