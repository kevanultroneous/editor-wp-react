const Gallery = require("../model/galleryModel");
const catchAsyncError = require("../utils/catchAsyncError");
const { upload, generateOtp, sendResponse } = require("../utils/commonFunctions");
const sharp = require("sharp");

exports.uploadImagesForGallery = upload.array("image", 30);

exports.resizePhoto = (req, res, next) => {
    let newdata = []
    req.files.forEach((f) => {
        let newfile = `public/gallery/${new Date() + generateOtp() + f.originalname + 'unmediagallery'}.jpeg`
        sharp(f.buffer)
            .jpeg({ quality: 100 })
            .flatten({ background: '#fff' })
            .toFile(newfile);
        newdata.push({ img: newfile.replace('public/', '') })
    })
    req.filedata = newdata
    next()
};

exports.createGalleryPost = catchAsyncError(async (req, res, next) => {
    let user = await Gallery.create(req.filedata)
    if (user) {
        sendResponse(res, 200, { success: true, msg: 'Image uploaded successfully', data: user });
    } else {
        sendResponse(res, 500, { success: false, msg: 'Image uploading failed !' });
    }
});

exports.fetchAllgalleryImage = catchAsyncError(async (req, res, next) => {
    const fetching = await Gallery.find({}).sort({ createdAt: -1 }).lean()
    if (fetching) {
        if (fetching.length > 0) {
            sendResponse(res, 200, { success: true, data: fetching, msg: 'Data available !' })
        } else {
            sendResponse(res, 200, { success: true, data: null, msg: 'Data not found !' })
        }
    } else {
        sendResponse(res, 500, { success: false, data: null, msg: 'Internal server error !' })
    }
})