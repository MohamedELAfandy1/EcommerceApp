const { check } = require("express-validator");
const validatorMiddleware = require("../../Middleware/validatorMiddleware");
const { default: slugify } = require("slugify");
const userModel = require("../../models/userModel");
const bcrypt = require("bcryptjs");

exports.signUpValidator = [
  check("name")
    .notEmpty()
    .withMessage("User Name Required")
    .isLength({ min: 3 })
    .withMessage("Too Short User Name"),

  check("email")
    .notEmpty()
    .withMessage("Email Is Required")
    .isEmail()
    .withMessage("Invalid Email Address")
    .custom((value) =>
      userModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email Already Used"));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("Password Is Required")
    .isLength({ min: 4 })
    .withMessage("Password must Be At Least 5 Charachters"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password Confirm Is Required")
    .custom((passwordConfirm, { req }) => {
      if (passwordConfirm != req.body.password) {
        throw new Error("Password Confirm InCorrect");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email Is Required")
    .isEmail()
    .withMessage("Invalid Email Address"),

  check("password")
    .notEmpty()
    .withMessage("Password Is Required")
    .isLength({ min: 4 })
    .withMessage("Password must Be At Least 6 Charachters"),

  validatorMiddleware,
];
