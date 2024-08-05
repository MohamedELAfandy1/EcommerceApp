const express = require("express");
const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandimage,
  resizeBrandImage,
} = require("../Controllers/brand");
const {
  createBrandValidator,
  updateBrandValidator,
  getBrandValidator,
  deleteBrandValidator,
} = require("../Utils/Validators/brandsValidator");
const { auth, allowedTo } = require("../Controllers/auth");

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(
    auth,
    allowedTo("admin", "manager"),
    uploadBrandimage,
    resizeBrandImage,
    createBrandValidator,
    createBrand
  );

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    auth,
    allowedTo("admin", "manager"),
    uploadBrandimage,
    resizeBrandImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(auth, allowedTo("admin"), deleteBrandValidator, deleteBrand);

module.exports = router;
