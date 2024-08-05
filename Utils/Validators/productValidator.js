const { check } = require("express-validator");
const validatorMiddleware = require("../../Middleware/validatorMiddleware");
const Category = require("../../models/categoryModel");
const subCategory = require("../../models/subCategoryModel");
const apiError = require("../apiError");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Title Is Required")
    .isLength({ min: 3 })
    .withMessage("Too Short Title")
    .isLength({ max: 100 })
    .withMessage("Too Long Title"),
  check("descreption")
    .notEmpty()
    .withMessage("Descreption Is Required")
    .isLength({ min: 10 })
    .withMessage("Too Short Descreption"),
  check("quantity")
    .notEmpty()
    .withMessage("Quantity Is Rquired")
    .isNumeric()
    .withMessage("Quantity Mu st Be A Number"),
  check("sold").optional().isNumeric().withMessage("Sold Must Be Number"),
  check("price")
    .notEmpty()
    .withMessage("Price Is Required")
    .isNumeric()
    .withMessage("Price Must Be A Number")
    .isLength({ max: 20 })
    .withMessage("Not Valid Too Long Price "),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("PriceAfterDiscount Must Be A Number")
    .isLength({ max: 20 })
    .withMessage("Too Long Price")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount Must Be Lower Than Price");
      }
      return true;
    }),
  check("imageCover").notEmpty().withMessage("Image Cover Is Required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Images Should Be Array Of Strings"),
  check("category")
    .notEmpty()
    .withMessage("Category Is Required")
    .isMongoId()
    .withMessage("Invalid ID Format")
    .custom((value) =>
      Category.findById(value).then((category) => {
        if (!category) {
          return Promise.reject(new Error("No Category For This ID"));
        }
      })
    ),
  check("subcategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID Format")
    .custom((subcategoriesIDS) =>
      subCategory
        .find({ _id: { $exists: true, $in: subcategoriesIDS } })
        .then((result) => {
          if (!Array.isArray(subcategoriesIDS)) {
            temb = subcategoriesIDS;
            subcategoriesIDS = [];
            subcategoriesIDS.push(temb);
          }
          if (result.length < 1 || result.length !== subcategoriesIDS.length) {
            return Promise.reject(new Error(`Invalid Subcategories Ids`));
          }
        })
    )
    .custom((value, { req }) =>
      subCategory
        .find({ category: req.body.category })
        .then((subcategories) => {
          let ids = [];
          if (!Array.isArray(value)) {
            temb = value;
            value = [];
            value.push(temb);
          }
          subcategories.forEach((subcategory) => {
            ids.push(subcategory._id.toString());
          });

          const checker = (target, arr) => target.every((v) => arr.includes(v));
          if (!checker(value, ids)) {
            return Promise.reject(
              new Error(`Subcategories Not Belong To This Category`)
            );
          }
        })
    ),
  check("brand").optional().isMongoId().withMessage("Invalid ID Format"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage Must Be Number")
    .isLength({ min: 1 })
    .withMessage("Rating Must Be Above Or Equla 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating Must Be Below Or Equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Ratings Quantity Must Be Number"),

  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("InValid Product ID Format"),
  validatorMiddleware,
];
exports.updateProductValidator = [
  check("id").isMongoId().withMessage("InValid Product ID Format"),
  validatorMiddleware,
];
exports.deleteProductsValidator = [
  check("id").isMongoId().withMessage("InValid Product ID Format"),
  validatorMiddleware,
];
