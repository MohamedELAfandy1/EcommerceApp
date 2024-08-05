const { check } = require("express-validator");
const validatorMiddleware = require("../../Middleware/validatorMiddleware");
const { default: slugify } = require("slugify");
const userModel = require("../../models/userModel");
const bcrypt = require("bcryptjs");
exports.createUserValidator = [
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
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid Phone Number"),

  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID Format"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID Format"),

  check("name").isLength({ min: 3 }).withMessage("Too Short User Name"),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid Email Address")
    .custom((value) =>
      userModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email Already Used"));
        }
      })
    ),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid Phone Number"),

  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID Format"),
  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User ID Format"),
  check("currentPassword")
    .notEmpty()
    .withMessage("You Must Enter Your Current Password"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("You Must Enter Password Confirm"),
  check("password")
    .notEmpty()
    .withMessage("You Must Enter The Password")
    .custom(async (val, { req }) => {
      const user = await userModel.findById(req.params.id);
      if (!user) throw new Error("There Is No User For This ID");
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect Current Password");
      }
      if (req.body.password != req.body.passwordConfirm)
        throw new Error("Incorrect Password Confirm");
    }),
  validatorMiddleware,
];

exports.changeLoggedUserPasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("You Must Enter Your Current Password"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("You Must Enter Password Confirm"),
  check("password")
    .notEmpty()
    .withMessage("You Must Enter The Password")
    .custom(async (val, { req }) => {
      const user = await userModel.findById(req.user._id);
      if (!user) throw new Error("There Is No User For This ID");
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect Current Password");
      }
      if (req.body.password != req.body.passwordConfirm)
        throw new Error("Incorrect Password Confirm");
    }),
  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  check("name").optional().isLength({ min: 3 }).withMessage("Too Short User Name"),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid Email Address")
    .custom((value) =>
      userModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email Already Used"));
        }
      })
    ),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid Phone Number"),

  validatorMiddleware,
];
