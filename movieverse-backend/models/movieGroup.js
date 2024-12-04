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

// delete group
const deleteGroup = async (groupId) => {
  const client = await pool.connect();
  try {
    // begin transaction
    await client.query("BEGIN");

    // Delete the group from the movie_group table
    const query = `
      DELETE FROM movie_group 
      WHERE id = $1
      RETURNING *;
    `;
    const values = [groupId];
    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      throw new Error("Group not found");
    }

    await client.query("COMMIT");
    return result.rows[0]; // Return the deleted group information
  } catch (err) {
    // rollback transaction in case of error
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const getGroupDetails = async (groupId, userId) => {
  const query = `
    SELECT 
    g.*
FROM 
    movie_group g
JOIN 
    group_member gm 
ON 
    g.id = gm.group_id
WHERE 
    gm.account_id = $1
    AND gm.member_status = 'accepted'
    AND g.id = $2;

  `;
// const query = `
// SELECT * FROM movie_group 
// WHERE id = $1;
// `;
  const values = [userId,groupId];
  const result = await pool.query(query, values);
  if(result.rows.length===0){
    return null;
  }
  const query2 = `
    SELECT account_id as userId, concat(a.first_name,' ',a.last_name) as name
    FROM group_member gm join account a on gm.account_id = a.id 
    where gm.group_id = $1;
  `;
  const values2 = [groupId];
  const result2 = await pool.query(query2, values2);
  var data = {};
  data.groupDetails = result.rows[0];
  data.groupMembers = result2.rows;

  return data;
};


// Create a new post
const createPost = async ( postedBy, groupid, content, movieid, movietitle, movieposter) => {
  const client = await pool.connect();
  try {
    // Begin transaction
    await client.query("BEGIN");

    const query = `
    INSERT INTO groupposts(
      postedby, 
      groupid, 
      content, 
      movieid, 
      movietitle, 
      movieposter, 
      postedon
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
    RETURNING *;  -- Optionally, return the newly created post
  `;
  const values = [postedBy, groupid, content, movieid, movietitle, movieposter];
  const result = await client.query(query, values);
    
    // Commit transaction
    await client.query("COMMIT");

    // Return the newly created post
    return result.rows[0];
  } catch (err) {
    // Rollback transaction in case of an error
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// Get posts by groupId
const getPostsByGroupId = async (groupId) => {
  try {
    const query = `
      SELECT 
        gp.id,
        gp.groupid,
        gp.content,
        gp.movieid,
        gp.movietitle,
        gp.movieposter,
        gp.postedby,
        gp.postedon,
        CONCAT(a.first_name, ' ', a.last_name) AS posted_by_name
      FROM 
        GroupPosts gp
      JOIN 
        account a 
      ON 
        gp.postedby = a.id
      WHERE 
        gp.groupid = $1
      ORDER BY 
        gp.postedon DESC;
    `;
    const values = [groupId];
    const result = await pool.query(query, values);

    // Return the list of posts
    return result.rows;
  } catch (err) {
    throw err;
  }
};

// Delete member from group by account_id and group_id
const deleteMemberFromGroup = async (accountId, groupId) => {
  console.log(`Attempting to delete member with accountId: ${accountId} and groupId: ${groupId}`);

  try {
    const query = `
      DELETE FROM group_member
      WHERE account_id = $1 AND group_id = $2;
    `;
    const values = [accountId, groupId];
    const result = await pool.query(query, values);

    // Check if any rows were deleted (result.rowCount will be 0 if no rows were deleted)
    if (result.rowCount === 0) {
      throw new Error('Member not found in the specified group.acc:'+accountId + 'grp:'+groupId);
    }

    // If the member was deleted, return a success message
    return { message: 'Member successfully deleted from the group.' };
  } catch (err) {
    throw err;
  }
};


export { createGroup, getUserCreatedGroups, getAvailableGroups,deleteGroup, getGroupDetails, createPost, getPostsByGroupId ,deleteMemberFromGroup };




