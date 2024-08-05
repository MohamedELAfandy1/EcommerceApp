const express = require("express");
const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  createFilterObject,
  checkProductInBody,
} = require("../Controllers/review");
const { auth, allowedTo } = require("../Controllers/auth");

const {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../Utils/Validators/reviewsValidator");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObject, getReviews)
  .post(
    auth,
    allowedTo("user"),
    checkProductInBody,
    createReviewValidator,
    createReview
  );

router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(auth, allowedTo("user"), updateReviewValidator, updateReview)
  .delete(
    auth,
    allowedTo("admin", "manager", "user"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
