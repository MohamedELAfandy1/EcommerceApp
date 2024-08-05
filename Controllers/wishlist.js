const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");

exports.addProductToWishList = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    message: "Product Added SuceesFully To Your WishList",
    data: user.wishlist,
  });
});

exports.removeProductFromWishList = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    message: "Product Removed SuceesFully From Your WishList",
    data: user.wishlist,
  });
});

exports.GetLoggedUserWishList = asyncHandler(async (req, res, next) => {
  const wishlist = await userModel.findById(req.user._id).select("wishlist -_id").populate('wishlist');
  res.status(200).json({
    data: wishlist,
  });
});
