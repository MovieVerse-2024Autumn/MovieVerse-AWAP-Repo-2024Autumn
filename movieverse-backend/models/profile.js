import { pool } from "../middleware/db.js";

// get user's first name, last name, email, unique profile link
const selectUserDetail = async (accountId) => {
  const query = `SELECT * FROM account WHERE id = $1;`;
  const values = [accountId];
  const result = await pool.query(query, values);
  //console.log("Query Result:", result.rows[0]);
  return result.rows[0];
};

const selectUserAllReviews = async (accountId) => {
  const query = `
    SELECT * FROM review 
    WHERE account_id = $1;
  `;
  const values = [accountId];
  const result = await pool.query(query, values);
  return result.rows;
};

const deleteUserReview = async (reviewId) => {
  const query = `DELETE FROM review WHERE id = $1`;
  const values = [reviewId];
  const result = await pool.query(query, values);
  return result;
};

const updateUserName = async (accountId, firstName, lastName) => {
  return await pool.query(
    "UPDATE account SET first_name = $1, last_name = $2 WHERE id = $3;",
    [firstName, lastName, accountId]
  );
};

export {
  selectUserDetail,
  selectUserAllReviews,
  deleteUserReview,
  updateUserName,
};
