const apiError = require("../Utils/apiError");

const handleJWTInvalidSignature = () =>
  new apiError("Invalid Token, Please Login Again", 401);

const handleJWTExpired = () =>
  new apiError("Expired Token, Please Login Again", 401);

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (err instanceof SyntaxError && err.status === 413) {
    return res.status(413).send({ message: "Payload too large" });
  }
  if (process.env.NODE_ENV === "development") {
    sendErrorForDevMode(err, res);
  } else {
    if (err.name === "JsonWebTokenError") {
      err = handleJWTInvalidSignature();
    }
    if (err.name === "TokenExpiredError") {
      err = handleJWTExpired();
    }

    sendErrorForOtherMode(err, res);
  }
};

const sendErrorForDevMode = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForOtherMode = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err.message,
  });
};
module.exports = globalError;
