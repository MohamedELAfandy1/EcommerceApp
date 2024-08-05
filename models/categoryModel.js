const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category Name Is Required"],
      unique: [true, "Category Must Be Unique"],
      minlength: [2, "Too Short Category Name"],
      maxlength: [32, "Too Long category Name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/category/${doc.image}`;
    doc.image = imageUrl;
  }
};
categorySchema.post("init", function (doc) {
  setImageURL(doc);
});
categorySchema.post("save", function (doc) {
  setImageURL(doc);
});

const CategoryModel = mongoose.model("category", categorySchema);

module.exports = CategoryModel;
