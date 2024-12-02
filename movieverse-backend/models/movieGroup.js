import { pool } from "../middleware/db.js";

// create new group
const createGroup = async (name, description, adminId) => {
  const client = await pool.connect();
  try {
    // begin transaction
    await client.query("BEGIN");

    const query = `
    INSERT INTO movie_group (name, description, admin_id) 
    VALUES ($1, $2, $3) 
    RETURNING *;
  `;
    const values = [name, description, adminId];
    const result = await client.query(query, values);
    const newGroup = result.rows[0];

    const memberQuery = `
    INSERT INTO group_member (account_id, group_id, member_status, admin_id) 
    VALUES ($1, $2, 'accepted', $3);
  `;
    const memberValues = [adminId, newGroup.id, adminId];
    await client.query(memberQuery, memberValues);

    // commit transaction
    await client.query("COMMIT");
    return newGroup;
  } catch (err) {
    // rollback transaction
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// get the groups created by user
const getUserCreatedGroups = async (adminId) => {
  const query = `
    SELECT * FROM movie_group 
    WHERE admin_id = $1;
  `;
  const values = [adminId];
  const result = await pool.query(query, values);
  return result.rows;
};

// get more groups
const getAvailableGroups = async (userId) => {
  const query = `
    SELECT g.*, 
           gm.member_status 
    FROM movie_group g 
    LEFT JOIN group_member gm 
    ON g.id = gm.group_id AND gm.account_id = $1
    WHERE (gm.account_id IS NULL OR gm.member_status = 'pending' OR gm.member_status = 'declined') 
  `;
  const values = [userId];
  const result = await pool.query(query, values);
  return result.rows;
};

const getGroupDetails = async (groupId) => {
//   const query = `
//     SELECT 
//     g.*
// FROM 
//     movie_group g
// JOIN 
//     group_member gm 
// ON 
//     g.id = gm.group_id
// WHERE 
//     gm.account_id = $1
//     AND g.id = $2;

//   `;
const query = `
SELECT * FROM movie_group 
WHERE id = $1;
`;
  const values = [groupId];
  const result = await pool.query(query, values);
  return result.rows;
};

export { createGroup, getUserCreatedGroups, getAvailableGroups, getGroupDetails };
