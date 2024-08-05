const express = require("express");
const {
  addProductToCart,
  getLoggedUserCart,
  deleteProductFromCart,
  clearCart,
  updateCartItemQuantity,
  applyCouponOnCart,
} = require("../Controllers/cart");
const { auth, allowedTo } = require("../Controllers/auth");
const {
  addProductToCartValidator,
  deleteProductFromCartValidator,
  updateCartItemQuantityValidator,
  applyCouponValidator,
} = require("../Utils/Validators/cartValidator");

const router = express.Router();

router
  .route("/")
  .post(auth, allowedTo("user"), addProductToCartValidator, addProductToCart)
  .get(auth, allowedTo("user"), getLoggedUserCart)
  .delete(auth, allowedTo("user"), clearCart);

router.put(
  "/applyCoupon",
  auth,
  allowedTo("user"),
  applyCouponValidator,
  applyCouponOnCart
);

router
  .route("/:id")
  .delete(
    auth,
    allowedTo("user"),
    deleteProductFromCartValidator,
    deleteProductFromCart
  )
  .put(
    auth,
    allowedTo("user"),
    updateCartItemQuantityValidator,
    updateCartItemQuantity
  );

module.exports = router;
