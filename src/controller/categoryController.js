const { default: mongoose } = require("mongoose");
let ObjectId = require("mongoose").Types.ObjectId;

const Category = require("../model/categoryModel");

const catchAsyncError = require("../utils/catchAsyncError");
const { sendResponse } = require("../utils/commonFunctions");
const { aggreFilters } = require("../utils/filterJson");
const { errorMessages } = require("../utils/messages");

exports.createCategory = catchAsyncError(async (req, res) => {
  const { title, postType, parentCategory } = req.body;

  let newCategory;

  if (!title || !postType)
    return sendResponse(res, 400, {
      msg: errorMessages.category.inComplete,
      status: 400,
    });

  const alreadyCategory = await Category.exists({ title: title });
  if (alreadyCategory)
    return sendResponse(res, 400, {
      msg: errorMessages.category.categoryExists,
      status: 400,
    });

  if (!parentCategory) {
    newCategory = {
      title,
      postType,
      parentCategory: null,
    };
  } else {
    if (!mongoose.isValidObjectId(parentCategory))
      return sendResponse(res, 400, {
        msg: errorMessages.category.inValidParentID,
        status: 400,
      });

    let checkExistingCategory = await Category.exists({ _id: parentCategory });
    console.log(checkExistingCategory);
    if (!checkExistingCategory)
      return sendResponse(res, 400, {
        msg: errorMessages.category.inValidParentID,
        status: 400,
      });

    newCategory = {
      title,
      postType,
      parentCategory,
    };
  }

  newCategory = await Category.create(newCategory);
  return sendResponse(res, 200, {
    msg: errorMessages.category.created,
    data: newCategory,
  });
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
  const { parentId } = req.body;
  let category;

  if (!mongoose.isValidObjectId(parentId))
    return sendResponse(res, 400, {
      msg: errorMessages.category.inValidParentID,
      status: 400,
    });

  category = await Category.aggregate([
    {
      $match: {
        ...aggreFilters.category.filters,
        _id: mongoose.Types.ObjectId(parentId),
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
    status: 200,
  });
});

exports.deleteCategory = catchAsyncError(async (req, res) => {
  const { categoryId } = req.body;

  let category;
  let update = { isActive: false };

  if (!mongoose.isValidObjectId(categoryId))
    return sendResponse(res, 400, {
      msg: errorMessages.category.inValidParentID,
      status: 400,
    });

  category = await Category.findByIdAndUpdate(categoryId, update, {
    new: true,
  });
  return sendResponse(res, 200, {
    msg: errorMessages.category.deleted,
    data: category,
    status: 200,
  });
});

exports.updateCategory = catchAsyncError(async (req, res) => {
  const { categoryId, title, postType, isActive } = req.body;

  let categoryUpdated;

  if (!mongoose.isValidObjectId(categoryId))
    return sendResponse(res, 400, {
      msg: errorMessages.category.inValidCategoryID,
      status: 400,
    });

  const checkExistingCategory = await Category.exists({ _id: categoryId });
  if (!checkExistingCategory)
    return sendResponse(res, 400, {
      msg: errorMessages.category.doesntExist,
      status: 400,
    });

  categoryUpdated = {
    title,
    postType,
    isActive,
  };

  categoryUpdated = await Category.findOneAndUpdate(
    { _id: categoryId },
    categoryUpdated,
    { new: true }
  );

  return sendResponse(res, 200, {
    msg: errorMessages.category.updated,
    data: categoryUpdated,
    staus: 200,
  });
});

exports.searchCategory = catchAsyncError(async (req, res, next) => {
  // const { search } = req.body;

  // const category = await Category.aggregate([
  //   {
  //     $match: {
  //       ...aggreFilters.category.filters,
  //       title: new RegExp(search, "i"),
  //     },
  //   },
  //   { $project: aggreFilters.category.project },
  //   { $sort: { createdAt: -1 } },
  //   { $limit: 10 },
  //   {
  //     $lookup: {
  //       ...aggreFilters.category.subCategories,
  //       pipeline: [
  //         { $project: aggreFilters.category.project },
  //         { $sort: { createdAt: -1 } },
  //       ],
  //     },
  //   },
  // ]
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
  let subcategory;
  if (category.length > 0) {
    for (let k = 0; k < category.length; k++) {
      subcategory = await Category.find({
        parentCategory: category[k]._id,
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .lean();
      category[k].childs = subcategory;
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

// sendResponse(res, 200, {
//   data: category,
//   status: 200
// })
// }
// );
