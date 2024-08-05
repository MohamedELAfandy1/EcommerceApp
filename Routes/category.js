const express = require("express");
const {
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
  createCategoryValidator,
} = require("../Utils/Validators/CategoryValidator.js");

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryimage,
  resizeCategoryImage,
} = require("../Controllers/category");

const { auth, allowedTo } = require("../Controllers/auth.js");

const router = express.Router();

const multer = require("multer");

router
  .route("/")
  .post(
    auth,
    allowedTo("admin", "manager"),
    uploadCategoryimage,
    resizeCategoryImage,
    createCategoryValidator,
    createCategory
  )
  .get(getCategories);

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    auth,
    allowedTo("admin", "manager"),
    uploadCategoryimage,
    resizeCategoryImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(auth, allowedTo("admin"), deleteCategoryValidator, deleteCategory);

const subCategoryRoute = require("./subCategory.js");
router.use("/:categoryId/subcategories", subCategoryRoute);

module.exports = router;
