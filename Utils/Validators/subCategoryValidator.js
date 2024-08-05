const { check } = require("express-validator");
const validatorMiddleware = require("../../Middleware/validatorMiddleware.js");

exports.getsubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory ID Format"),
  validatorMiddleware,
];

exports.createsubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subCategory Name Required")
    .isLength({ min: 2 })
    .withMessage("Too Short subCategoryName")
    .isLength({ max: 32 })
    .withMessage("Too Long subCategoryName"),
  check("category")
    .notEmpty()
    .withMessage("Category Name Required")
    .isMongoId()
    .withMessage("Invalid Category Id Format"),
  validatorMiddleware,
];

exports.updatesubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory ID Format"),
  validatorMiddleware,
];

exports.deletesubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory ID Format"),
  validatorMiddleware,
];
