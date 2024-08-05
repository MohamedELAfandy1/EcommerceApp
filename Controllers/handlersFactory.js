const asyncHandler = require("express-async-handler");
const apiError = require("../Utils/apiError");
const apiFeatures = require("../Utils/apiFeatures");
const { default: slugify } = require("slugify");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    const document = await Model.findById(id);
    if (!document) {
      return next(new apiError("No Document For This ID", 404));
    } else {
      await document.deleteOne();
    }

    res.status(204).send();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    } else if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    let document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) return next(new apiError("No Document For This Id", 404));

    await document.save();
    res.status(200).json({ data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    } else if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getOne = (Model, populationOption) =>
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    let query = Model.findById(id);
    if (populationOption) {
      query.populate(populationOption);
    }
    let document = await query;
    if (!document) return next(new apiError("No document For This Id", 404));
    res.status(200).json({ data: document });
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    const documentsCount = await Model.countDocuments();
    const ApiFeatures = new apiFeatures(Model.find(), req.query)
      .paginate(documentsCount)
      .filter()
      .search()
      .limitFields()
      .sort();

    const { mongooseQuery, paginationResult } = ApiFeatures;

    if (req.filterObject) {
      mongooseQuery.find(req.filterObject);
    }

    const documents = await mongooseQuery;
    res
      .status(201)
      .json({ length: documents.length, paginationResult, data: documents });
  });
