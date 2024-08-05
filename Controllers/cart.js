const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const apiError = require("../Utils/apiError");
const couponModel = require("../models/couponModel");

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((product) => {
    totalPrice += product.price * product.quantity;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

exports.addProductToCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id });
  const product = await Product.findById(req.body.productId);

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: req.body.productId,
          quantity: req.body.quantity || 1,
          price: product.price,
        },
      ],
    });
  } else {
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() == req.body.productId
    );

    if (productIndex != -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity++;
      cart.cartItems[productIndex] = cartItem;
    } else {
      cart.cartItems.push({
        product: req.body.productId,
        price: product.price,
      });
    }
  }

  calcTotalCartPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "Success",
    message: "Product Added To Chart Successfully",
    numberOfItems: cart.cartItems.length,
    data: cart,
  });
});

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new apiError("There Is No Cart For This User", 404));
  }
  res.status(200).json({
    status: "Success",
    message: "Get Cart Sucessfully",
    numberOfItems: cart.cartItems.length,
    data: cart,
  });
});

exports.deleteProductFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.id } } },
    { new: true }
  );
  calcTotalCartPrice(cart);
  cart.save();

  res.status(200).json({
    status: "Success",
    message: "Item Removed From Cart Sucessfully",
    numberOfItems: cart.cartItems.length,
    data: cart,
  });
});

exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new apiError("There Is No Cart For This User", 404));
  }
  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() == req.params.id
  );

  if (itemIndex != -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = req.body.quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(new apiError("There Is No Item For This ID", 404));
  }
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "Success",
    message: "Update Cart Sucessfully",
    numberOfItems: cart.cartItems.length,
    data: cart,
  });
});

exports.applyCouponOnCart = asyncHandler(async (req, res, next) => {
  const coupon = await couponModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new apiError("Coupon Is Invalid Or Expired", 404));
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new apiError("Cart Not Found", 404));
  }

  cart.totalPriceAfterDiscount = (
    cart.totalCartPrice -
    (cart.totalCartPrice * coupon.discount) / 100
  ).toFixed(2);

  await cart.save();
  res.status(200).json({
    status: "Success",
    message: "Copon Applied Successfully On Cart",
    numberOfItems: cart.cartItems.length,
    data: cart,
  });
});
