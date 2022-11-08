const { default: mongoose } = require("mongoose");
const ECategory = require("../model/category");
const catchAsyncError = require("../utils/catchAsyncError");
const { sendResponse } = require("../utils/commonFunctions");
var ObjectId = require('mongoose').Types.ObjectId;

const uploadCategory = catchAsyncError(async (req, res) => {
    const { title, type } = req.body
    if (!title || title === "null" || title.length < 3) {
        sendResponse(res, 400, { msg: "Enter valid category title ! ,length must be greater than 3 and lessthan 30 words !", success: false })
    } else if (!(type === 'press' || type === 'blog')) {
        sendResponse(res, 400, { msg: "type is not valid !", success: false })
    } else {
        if (await ECategory.create({ title, type })) {
            sendResponse(res, 200, { msg: "Category uploaded !", success: true })
        } else {
            sendResponse(res, 500, { msg: "Category not uploaded !", success: false })
        }
    }
})

const uploadSubcategory = catchAsyncError(async (req, res) => {
    const { parentid, subcategory } = req.body
    if (!ObjectId.isValid(parentid)) {
        sendResponse(res, 400, { status: false, msg: "parent id is not valid !" })
    } else if (subcategory.length <= 0) {
        sendResponse(res, 400, { status: false, msg: "subcategory is required !" })
    } else {
        const newId = mongoose.Types.ObjectId();
        let newarry = []
        for (let x = 0; x < subcategory.length; x++) {
            newarry.push({ _id: newId, subcategory: subcategory[x] })
        }
        if (await ECategory.findByIdAndUpdate(parentid, { parentCategory: parentid, subCategory: newarry })) {
            sendResponse(res, 200, { msg: "subcategory uploaded !", success: true })
        } else {
            sendResponse(res, 500, { msg: "subcategory uploading failed !", success: false })
        }
    }
})

const getAllCategory = catchAsyncError(async (req, res) => {
    const cats = await ECategory.find({ isActive: true }).sort({ createdAt: -1 }).lean()
    if (cats.length > 0) {
        sendResponse(res, 200, { success: true, data: cats, msg: 'category availabel !' })
    } else {
        sendResponse(res, 200, { success: true, data: null, msg: 'category not availabel !' })
    }
})

const getSubcategories = catchAsyncError(async (req, res) => {
    const id = req.params['id']
    try {
        const singlecategory = await ECategory.findOne({ parentCategory: id }).select('subCategory').lean()
        if (!singlecategory) {
            sendResponse(res, 200, { success: true, data: null })
        } else {
            sendResponse(res, 200, { success: true, data: singlecategory })
        }
    } catch (e) {
        sendResponse(res, 500, { success: false, data: null })
    }
})

const deleteCategory = catchAsyncError(async (req, res) => {
    const { catid } = req.body
    if (!catid || !ObjectId.isValid(catid)) {
        sendResponse(res, 400, { success: false, msg: 'catid is not valid !' })
    } else {
        const deletecat = await ECategory.updateOne({ _id: catid }, { isActive: false })
        if (deletecat) {
            sendResponse(res, 200, { success: true, msg: 'category deleted !' })
        } else {
            sendResponse(res, 500, { success: false, msg: 'category not deleted !' })
        }
    }
})

const updateCategory = catchAsyncError(async (req, res) => {
    const { catid, newtitle, type } = req.body
    if (!newtitle || newtitle === "null" || newtitle.length <= 3 && !newtitle.length >= 30) {
        sendResponse(res, 400, {
            msg: "Enter valid new category title , length must be greater than 3 and lessthan 30 words !",
            success: false
        })
    }
    if (!(type === 'press' || type === 'blog')) {
        sendResponse(res, 400, { msg: "type is not valid !", success: false })
    }
    if (!catid || !ObjectId.isValid(catid)) {
        sendResponse(res, 400, { success: false, msg: 'catid is not valid !' })
    } else {
        const updatecatname = await ECategory.findOneAndUpdate({ _id: catid }, { title: newtitle, type: type }).clone()
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
        isActive: true
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
    searchCategory,
    getSubcategories,
    uploadSubcategory
}