const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const CategoryModel = require("../models/categoryModel");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../Middleware/imageUpload");

exports.uploadCategoryimage = uploadSingleImage("image");

exports.resizeCategoryImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/category/${filename}`);

    req.body.image = filename;
  }

  next();
});

exports.createCategory = factory.createOne(CategoryModel);

exports.getCategories = factory.getAll(CategoryModel);

exports.getCategory = factory.getOne(CategoryModel);

exports.updateCategory = factory.updateOne(CategoryModel);

exports.deleteCategory = factory.deleteOne(CategoryModel);
