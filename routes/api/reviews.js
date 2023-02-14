const express = require("express");
const router = express.Router();
const reviewsController = require("../../controllers/reviewsController");
const verifyUserPrivilige = require("../../middleware/verifyUserPrivilige");

router
  .route("/")
  .get(reviewsController.getAllReviews)
  .post(reviewsController.createNewReview)
  .put(verifyUserPrivilige(), reviewsController.updateReview)
  .delete(verifyUserPrivilige(), reviewsController.deleteReview);
router.route("/:id").get(reviewsController.getReview);

module.exports = router;
