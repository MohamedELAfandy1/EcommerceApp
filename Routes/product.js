const express = require("express");
const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductsValidator,
} = require("../Utils/Validators/productValidator");
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../Controllers/product");
const { auth, allowedTo } = require("../Controllers/auth.js");

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(
    auth,
    allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    auth,
    allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(auth, allowedTo("admin"), deleteProductsValidator, deleteProduct);

const reviewRoute = require("./review.js");
router.use("/:productId/reviews", reviewRoute);


module.exports = router;
