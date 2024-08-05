const { check } = require("express-validator");
const validatorMiddleware = require("../../Middleware/validatorMiddleware");
const couponModel = require("../../models/couponModel");

exports.getCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon ID Format"),
  validatorMiddleware,
];

exports.createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("User Name Required")
    .custom((value) =>
      couponModel.findOne({ name: value }).then((coupon) => {
        if (coupon) {
          return Promise.reject(new Error("Coupon Already Used"));
        }
      })
    ),
  check("expire")
    .notEmpty()
    .withMessage("User Name Required"),
  check("discount")
    .notEmpty()
    .withMessage("User Name Required")
    .isNumeric()
    .withMessage("Not A Valid Discount"),
  validatorMiddleware,
];

exports.updateCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon ID Format"),
  validatorMiddleware,
];

exports.deleteCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon ID Format"),
  validatorMiddleware,
];
