const ECategory = require("../model/category");
const catchAsyncError = require("../utils/catchAsyncError");
const { sendResponse } = require("../utils/commonFunctions");
var ObjectId = require('mongoose').Types.ObjectId;

const uploadCategory = catchAsyncError(async (req, res) => {
    const { title, subcategory } = req.body
    if (!title || title === "null" || title.length <= 3 && !newtitle.length >= 30) {
        sendResponse(res, 400, { msg: "Enter valid category title ! ,length must be greater than 3 and lessthan 30 words !", success: false })
    } else {
        if (await ECategory.create({ title, subcategory })) {
            sendResponse(res, 200, { msg: "Category uploaded !", success: true })
        } else {
            sendResponse(res, 500, { msg: "Category not uploaded !", success: false })
        }
    }
})

const getAllCategory = catchAsyncError(async (req, res) => {
    const cats = await ECategory.find({ isDelete: false }).sort({ createdAt: -1 }).lean()
    if (cats.length > 0) {
        sendResponse(res, 200, { success: true, data: cats, msg: 'category availabel !' })
    } else {
        sendResponse(res, 200, { success: true, data: null, msg: 'category not availabel !' })
    }
})

const deleteCategory = catchAsyncError(async (req, res) => {
    const { catid } = req.body
    if (!catid || !ObjectId.isValid(catid)) {
        sendResponse(res, 400, { success: false, msg: 'catid is not valid !' })
    } else {
        const deletecat = await ECategory.updateOne({ _id: catid }, { isDelete: true })
        if (deletecat) {
            sendResponse(res, 200, { success: true, msg: 'category deleted !' })
        } else {
            sendResponse(res, 500, { success: false, msg: 'category not deleted !' })
        }
    }
})

const updateCategory = catchAsyncError(async (req, res) => {
    const { catid, newtitle, subcategory } = req.body
    if (!newtitle || newtitle === "null" || newtitle.length <= 3 && !newtitle.length >= 30) {
        sendResponse(res, 400, {
            msg: "Enter valid new category title , length must be greater than 3 and lessthan 30 words !",
            success: false
        })
    }
    if (!catid || !ObjectId.isValid(catid)) {
        sendResponse(res, 400, { success: false, msg: 'catid is not valid !' })
    } else {
        const updatecatname = await ECategory.findOneAndUpdate({ _id: catid }, { title: newtitle, subcategory }).clone()
        if (updatecatname) {
            sendResponse(res, 200, {
                success: true,
                msg: 'category edited successfully !'
            })
        } else {
            sendResponse(res, 500, { success: false, msg: 'category edited failed !' })
        }
    }

})

const searchCategory = catchAsyncError(async (req, res, next) => {
    const { search } = req.body;
    const results = await ECategory.find({
        title: {
            $regex: search,
            $options: "i",
        },
    }).limit(5).sort({ createdAt: -1 }).lean()
    if (results) {
        if (results.length === 0) {
            sendResponse(res, 200, { success: true, data: null, msg: "data not found !", suggestion: true })
        } else {
            sendResponse(res, 200, { success: true, data: results, msg: "data availabel !", suggestion: false })
        }
    } else {
        sendResponse(res, 500, { success: false, data: null, msg: "Internal server error !", suggestion: false })
    }
})

module.exports = {
    uploadCategory,
    getAllCategory,
    deleteCategory,
    updateCategory,
    searchCategory
}