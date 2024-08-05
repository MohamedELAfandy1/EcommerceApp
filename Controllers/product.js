const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const ProductModel = require("../models/productModel");
const factory = require("./handlersFactory");
const apiError = require("../Utils/apiError");
const { uploadMixOfImages } = require("../Middleware/imageUpload");

exports.uploadProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 8 },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  if (req.files) {
    if (req.files.imageCover) {
      const imageCoverfilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
      await sharp(req.files.imageCover[0].buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/product/${imageCoverfilename}`);
      req.body.imageCover = imageCoverfilename;
    }
    if (req.files.images) {
      req.body.images = [];
      await Promise.all(
        req.files.images.map(async (image, index) => {
          const imageName = `product-${uuidv4()}-${Date.now()}-${
            index + 1
          }.jpeg`;
          await sharp(image.buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`uploads/product/${imageName}`);

          req.body.images.push(imageName);
        })
      );
    }
  }
  next();
});
exports.createProduct = factory.createOne(ProductModel);

exports.getProducts = factory.getAll(ProductModel);

exports.getProduct = factory.getOne(ProductModel,"reviews");

exports.updateProduct = factory.updateOne(ProductModel);

exports.deleteProduct = factory.deleteOne(ProductModel);
