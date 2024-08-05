const expressAsyncHandler = require("express-async-handler");
const validatorMiddleware = require("../../Middleware/validatorMiddleware");
const { check } = require("express-validator");
const ProductModel = require("../../models/productModel");

exports.addProductToWishListVaidator = [
  check("productId")
    .isMongoId()
    .withMessage("InValid Product ID Format")
    .custom((value) =>
      ProductModel.findById(value).then((product) => {
        if (!product) {
          return Promise.reject(new Error("No Product For This ID"));
        }
      })
    ),
  validatorMiddleware,
];

exports.removeProductFromWishListVaidator = [
  check("productId")
    .isMongoId()
    .withMessage("InValid Product ID Format"),
  validatorMiddleware,
];
