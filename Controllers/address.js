const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");

exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    message: "Address Added SuceesFully",
    data: user.addresses,
  });
});

exports.removeAddress = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.id } },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    message: "Address Removed",
    data: user.addresses,
  });
});

exports.GetLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const address = await userModel
    .findById(req.user._id)
    .select("addresses -_id");
  res.status(200).json({
    data: address,
  });
});
