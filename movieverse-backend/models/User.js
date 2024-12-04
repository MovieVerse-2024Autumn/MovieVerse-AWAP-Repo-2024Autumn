import { pool } from "../middleware/db.js";
import bcrypt from "bcrypt";

const createUser = async (email, password, firstName, lastName, uniqueUrl) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `
        INSERT INTO account (email, password, first_name, last_name, is_active, link, unique_profile_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `;
  const values = [
    email,
    hashedPassword,
    firstName,
    lastName,
    true,
    "",
    uniqueUrl,
  ];
  const result = await pool.query(query, values); // Use pool.query
  return result.rows[0]; // Return the newly created user
};

const findUserByEmail = async (email) => {
  const query = "SELECT * FROM account WHERE email = $1;";
  const result = await pool.query(query, [email]);
  return result.rows[0]; // Return the user if found
};

const deleteUserAccount = async (accountId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query("DELETE FROM reviews WHERE account_id = $1", [
      accountId,
    ]);

    await client.query("DELETE FROM movie_group WHERE admin_id = $1", [
      accountId,
    ]);

    await client.query("DELETE FROM group_member WHERE account_id = $1", [
      accountId,
    ]);

    await client.query("DELETE FROM account WHERE id = $1", [accountId]);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error deleting user account and related data:", err);
    throw err;
  } finally {
    client.release();
  }
};

export default { createUser, findUserByEmail, deleteUserAccount };
