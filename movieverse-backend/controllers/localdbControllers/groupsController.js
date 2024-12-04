import {
  createGroup,
  getUserCreatedGroups,
  getAvailableGroups,
  getGroupDetails,
  deleteGroup,
  createPost,
  getPostsByGroupId,
  deleteMemberFromGroup
} from '../../models/movieGroup.js';
import { getUserJoinedGroups } from '../../models/groupMember.js';

// create group
const createGroupController = async (req, res, next) => {
  const { name, description } = req.body;
  const adminId = req.user.id;

  try {
    const group = await createGroup(name, description, adminId);
    res.status(201).json(group);
  } catch (err) {
    next(err);
  }
};

// get groups created by user
const getUserCreatedGroupsController = async (req, res, next) => {
  const adminId = req.user.id;

  try {
    const groups = await getUserCreatedGroups(adminId);
    res.json(groups);
  } catch (err) {
    next(err);
  }
};

// get groups joined by user
const getUserJoinedGroupsController = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const groups = await getUserJoinedGroups(userId);
    res.json(groups);
  } catch (err) {
    next(err);
  }
};

// get more groups
const getAvailableGroupsController = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const groups = await getAvailableGroups(userId);
    res.status(200).json(groups);
  } catch (err) {
    next(err);
  }
};

const getGroupDetailsController = async (req, res, next) => {
  const { groupId } = req.body;
  const userId = req.user.id;
  try {
    const groups = await getGroupDetails(groupId, userId);
    res.json(groups);
  } catch (err) {
    next(err);
  }
};

const deleteGroupController = async (req, res, next) => {
  const { id: groupId } = req.params;

  try {
    await deleteGroup(groupId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// Create a post
const createPostController = async (req, res, next) => {
  const { groupid, content, movieid, movietitle, movieposter } = req.body;
  const postedBy = req.user.id;
  // Validate required fields
  if (!groupid || !content || !postedBy) {
    return res
      .status(400)
      .json({ error: 'GroupId, Content, and PostedBy are required.' });
  }
  try {
    const post = await createPost(
      postedBy, groupid, content, movieid, movietitle, movieposter
    );
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

// Get all posts for a specific group ID
const getPostsByGroupIdController = async (req, res, next) => {
  const { id: groupId } = req.params;

  try {
    const posts = await getPostsByGroupId(groupId);
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

// Get all posts for a specific group ID
const deleteMemberFromGroupController = async (req, res, next) => {
  const { accountId, groupId} = req.body;

  try {
    const posts = await deleteMemberFromGroup(accountId, groupId);
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

export {
  createGroupController,
  getUserCreatedGroupsController,
  getUserJoinedGroupsController,
  getAvailableGroupsController,
  deleteGroupController,
  getGroupDetailsController,
  createPostController,
  getPostsByGroupIdController,
  deleteMemberFromGroupController
};
