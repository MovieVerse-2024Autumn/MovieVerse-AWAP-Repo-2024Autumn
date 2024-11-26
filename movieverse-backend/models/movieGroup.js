import { pool } from "../middleware/db.js";

// create new group
export const createGroup = async (name, description, adminId) => {
  const query = `
    INSERT INTO movie_group (name, description, admin_id) 
    VALUES ($1, $2, $3) 
    RETURNING *;
  `;
  const values = [name, description, adminId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// get the groups created by user
export const getUserCreatedGroups = async (adminId) => {
  const query = `
    SELECT * FROM movie_group 
    WHERE admin_id = $1;
  `;
  const values = [adminId];
  const result = await pool.query(query, values);
  return result.rows;
};

// get more groups
export const getAvailableGroups = async (userId) => {
  const query = `
    SELECT * FROM movie_group 
    WHERE id NOT IN (
      SELECT group_id 
      FROM group_member 
      WHERE account_id = $1
    );
  `;
  const values = [userId];
  const result = await pool.query(query, values);
  return result.rows;
};
