const { check } = require("express-validator");
const validatorMiddleware = require("../../Middleware/validatorMiddleware");
const { default: slugify } = require("slugify");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID Format"),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand Name Required")
    .isLength({ min: 1 })
    .withMessage("Too Short Brand Name")
    .isLength({ max: 32 })
    .withMessage("Too Long Brand Name"),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID Format"),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID Format"),
  validatorMiddleware,
];
