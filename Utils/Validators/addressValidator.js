const expressAsyncHandler = require("express-async-handler");
const validatorMiddleware = require("../../Middleware/validatorMiddleware");
const { check } = require("express-validator");

exports.removeAddressValidator = [
  check("id").isMongoId().withMessage("InValid Address ID Format"),
  validatorMiddleware,
];
