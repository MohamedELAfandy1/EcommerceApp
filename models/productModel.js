const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too Short Product Name"],
      maxlength: [100, "Too Long Product Name"],
    },
    slug: {
      type: String,
      required: [true],
      lowercase: true,
    },
    descreption: {
      type: String,
      required: [true, "Product Descreption Is Requird"],
      minLength: [10, "Too Short Descreption"],
    },
    quantity: {
      type: Number,
      required: [true, "Product Quantity Is Required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product Price Is Required"],
      trim: true,
      max: [1000000, "Too Long Price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    imageCover: {
      type: String,
      required: [true, "Product Image Is Cover Is Required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
      required: [true, "Product Must Be Blong To Category"],
    },
    subcategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating Must Be Greater Than Or Equal 1"],
      max: [5, "Rating Must Be Smaller Than Or Equal 1"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
ProductSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product", 
  localField: "_id", 
});

ProductSchema.pre(/^find/, function (next) {
  this.populate([
    { path: "category", select: "name -_id" },
    { path: "subcategory", select: "name -_id" },
  ]);
  next();
});
const setImageUrl = (doc) => {
  if (doc.imageCover) {
    doc.imageCover = `${process.env.BASE_URL}/product/${doc.imageCover}`;
  }
  if (doc.images) {
    const imagesList = [];
    doc.images.forEach((img) => {
      const image = `${process.env.BASE_URL}/product/${img}`;
      imagesList.push(image);
    });
    doc.images = imagesList;
  }
};
ProductSchema.post("save", (doc) => {
  setImageUrl(doc);
});
ProductSchema.post("init", (doc) => {
  setImageUrl(doc);
});
const ProductModel = mongoose.model("product", ProductSchema);
module.exports = ProductModel;
