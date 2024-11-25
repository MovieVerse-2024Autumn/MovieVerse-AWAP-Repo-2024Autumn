import { pool } from '../middleware/db.js'; // Import pool correctly
import bcrypt from 'bcrypt';

const createUser = async (email, password, firstName, lastName) => {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const query = `
        INSERT INTO account (email, password, first_name, last_name, is_active, link)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
    const values = [email, hashedPassword, firstName, lastName, true, ''];
    const result = await pool.query(query, values); // Use pool.query
    return result.rows[0]; // Return the newly created user
};

const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM account WHERE email = $1;';
    const result = await pool.query(query, [email]); // Use pool.query
    return result.rows[0]; // Return the user if found
};

export default { createUser, findUserByEmail }; // Export the functions
