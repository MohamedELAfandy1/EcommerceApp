const subCategoryModel = require("../models/subCategoryModel");
const factory = require("./handlersFactory");

exports.checkCategoryIdInBody = (req, res, next) => {
  if (req.params.categoryId) req.body.category = req.params.categoryId;
  next();
};

exports.createSubCategory = factory.createOne(subCategoryModel)

exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObject = filterObject;
  next();
};

exports.getSubCategories = factory.getAll(subCategoryModel)

exports.getSubCategory = factory.getOne(subCategoryModel)

exports.updateSubCategory = factory.updateOne(subCategoryModel)

exports.deleteSubCategory = factory.deleteOne(subCategoryModel);
