const Review = require("../model/Review");

const verifyUserPrivilige = () => {
  return (req, res, next) => {
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ message: "Unauthorized Access" });
    }

    Review.findOne({ review_id: req.body.review_id }, (err, review) => {
      if (err) {
        return res.status(500).json({ message: "Something went wrong :(" });
      }
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      if (review.author_id !== req.user.user_id) {
        return res
          .status(401)
          .json({ message: "You are not authorized to perform this action" });
      }
      next();
    });
  };
};

module.exports = verifyUserPrivilige;
