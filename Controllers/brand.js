const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const BrandModel = require("../models/brandsModel");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../Middleware/imageUpload");

exports.uploadBrandimage = uploadSingleImage("image");

exports.resizeBrandImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `Brand-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/brand/${filename}`);

    req.body.image = filename;
  }
  next();
});

exports.createBrand = factory.createOne(BrandModel);

exports.getBrands = factory.getAll(BrandModel);

exports.getBrand = factory.getOne(BrandModel);

exports.updateBrand = factory.updateOne(BrandModel);

exports.deleteBrand = factory.deleteOne(BrandModel);
