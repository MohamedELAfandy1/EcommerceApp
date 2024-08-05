const { check } = require("express-validator");
const validatorMiddleware = require("../../Middleware/validatorMiddleware");
const ProductModel = require("../../models/productModel");
const cartModel = require("../../models/cartModel");
const couponModel = require("../../models/couponModel");

exports.addProductToCartValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product ID Required")
    .custom(async (value, { req }) => {
      return await ProductModel.findOne({
        _id: value,
        quantity: { $gt: 0 },
      }).then((product) => {
        if (!product) {
          return Promise.reject(new Error("No Product For This ID"));
        }
      });
    }),

  validatorMiddleware,
];

exports.updateCartItemQuantityValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID Format"),
  check("quantity")
    .notEmpty()
    .withMessage("Quantity Is Required")
    .isNumeric()
    .withMessage("Must Be A Number")
    .custom(async (value, { req }) => {
      return await cartModel
        .findOne({
          user: req.user._id,
        })
        .then((cart) => {
          const itemIndex = cart.cartItems.findIndex(
            (item) => item._id.toString() == req.params.id
          );
          let product = cart.cartItems[itemIndex].product;
          if (!product) {
            return Promise.reject(new Error("No Product For This ID"));
          }
          if (product.quantity < value) {
            return Promise.reject(
              new Error(`There Is Only ${product.quantity} Items In Stock`)
            );
          }
        });
    }),
  validatorMiddleware,
];

exports.deleteProductFromCartValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID Format"),
  validatorMiddleware,
];

exports.applyCouponValidator = [
  check("coupon")
    .notEmpty()
    .withMessage("Coupon Is Required")
    .custom((value) =>
      couponModel
        .findOne({ name: value, expire: { $gt: Date.now() } })
        .then((coupon) => {
          if (!coupon) {
            return Promise.reject(new Error("Coupon Is Invalid Or Expired"));
          }
        })
    ),
  validatorMiddleware,
];
