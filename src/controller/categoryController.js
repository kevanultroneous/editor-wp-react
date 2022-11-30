const { default: mongoose } = require("mongoose");
let ObjectId = require("mongoose").Types.ObjectId;

const Category = require("../model/categoryModel");

const catchAsyncError = require("../utils/catchAsyncError");
const { sendResponse } = require("../utils/commonFunctions");
const { aggreFilters } = require("../utils/filterJson");
const { errorMessages } = require("../utils/messages");

exports.createCategory = catchAsyncError(async (req, res) => {
  const { title, postType, parentCategory, } = req.body;

  let newCategory;

  if(!title || !postType ) return sendResponse(res, 400, {msg: errorMessages.category.inComplete, status: 400})

  if(!parentCategory){

    newCategory = {
      title,
      postType,
      parentCategory: null
    }

  }else {

    if(!mongoose.isValidObjectId(parentCategory)) return sendResponse(res, 400, {msg: errorMessages.category.inValidParentID, status: 400})

    let checkExistingCategory = await Category.exists({_id: parentCategory});
    console.log(checkExistingCategory);
    if(!checkExistingCategory) return sendResponse(res, 400, {msg: errorMessages.category.inValidParentID, status: 400})

    newCategory = {
      title,
      postType,
      parentCategory
    }
  }

  newCategory = await Category.create(newCategory);
  return sendResponse(res, 200, {msg: errorMessages.category.created, data: newCategory})
  
});

exports.getCategoryWithSubcategory = catchAsyncError(async (req, res) => {
  const allCategory = await Category.aggregate([
    {
      $match: aggreFilters.category.filters,
    },
    {
      $project: aggreFilters.category.project,
    },
    {
      $lookup: {
        ...aggreFilters.category.subCategories,
        pipeline: [
          { $project: aggreFilters.category.project },
          { $sort: { createdAt: -1 } },
        ],
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  return sendResponse(res, 200, {
    data: allCategory,
    status: 200,
  });
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
  const { catid, newtitle, postType } = req.body;
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
  if (!(postType === "press" || postType === "blog")) {
    sendResponse(res, 400, { msg: "type is not valid !", success: false });
  }
  if (!catid || !ObjectId.isValid(catid)) {
    sendResponse(res, 400, { success: false, msg: "catid is not valid !" });
  } else {
    const updatecatname = await Category.findOneAndUpdate(
      { _id: catid },
      { title: newtitle, postType: type }
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

  const category = await Category.aggregate([
    {
      $match: {
        ...aggreFilters.category.filters,
        title: new RegExp(search, "i"),
      },
    },
    { $project: aggreFilters.category.project },
    { $sort: { createdAt: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        ...aggreFilters.category.subCategories,
        pipeline: [
          { $project: aggreFilters.category.project },
          { $sort: { createdAt: -1 } },
        ],
      },
    },
  ]);

  sendResponse(res, 200, {
    data: category,
    status: 200
  })
});
