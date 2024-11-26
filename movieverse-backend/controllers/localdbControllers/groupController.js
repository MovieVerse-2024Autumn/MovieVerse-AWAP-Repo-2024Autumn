// controllers/groupController.js
import {
  createGroup,
  getUserCreatedGroups,
  getAvailableGroups,
} from "../models/movieGroup.js";
import {
  requestJoinGroup,
  getJoinRequests,
  handleJoinRequest,
  getUserJoinedGroups,
} from "../models/groupMember.js";

// create group
export const createGroupController = async (req, res, next) => {
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
export const getUserCreatedGroupsController = async (req, res, next) => {
  const adminId = req.user.id;

  try {
    const groups = await getUserCreatedGroups(adminId);
    res.json(groups);
  } catch (err) {
    next(err);
  }
};

// get groups joined by user
export const getUserJoinedGroupsController = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const groups = await getUserJoinedGroups(userId);
    res.json(groups);
  } catch (err) {
    next(err);
  }
};

// get more groups
export const getAvailableGroupsController = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const groups = await getAvailableGroups(userId);
    res.json(groups);
  } catch (err) {
    next(err);
  }
};

// request to join a group
export const requestJoinGroupController = async (req, res, next) => {
  const { groupId } = req.body;
  const userId = req.user.id;

  try {
    const request = await requestJoinGroup(groupId, userId);
    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
};

// admin receive join requests
export const getJoinRequestsController = async (req, res, next) => {
  const { groupId } = req.params;
  try {
    const joinRequests = await getJoinRequests(groupId);
    res.json(joinRequests);
  } catch (err) {
    next(err);
  }
};

// admin handles join requests
export const handleJoinRequestController = async (req, res, next) => {
  const { groupId, userId, action } = req.body;

  try {
    const result = await handleJoinRequest(groupId, userId, action);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
