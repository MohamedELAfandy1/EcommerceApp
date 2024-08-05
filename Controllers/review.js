const asyncHandler = require("express-async-handler");
const reviewModel = require("../models/reviewModel");
const factory = require("./handlersFactory");

exports.checkProductInBody = asyncHandler(async (req, res, next) => {
  if (req.params.productId) {
    req.body.product = req.params.productId;
  }
  if (!req.body.user) {
    req.body.user = req.user._id;
  }

  next();
});

exports.createFilterObject = asyncHandler(async (req, res, next) => {
  if (req.params.productId) {
    const product_id = req.params.productId;
    req.filterObject = { product: product_id };
  }
  next();
});

exports.createReview = factory.createOne(reviewModel);

exports.getReviews = factory.getAll(reviewModel);

exports.getReview = factory.getOne(reviewModel);

exports.updateReview = factory.updateOne(reviewModel);

exports.deleteReview = factory.deleteOne(reviewModel);
