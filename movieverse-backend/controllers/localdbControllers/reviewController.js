import { emptyOrRows } from "../../middleware/util.js";
import { selectAllReviews } from "../../models/Review.js";

const getReviews = async (req, res, next) => {
  try {
    const result = await selectAllReviews();
    return res.status(200).json(emptyOrRows(result));
  } catch (error) {
    return next(error);
  }
};

export { getReviews };
