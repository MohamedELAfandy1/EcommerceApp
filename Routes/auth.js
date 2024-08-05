const express = require("express");
const {
  signUp,
  login,
  forgetPassword,
  verifyPasswordResetCode,
  resetPassword,
} = require("../Controllers/auth");
const {
  signUpValidator,
  loginValidator,
} = require("../Utils/Validators/authValidator");

const router = express.Router();

router.route("/signup").post(signUpValidator, signUp);

router.route("/login").post(loginValidator, login);

router.route("/forgetPassword").post(forgetPassword);
router.route("/verifyResetCode").post(verifyPasswordResetCode);
router.route("/resetPassword").put (resetPassword);

module.exports = router;
