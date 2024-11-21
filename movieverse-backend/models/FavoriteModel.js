import { pool } from "../middleware/db.js";

const Favorite = {
    // Fetch favorite movie IDs for a specific account
    getFavoritesByAccountId: async (accountId) => {
        const query = `
            SELECT f.movie_id
            FROM favourite f
            WHERE f.account_id = $1;
        `;
        const result = await pool.query(query, [accountId]);
        return result.rows.map(row => row.movie_id); // Return an array of movie IDs
    },

    // Add a favorite movie for a specific account
    addFavorite: async (accountId, movieId) => {
        const query = `
            INSERT INTO favourite (account_id, movie_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING;
        `;
        await pool.query(query, [accountId, movieId]);
    },

    // Remove a favorite movie for a specific account
    removeFavorite: async (accountId, movieId) => {
        const query = `
            DELETE FROM favourite
            WHERE account_id = $1 AND movie_id = $2;
        `;
        const result = await pool.query(query, [accountId, movieId]);
        return result.rowCount > 0; // Return `true` if a row was deleted
    }
,
    // Get the current sharing status for an account
    getFavoritesByAccountId: async (accountId) => {
        const query = `
            SELECT f.movie_id
            FROM favourite f
            WHERE f.account_id = $1;
        `;
        const result = await pool.query(query, [accountId]);
        return result.rows.map((row) => row.movie_id);
    },

    toggleShareUrl: async (accountId, shareUrl) => {
        const query = `
            UPDATE account
            SET share_url = $1
            WHERE id = $2
            RETURNING share_url;
        `;
        const result = await pool.query(query, [shareUrl, accountId]);
        return result.rowCount > 0;
    },
};

export default Favorite;
