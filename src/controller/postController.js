const sharp = require('sharp');
const EPost = require('../model/post');
const catchAsyncError = require('../utils/catchAsyncError');
const { sendResponse, upload } = require('../utils/commonFunctions');
var ObjectId = require('mongoose').Types.ObjectId;

const uploadImagesForFeatured = upload.single("image");

const resizePhotoFimg = (req, res, next) => {
    let newfile = `public/other/featured/${new Date() + req.file.originalname}.jpeg`
    sharp(req.file.buffer)
        .jpeg({ quality: 100 })
        .toFile(newfile);
    req.sendfile = newfile.replace('public/', '')
    next();
};

const uploadPost = catchAsyncError(async (req, res) => {
    const { title,
        category,
        subcategory,
        date,
        author,
        content,
        smeta,
        stitle,
        sdesc,
        url,
        status,
        parent } = req.body

    if (await EPost.create({
        title,
        fimg: req.sendfile,
        category,
        subcategory,
        date,
        author,
        content,
        smeta,
        stitle,
        sdesc,
        url,
        status,
        posttype: parent
    })) {
        sendResponse(res, 200, {
            msg: status == 1 ? "Post uploaded !" : "Post drafted !",
            success: true
        })
    } else {
        sendResponse(res, 500, { msg: "Post not uploaded !", success: false })
    }
})

const updatepost = catchAsyncError(async (req, res) => {
    const {
        parentid,
        title,
        category,
        subcategory,
        date,
        author,
        content,
        smeta,
        stitle,
        sdesc,
        url,
        status,
        parent } = req.body


    if (!ObjectId.isValid(parentid)) {
        sendResponse(res, 500, { msg: "parent id is not valid !", success: false })
    }
    if (await EPost.findByIdAndUpdate(
        parentid,
        req.sendfile ?
            {
                title,
                fimg: req.sendfile,
                category,
                subcategory,
                date,
                author,
                content,
                smeta,
                stitle,
                sdesc,
                url,
                status,
                posttype: parent
            }
            : {
                title,
                category,
                subcategory,
                date,
                author,
                content,
                smeta,
                stitle,
                sdesc,
                url,
                status,
                posttype: parent
            })) {
        sendResponse(res, 200, {
            msg: "Post updated !",
            success: true
        })
    } else {
        sendResponse(res, 500, { msg: "Post not updated !", success: false })
    }
})

const getAllpost = catchAsyncError(async (req, res) => {
    const num = req.params['num']
    const allpost = await EPost.find({ posttype: num, isActive: true }).sort({ createdAt: -1 }).lean()
    if (allpost) {
        if (allpost.length <= 0) {
            sendResponse(res, 200, { success: true, data: null })
        } else {
            sendResponse(res, 200, { success: true, data: allpost })
        }
    } else {
        sendResponse(res, 500, { success: false, data: "Internal server error !" })
    }
})

const deletePost = catchAsyncError(async (req, res) => {
    const { postid } = req.body
    if (!ObjectId.isValid(postid)) {
        sendResponse(res, 500, { msg: "id is not valid !", success: false })
    } else {
        if (await EPost.findByIdAndUpdate(postid, { isActive: false })) {
            sendResponse(res, 200, { msg: "Post deleted successfully !", success: true })
        } else {
            sendResponse(res, 500, { msg: "Post not deleted !", success: false })
        }
    }
})

const getSinglePost = catchAsyncError(async (req, res) => {
    const postid = req.params['postid']
    try {
        const singlepost = await EPost.findOne({ _id: postid, isActive: true }).lean()
        if (!singlepost) {
            sendResponse(res, 200, { success: true, data: null })
        } else {
            sendResponse(res, 200, { success: true, data: singlepost })
        }
    } catch (e) {
        sendResponse(res, 500, { success: false, data: null })
    }
})

module.exports = {
    uploadPost,
    getAllpost,
    deletePost,
    getSinglePost,
    uploadImagesForFeatured,
    resizePhotoFimg,
    updatepost
}