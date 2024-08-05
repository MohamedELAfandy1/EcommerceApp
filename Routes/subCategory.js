const express = require("express");
const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  checkCategoryIdInBody,
  createFilterObject,
} = require("../Controllers/subCategory");

const {
  createsubCategoryValidator,
  getsubCategoryValidator,
  updatesubCategoryValidator,
  deletesubCategoryValidator,
} = require("../Utils/Validators/subCategoryValidator");

const { auth, allowedTo } = require("../Controllers/auth.js");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    auth,
    allowedTo("manager", "admin"),
    checkCategoryIdInBody,
    createsubCategoryValidator,
    createSubCategory
  )
  .get(createFilterObject, getSubCategories);

router
  .route("/:id")
  .get(getsubCategoryValidator, getSubCategory)
  .put(
    auth,
    allowedTo("manager", "admin"),
    updatesubCategoryValidator,
    updateSubCategory
  )
  .delete(
    auth,
    allowedTo("admin"),
    deletesubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
