const { default: mongoose } = require("mongoose");
const ECategory = require("../model/category");
const catchAsyncError = require("../utils/catchAsyncError");
const { sendResponse } = require("../utils/commonFunctions");
let ObjectId = require("mongoose").Types.ObjectId;

exports.uploadCategory = catchAsyncError(async (req, res) => {
  const { title, type, data, parentid, upddata, multiple } = req.body;
  if (multiple) {
    if (await Category.create(data)) {
      sendResponse(res, 200, { msg: "Category uploaded !", success: true });
    } else {
      sendResponse(res, 500, {
        msg: "Category not uploaded !",
        success: false,
      });
    }
  } else {
    if (!title || title === "null" || title.length < 3) {
      sendResponse(res, 400, {
        msg: "Enter valid category title ! ,length must be greater than 3 and lessthan 30 words !",
        success: false,
      });
    } else if (!(type === "press" || type === "blog")) {
      sendResponse(res, 400, { msg: "type is not valid !", success: false });
    } else {
      if (await Category.create({ title, type })) {
        sendResponse(res, 200, { msg: "Category uploaded !", success: true });
      } else {
        sendResponse(res, 500, {
          msg: "Category not uploaded !",
          success: false,
        });
      }
    }
  }
});

exports.getCategoryWithSubcategory = catchAsyncError(async (req, res) => {
  const { type } = req.params;
  const category = await Category.find({ isActive: true, parentCategory: null })
    .sort({ createdAt: -1 })
    .lean();
  let subCategory;
  if (category.length > 0) {
    for (let k = 0; k < category.length; k++) {
      subCategory = await Category.find({
        parentCategory: category[k]._id,
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .lean();
      category[k].childs = subCategory;
    }
    sendResponse(res, 200, {
      msg: "Data available !",
      success: true,
      data: category,
    });
  } else {
    sendResponse(res, 200, {
      msg: "Data not availabel !",
      success: false,
      data: null,
    });
  }
});

exports.getSubcategories = catchAsyncError(async (req, res) => {
  const id = req.params["id"];
  try {
    const singlecategory = await Category.find({ parentCategory: id })
      .select("subCategory")
      .lean();
    if (!singlecategory) {
      sendResponse(res, 200, { success: true, data: null });
    } else {
      sendResponse(res, 200, { success: true, data: singlecategory });
    }
  } catch (e) {
    sendResponse(res, 500, { success: false, data: null });
  }
});

exports.deleteCategory = catchAsyncError(async (req, res) => {
  const { catid } = req.body;
  if (!catid || !ObjectId.isValid(catid)) {
    sendResponse(res, 400, { success: false, msg: "catid is not valid !" });
  } else {
    const deletecat = await Category.updateOne(
      { _id: catid },
      { isActive: false }
    );
    if (deletecat) {
      sendResponse(res, 200, { success: true, msg: "category deleted !" });
    } else {
      sendResponse(res, 500, { success: false, msg: "category not deleted !" });
    }
  }
});

exports.updateCategory = catchAsyncError(async (req, res) => {
  const { catid, newtitle, type } = req.body;
  if (
    !newtitle ||
    newtitle === "null" ||
    (newtitle.length <= 3 && !newtitle.length >= 30)
  ) {
    sendResponse(res, 400, {
      msg: "Enter valid new category title , length must be greater than 3 and lessthan 30 words !",
      success: false,
    });
  }
  if (!(type === "press" || type === "blog")) {
    sendResponse(res, 400, { msg: "type is not valid !", success: false });
  }
  if (!catid || !ObjectId.isValid(catid)) {
    sendResponse(res, 400, { success: false, msg: "catid is not valid !" });
  } else {
    const updatecatname = await Category.findOneAndUpdate(
      { _id: catid },
      { title: newtitle, type: type }
    ).clone();
    if (updatecatname) {
      sendResponse(res, 200, {
        success: true,
        msg: "category edited successfully !",
      });
    } else {
      sendResponse(res, 500, {
        success: false,
        msg: "category edited failed !",
      });
    }
  }
});

exports.searchCategory = catchAsyncError(async (req, res, next) => {
  const { search } = req.body;
  const category = await Category.find({
    isActive: true,
    parentCategory: null,
    title: {
      $regex: search,
      $options: "i",
    },
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();
  let subCategory;
  if (category.length > 0) {
    for (let k = 0; k < category.length; k++) {
      subCategory = await Category.find({
        parentCategory: category[k]._id,
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .lean();
      category[k].childs = subCategory;
    }
    sendResponse(res, 200, {
      msg: "Data available !",
      success: true,
      data: category,
    });
  } else {
    sendResponse(res, 200, {
      msg: "Data not availabel !",
      success: false,
      data: null,
    });
  }
});
