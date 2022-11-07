const Gallery = require("../model/gallery");
const catchAsyncError = require("../utils/catchAsyncError");
const { upload, generateOtp, sendResponse } = require("../utils/commonFunctions");
const sharp = require("sharp");

exports.uploadImagesForGallery = upload.single("image");

exports.resizePhoto = (req, res, next) => {
    if (!req.file) return next();
    sharp(req.file.buffer)
        .jpeg({ quality: 100 })
        .flatten({ background: '#fff' })
        .toFile(`public/gallery/${generateOtp() + '-' + generateOtp() * 100 + 'unmediagallery' + generateOtp()}.jpeg`);
    next()
};

exports.galleryController = catchAsyncError(async (req, res, next) => {
    console.log(req.file)
    let user = await Gallery.create({
        img: `gallery/${req.file.originalname}`
    })
    sendResponse(res, 200, user);
});