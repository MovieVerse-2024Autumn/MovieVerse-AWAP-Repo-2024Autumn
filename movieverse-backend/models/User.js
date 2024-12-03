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

export default { createUser, findUserByEmail };
