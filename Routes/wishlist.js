const express = require("express");
const { auth, allowedTo } = require("../Controllers/auth");
const {
  addProductToWishList,
  removeProductFromWishList,
  GetLoggedUserWishList,
} = require("../Controllers/wishlist");
const {
  addProductToWishListVaidator,
  removeProductFromWishListVaidator,
} = require("../Utils/Validators/wishlistValidator");
const router = express.Router();

router
  .route("/")
  .get(auth, allowedTo("user"), GetLoggedUserWishList)
  .post(
    auth,
    allowedTo("user"),
    addProductToWishListVaidator,
    addProductToWishList
  );
router
  .route("/:productId")
  .delete(
    auth,
    allowedTo("user"),
    removeProductFromWishListVaidator,
    removeProductFromWishList
  );
module.exports = router;
