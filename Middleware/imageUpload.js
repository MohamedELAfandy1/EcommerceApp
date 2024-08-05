const multer = require("multer");
const apiError = require("../Utils/apiError");
const { v4: uuidv4 } = require("uuid");

const multerOptions = () => {

  const multerDiskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/category");
    },
    filename: function (req, file, cb) {
      const ext = file.mimetype.split("/")[1];
      const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
      cb(null, filename);
    },
  });

  multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new apiError("Only Image Allowed", 400), false);
    }
  };

  const multerMemoryStorage = multer.memoryStorage();

  const upload = multer({
    storage: multerMemoryStorage,
    fileFilter: multerFilter,
  });

  return upload;
};

exports.uploadSingleImage = (fieldName) => {
  return multerOptions().single(fieldName);
};

exports.uploadMixOfImages = (arrayOfFields) => {
  return multerOptions().fields(arrayOfFields);
};
