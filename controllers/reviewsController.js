const Review = require("../model/Review");
const User = require("../model/User");
const { validateReview } = require("../auth-utils/reviewsValidator");
const { v4: uuidv4 } = require("uuid");

const getAllReviews = async (req, res) => {
  const userReviews = await User.findOne({
    user_id: req.user.user_id,
  })
    .populate("reviews")
    .exec();
  userReviews.reviews;
  if (!userReviews) {
    res.status(204).json({ message: "No reviews found." });
  } else {
    res.json(userReviews.reviews);
  }
};

const createNewReview = async (req, res) => {
  const { error, value } = await validateReview(req.body); // evaluate all fields
  if (error) {
    console.log(req.body);
    return res.status(400).json({ message: error });
  }

  const newReviewAdded = await User.findOne({
    user_id: req.user.user_id,
  })
    .populate("reviews")
    .exec(async function (err, user) {
      if (err) {
        console.log(err);
      } else {
        const parseReview = {
          author_id: req.user.user_id,
          author_name: req.user.fullname,
          review_id: uuidv4(),
          title: req.body.title,
          content: req.body.content,
        };
        Review.create(parseReview, function (err, review) {
          if (err) {
            res.status(500).json("error", "Something went wrong :(");
          } else {
            //save review and save updated user
            review.save();
            user.reviews.push(review);
            user.save();
            res.status(200).json("Successfully added review!");
            // res.redirect("/users/" + user._id);
          }
        });
      }
    });
};

const updateReview = async (req, res) => {
  if (!req?.body?.review_id) {
    return res
      .status(400)
      .json({ message: "Review ID parameter is required." });
  }

  const review = await Review.findOne({ review_id: req.body.review_id }).exec();
  if (!review) {
    return res
      .status(204)
      .json({ message: "No review matches ID ${req.body.review_id}." });
  }
  if (req.body?.title) review.title = req.body.title;
  if (req.body?.content) review.content = req.body.content;
  const result = await review.save();
  res.json(result);
};

const deleteReview = async (req, res) => {
  if (!req?.body?.review_id) {
    return res.status(400).json({ message: "Review ID is required." });
  }

  const review = await Review.findOne({ review_id: req.body.review_id }).exec();
  if (!review) {
    return res
      .status(204)
      .json({ message: "No review matches the review ID." });
  }

  const result = await review.deleteOne();
  res.json(result);
};

const getReview = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Review ID required." });

  const review = await Review.findOne({ _id: req.params.id }).exec();
  if (!review) {
    return res.status(204).json({ message: "No review matches ID." });
  }
  res.json(review);
};

module.exports = {
  getAllReviews,
  createNewReview,
  updateReview,
  deleteReview,
  getReview,
};
