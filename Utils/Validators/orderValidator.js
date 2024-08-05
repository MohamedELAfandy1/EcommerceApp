const { check } = require("express-validator");
const validatorMiddleware = require("../../Middleware/validatorMiddleware");
const { getSpecificOrder } = require("../../Controllers/order");
const orderModel = require("../../models/orderModel");

exports.createCashOrderValidator = [
  check("cartId").isMongoId().withMessage("Invalid Cart ID Format"),
  check("shippingAddress.details")
    .notEmpty()
    .withMessage("Details are required")
    .isString()
    .withMessage("Details must be a string"),

  check("shippingAddress.phone")
    .notEmpty()
    .withMessage("Phone is required")
    .isString()
    .withMessage("Phone must be a string")
    .isLength({ min: 3 })
    .withMessage("Phone must be at least 3 characters long"),

  check("shippingAddress.city")
    .notEmpty()
    .withMessage("City is required")
    .isString()
    .withMessage("City must be a string"),

  check("shippingAddress.postalCode")
    .notEmpty()
    .withMessage("Postal Code is required")
    .isString()
    .withMessage("Postal Code must be a string")
    .isLength({ min: 2 })
    .withMessage("Postal Code must be at least 2 characters long"),

  validatorMiddleware,
];

exports.getSpecificOrderValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid ID Format")
    .custom((value, { req }) =>
      orderModel.findById(value).then((order) => {
        if (
          order.user._id.toString() != req.user._id.toString() &&
          req.user.role == "user"
        ) {
          return Promise.reject(
            new Error("You Are Not Aloowed To Acess This Order")
          );
        }
      })
    ),
  validatorMiddleware,
];
exports.updateOrderToPaidOrDeliveredValidator = [
  check("id").isMongoId().withMessage("Invalid ID Format"),
  validatorMiddleware,
];

