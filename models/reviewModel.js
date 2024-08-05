const mongoose = require("mongoose");
const ProductModel = require("./productModel");
const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "Min Ratings Value Is 1.0"],
      max: [5, "Max Ratings Value Is 5.0"],
      required: [true, "Review Ratings Required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review Must Belong To User"],
    },
    
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
      required: [true, "Review Must Belong To Product"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate([{ path: "user", select: "name" }]);
  next();
});

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "product",
        avgRatings: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    await ProductModel.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await ProductModel.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});
reviewSchema.post(
  "deleteOne",
  { document: true, query: false },
  function (doc) {
    doc.constructor.calcAverageRatingsAndQuantity(doc.product);
  }
);

module.exports = mongoose.model("Review", reviewSchema);
