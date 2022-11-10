// const jwt = require("jsonwebtoken");
const multer = require("multer");
const sharp = require("sharp");
const AppError = require("./appError");
// const jwtToken = (id) => {
//   return jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });
// };

const sendResponse = (res, statusCode, jsondata) => {
  return res.status(statusCode).json(jsondata);
};

const generateOtp = () => {
  return Math.floor(Math.random() * 9000 + 1000);
};

const multerStorage = multer.memoryStorage();
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const paths = __dirname.replace('src/utils', 'public/gallery/')
//     cb(null, paths)
//   },
//   filename: function (req, file, cb) {
//     cb(null, generateOtp() + '-' + generateOtp() * 100 + file.originalname)
//   }
// });

const multerFilter = (req, file, cb) => {
  const whitelist = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg"];
  if (whitelist.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(401, "Only jpeg, png, jpg and webp files are allowed"));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

module.exports = {
  sendResponse, generateOtp, upload
};
