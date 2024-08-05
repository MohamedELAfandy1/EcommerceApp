const { check } = require("express-validator");
const validatorMiddleware = require("../../Middleware/validatorMiddleware.js");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID Format"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category Name Required")
    .isLength({ min: 2 })
    .withMessage("Too Short CategoryName")
    .isLength({ max: 32 })
    .withMessage("Too Long CategoryName"),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID Format"),
  check("name")
    .notEmpty()
    .withMessage("Category Name Required")
    .isLength({ min: 2 })
    .withMessage("Too Short CategoryName")
    .isLength({ max: 32 })
    .withMessage("Too Long CategoryName"),

  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID Format"),
  validatorMiddleware,
];
