import {
  selectUserDetail,
  selectUserAllReviews,
  deleteUserReview,
  updateUserName,
} from "../../models/profile.js";

const getUserDetailController = async (req, res, next) => {
  const accountId = req.params.id;
  //console.log("Received accountId:", req.params.id);

  try {
    const result = await selectUserDetail(accountId);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const getUserAllReviewsController = async (req, res, next) => {
  const accountId = req.params.id;
  try {
    const result = await selectUserAllReviews(accountId);
    if (!result || result.length === 0) {
      return res.status(404).json({ error: "No reviews found for this user" });
    }
    res.json(result);
    //console.log("User reviews:", result, "in profileController.js");
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ error: "Failed to fetch user reviews" });
  }
};

const deleteUserReviewController = async (req, res, next) => {
  const reviewId = req.params.id;
  try {
    await deleteUserReview(reviewId);
    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

const updateUserNameController = async (req, res, next) => {
  const accountId = req.params.id;
  const { firstName, lastName } = req.body;
  try {
    await updateUserName(accountId, firstName, lastName);
    return res.status(200).json({ message: "Name updated successfully" });
  } catch (error) {
    return next(error);
  }
};

export {
  getUserDetailController,
  getUserAllReviewsController,
  deleteUserReviewController,
  updateUserNameController,
};
