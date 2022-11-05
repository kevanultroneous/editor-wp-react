const EPost = require('../model/post');
const catchAsyncError = require('../utils/catchAsyncError');
const { sendResponse } = require('../utils/commonFunctions');
var ObjectId = require('mongoose').Types.ObjectId;

const uploadPost = catchAsyncError(async (req, res) => {

    const { title,
        fimg,
        category,
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
        fimg,
        category,
        date,
        author,
        content,
        smeta,
        stitle,
        sdesc,
        url,
        status,
        parent
    })) {
        sendResponse(res, 200, {
            msg: status == 1 ? "Post uploaded !" : "Post drafted !",
            success: true
        })
    } else {
        sendResponse(res, 500, { msg: "Post not uploaded !", success: false })
    }
})

const getAllpost = catchAsyncError(async (req, res) => {
    const num = req.params['num']
    const allpost = await EPost.find({ parent: num }).sort({ createdAt: -1 }).lean()
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
        if (await EPost.deleteOne({ _id: postid })) {
            sendResponse(res, 200, { msg: "Post deleted successfully !", success: true })
        } else {
            sendResponse(res, 500, { msg: "Post not deleted !", success: false })
        }
    }
})

const getSinglePost = catchAsyncError(async (req, res) => {
    const postid = req.params['postid']
    try {
        const singlepost = await EPost.findOne({ _id: postid }).lean()
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
    getSinglePost
}