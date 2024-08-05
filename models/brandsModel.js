const mongoose = require("mongoose");
const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name Is Required"],
      unique: [true, "Category Must Be Unique"],
      minlength: [1, "Too Short Brand Name"],
      maxlength: [32, "Too Long Brand Name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brand/${doc.image}`;
    doc.image = imageUrl;
  }
};
BrandSchema.post("init", function (doc) {
  setImageURL(doc);
});
BrandSchema.post("save", function (doc) {
  setImageURL(doc);
});

const BrandModel = mongoose.model("brand", BrandSchema);
module.exports = BrandModel;
