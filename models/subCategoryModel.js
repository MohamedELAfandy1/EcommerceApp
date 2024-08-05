const mongoose = require("mongoose");
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category Name Is Required"],
      trim: true,
      unique: [true, "Sub category Must Be Unique"],
      minlength: [2, "Too Short Subcategory Name"],
      maxlength: [32, "Too Long Subcategory Name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
      required: [true, "SubCategory Must Be Belong To Parent Category"],
    },
  },
  { timestamps: true }
);

subCategorySchema.pre(/^find/, function (next) {
  this.populate([{ path: "category", select: "name -_id" }]);
  next();
});
const subCategoryModel = mongoose.model("subCategory", subCategorySchema);
module.exports = subCategoryModel;
