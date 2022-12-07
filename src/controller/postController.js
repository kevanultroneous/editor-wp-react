const sharp = require("sharp");
let ObjectId = require("mongoose").Types.ObjectId;
const { default: mongoose } = require("mongoose");

const { sendResponse, upload } = require("../utils/commonFunctions");
const catchAsyncError = require("../utils/catchAsyncError");
const { errorMessages } = require("../utils/messages");
const { aggreFilters } = require("../utils/filterJson");

const Post = require("../model/postModel");
const Category = require("../model/categoryModel");

// add in common functions => check kyc
exports.uploadImagesForFeatured = upload.single("image");

exports.resizePhotoFimg = (req, res, next) => {
  if (req.file) {
    let newfile = `public/other/featured/${
      new Date() + req.file.originalname
    }.jpeg`;

    sharp(req.file.buffer).jpeg({ quality: 100 }).toFile(newfile);
    req.sendfile = newfile.replace("public/", "");
    next();
  } else {
    next();
  }
};

exports.addPost = catchAsyncError(async (req, res) => {
  const {
    title,
    summary,
    category,
    subCategory,
    content,
    author,
    companyName,
    seoTitle,
    seoDescription,
    seoKeywords,
    backlinkUrl,
    slugUrl,
    draftStatus,
    postType,
    releaseDate,
    paidStatus,
    homePageStatus,
    isApproved,
  } = req.body;

  let newPost = {
    title: title,
    featuredImage: req.sendfile,
    summary,
    category,
    subCategory,
    content,
    author,
    companyName,
    seoTitle,
    seoDescription,
    seoKeywords,
    backlinkUrl,
    slugUrl,
    draftStatus,
    postType,
    releaseDate,
    paidStatus,
    homePageStatus,
    isApproved,
  };

  let post = await Post.create(newPost);

  if (post) {
    return sendResponse(res, 200, {
      msg:
        draftStatus !== "draft"
          ? errorMessages.post.Published
          : errorMessages.post.Draft,
      success: true,
      data: subCategory,
    });
  }

  return sendResponse(res, 500, {
    msg: errorMessages.post.uploadError,
    success: false,
  });
});

exports.updatePost = catchAsyncError(async (req, res) => {
  const {
    postid,
    title,
    summary,
    category,
    subCategory,
    content,
    author,
    companyName,

    seoDescription,
    seoKeywords,
    backlinkUrl,

    draftStatus,
    postType,
    releaseDate,

    paidStatus,
    homePageStatus,
    isApproved,
    isActive,
  } = req.body;

  if (!ObjectId.isValid(postid)) {
    sendResponse(res, 500, {
      msg: errorMessages.post.invalidID,
      success: false,
    });
  }

  const changesTobeUpdated = {
    summary,
    category,
    subCategory,
    content,
    author,
    companyName,

    seoDescription,
    seoKeywords,

    backlinkUrl,

    draftStatus,
    postType,
    releaseDate,

    paidStatus,
    homePageStatus,
    isApproved,
    isActive,
  };

  if (req.sendfile) changesTobeUpdated.featuredImage = req.sendfile;

  const updatedPost = await Post.findByIdAndUpdate(postid, changesTobeUpdated, {
    new: true,
  });

  if (updatedPost) {
    sendResponse(res, 200, {
      msg: errorMessages.post.UpdateSucess,
      success: true,
      data: updatedPost,
    });
  } else {
    sendResponse(res, 500, {
      msg: errorMessages.post.UpdateError,
      success: false,
    });
  }
});

exports.deletePost = catchAsyncError(async (req, res) => {
  const { postid } = req.body;

  if (!ObjectId.isValid(postid)) {
    return sendResponse(res, 500, {
      msg: errorMessages.post.invalidID,
      success: false,
    });
  }

  const softDeletePost = await Post.findByIdAndUpdate(postid, {
    isActive: false,
  });

  // make it same as add post
  if (softDeletePost) {
    sendResponse(res, 200, {
      msg: errorMessages.post.Deleted,
      success: true,
      data: softDeletePost,
    });
  }
  sendResponse(res, 500, {
    msg: errorMessages.post.DeleteError,
    success: false,
  });
});

// admin
exports.getAllpost = catchAsyncError(async (req, res) => {
  const { postid, url, page, limit } = req.body;

  let getFullpost;

  if (!postid && !url) {
    const pageOptions = {
      skipVal: (parseInt(page) - 1 || 0) * (parseInt(limit) || 30),
      limitVal: parseInt(limit) || 30,
    };

    getFullpost = await Post.aggregate([
      {
        $facet: {
          mainDoc: [
            { $match: { isActive: true } },
            { $sort: { createdAt: -1 } },
            { $skip: pageOptions.skipVal },
            { $limit: pageOptions.limitVal },
          ],
          totalCount: [{ $match: { isActive: true } }, { $count: "total" }],
        },
      },
      {
        $addFields: {
          totalCount: {
            $ifNull: [{ $arrayElemAt: ["$totalCount.total", 0] }, 0],
          },
        },
      },
    ]);
  } else {
    if (postid && !mongoose.isValidObjectId(postid))
      return sendResponse(res, 500, {
        success: false,
        msg: errorMessages.post.invalidPostID,
      });

    let query = !url
      ? {
          _id: postid,
          isActive: true,
        }
      : {
          slugUrl: url,
          isActive: true,
        };

    getFullpost = await Post.findOne(query);

    if (!getFullpost)
      return sendResponse(res, 404, {
        success: true,
        data: errorMessages.post.NotFound,
      });
  }

  if (getFullpost)
    return sendResponse(res, 200, { success: true, data: getFullpost });
});

exports.searchAdminPosts = catchAsyncError(async (req, res) => {
  const { searchTerm, page, limit } = req.body;

  let getFullpost;

  const pageOptions = {
    skipVal: (parseInt(page) - 1 || 0) * (parseInt(limit) || 30),
    limitVal: parseInt(limit) || 30,
  };

  const searchMatch = {
    isActive: true,
    $or: [
      { title: new RegExp(searchTerm, "i") },
      { summary: new RegExp(searchTerm, "i") },
    ],
  };

  getFullpost = await Post.aggregate([
    {
      $facet: {
        mainDoc: [
          {
            $match: searchMatch,
          },
          { $sort: { createdAt: -1 } },
          { $skip: pageOptions.skipVal },
          { $limit: pageOptions.limitVal },
        ],
        totalCount: [{$match: searchMatch}, { $count: "total" }],
      },
    },
    {
      $addFields: {
        totalCount: {
          $ifNull: [{ $arrayElemAt: ["$totalCount.total", 0] }, 0],
        },
      },
    },
  ]);

  if (getFullpost)
    return sendResponse(res, 200, { success: true, data: getFullpost });
});

exports.getPRList = catchAsyncError(async (req, res) => {
  const { postid, url, page, limit } = req.body;

  let getFullpost;

  if (!postid && !url) {
    const pageOptions = {
      skipVal: (parseInt(page) - 1 || 0) * (parseInt(limit) || 30),
      limitVal: parseInt(limit) || 30,
    };

    let allPostMatch = {
      $match: {
        ...aggreFilters.homePage.filters,
        releaseDate: { $lte: new Date() },
      },
    };

    getFullpost = await Post.aggregate([
      {
        $facet: {
          mainDoc: [allPostMatch, ...PRFullSorting(pageOptions)],
          totalCount: [allPostMatch, { $count: "total" }],
        },
      },
      {
        $addFields: {
          totalCount: {
            $ifNull: [{ $arrayElemAt: ["$totalCount.total", 0] }, 0],
          },
        },
      },
    ]);
  } else {
    if (postid && !mongoose.isValidObjectId(postid))
      return sendResponse(res, 500, {
        success: false,
        msg: errorMessages.post.invalidID,
      });

    let query = !url
      ? {
          _id: ObjectId(postid),
          isActive: true,
        }
      : {
          slugUrl: url,
          isActive: true,
        };

    getFullpost = await Post.aggregate([
      { $match: query },
      ...addCategoryName(),
    ]);
    getFullpost = getFullpost[0];
  }

  if (getFullpost)
    return sendResponse(res, 200, { success: true, data: getFullpost });

  return sendResponse(res, 500, {
    success: false,
    data: errorMessages.other.InternServErr,
  });
});

//home page
exports.getTopBuzz = catchAsyncError(async (req, res) => {
  const topBuzzFilter = {
    ...aggreFilters.homePage.filters,
    homePageStatus: true,
    releaseDate: { $lte: new Date() },
  };

  const getTopBuzzPR = await Post.find(topBuzzFilter)
    .sort(aggreFilters.homePage.sorting)
    .limit(aggreFilters.homePage.limits);

  return sendResponse(res, 200, { data: getTopBuzzPR, status: 200 });
});

exports.getRecentPR = catchAsyncError(async (req, res) => {
  const recentPRFilters = {
    ...aggreFilters.homePage.filters,
    releaseDate: { $lte: new Date() },
  };

  const getRecentPRData = await Post.find(recentPRFilters)
    .sort(aggreFilters.homePage.sorting)
    .limit(aggreFilters.homePage.limits);

  return sendResponse(res, 200, { data: getRecentPRData, status: 200 });
});

exports.globalSearch = catchAsyncError(async (req, res) => {
  const { searchTerm, page, limit } = req.body;

  const searchMatch = {
    $match: {
      ...aggreFilters.homePage.filters,
      title: new RegExp(searchTerm, "i"),
    },
  };

  const pageOptions = {
    skipVal:
      (parseInt(page) - 1 || 0) *
      (parseInt(limit) || aggreFilters.prList.pagination.limits),
    limitVal: parseInt(limit) || aggreFilters.prList.pagination.limits,
  };

  let searchedPosts;
  searchedPosts = await Post.aggregate([
    {
      $facet: {
        mainDoc: [searchMatch, ...PRFullSorting(pageOptions)],
        totalCount: [searchMatch, { $count: "total" }],
      },
    },
    {
      $addFields: {
        totalCount: {
          $ifNull: [{ $arrayElemAt: ["$totalCount.total", 0] }, 0],
        },
      },
    },
  ]);

  return sendResponse(res, 200, { data: searchedPosts, status: 200 });
});

exports.internalSearch = catchAsyncError(async (req, res) => {
  const { searchTerm, page, limit } = req.body;

  const pageOptions = {
    skipVal: (parseInt(page) - 1 || 0) * (parseInt(limit) || 30),
    limitVal: parseInt(limit) || 30,
  };

  const searchMatch = {
    $match: {
      ...aggreFilters.homePage.filters,
      $or: [
        { title: new RegExp(searchTerm, "i") },
        { summary: new RegExp(searchTerm, "i") },
      ],
    },
  };

  let searchedPosts;
  searchedPosts = await Post.aggregate([
    {
      $facet: {
        mainDoc: [searchMatch, ...PRFullSorting(pageOptions)],
        totalCount: [searchMatch, { $count: "total" }],
      },
    },
    {
      $addFields: {
        totalCount: {
          $ifNull: [{ $arrayElemAt: ["$totalCount.total", 0] }, 0],
        },
      },
    },
  ]);

  return sendResponse(res, 200, { data: searchedPosts, status: 200 });
});

exports.interestedPosts = catchAsyncError(async (req, res) => {
  const { postId } = req.body;

  let interestedPostList;

  const sortLimit = [
    { $sort: { createdAt: -1 } },
    { $limit: aggreFilters.prDetail.interested.limits },
  ];

  const fetchedPost = await Post.findOne({ _id: postId });
  let interestedPostCategory = fetchedPost.category[0];

  if (interestedPostCategory) {
    interestedPostList = await Post.aggregate([
      {
        $match: {
          ...aggreFilters.homePage.filters,
          category: interestedPostCategory,
        },
      },
      ...sortLimit,
    ]);
  }

  if (interestedPostList.length < 2 || interestedPostCategory.length < 1) {
    console.log("recent");
    interestedPostList = await Post.aggregate([
      {
        $match: {
          ...aggreFilters.homePage.filters,
          _id: { $ne: ObjectId(postId) },
          releaseDate: { $lte: new Date() },
        },
      },
      ...sortLimit,
    ]);
  }

  return sendResponse(res, 200, { data: interestedPostList });
});

exports.categoryPrList = catchAsyncError(async (req, res) => {
  const { categoryID, page, limit } = req.body;



  const pageOptions = {
    skipVal: (parseInt(page) - 1 || 0) * (parseInt(limit) || 30),
    limitVal: parseInt(limit) || 30,
  };

  let postMatch = await Category.find({
    title: new RegExp(categoryID, "i"),
  });
  postMatch = postMatch[0];
  
  console.log(postMatch);
  const categoryMatch = {
    $match: {
      ...aggreFilters.homePage.filters,
      $or: [
        { category: ObjectId(postMatch._id) },
        { subCategory: ObjectId(postMatch._id) },
      ],
    },
  };

  const categoryPosts = await Post.aggregate([
    {
      $facet: {
        mainDoc: [categoryMatch, ...PRFullSorting(pageOptions)],
        totalCount: [categoryMatch, { $count: "total" }],
      },
    },
    {
      $addFields: {
        totalCount: {
          $ifNull: [{ $arrayElemAt: ["$totalCount.total", 0] }, 0],
        },
      },
    },
  ]);

  return sendResponse(res, 200, { data: categoryPosts, status: 200 });
});

function PRFullSorting(pageOptions) {
  return [
    {
      $addFields: {
        date: {
          $dateToString: {
            date: "$releaseDate",
            format: "%Y-%m-%d",
          },
        },
        categoryID: { $arrayElemAt: ["$category", 0] },
        subCategoryID: { $arrayElemAt: ["$subCategory", 0] },
      },
    },
    { $sort: { date: -1, paidStatus: -1, ...aggreFilters.homePage.sorting } },
    { $skip: pageOptions.skipVal },
    { $limit: pageOptions.limitVal },
    {
      $lookup: {
        from: "categories",
        localField: "categoryID",
        foreignField: "_id",
        as: "catgoryName",
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "subCategoryID",
        foreignField: "_id",
        as: "subCatgoryName",
      },
    },
    {
      $addFields: {
        selectedCategory: {
          $arrayElemAt: [{ $ifNull: ["$catgoryName.title", ""] }, 0],
        },
        selectedSubCategory: {
          $arrayElemAt: [{ $ifNull: ["$subCatgoryName.title", ""] }, 0],
        },
      },
    },
    {
      $project: {
        catgoryName: 0,
        subCatgoryName: 0,
        categoryID: 0,
        subCategoryID: 0,
        date: 0,
      },
    },
  ];
}

function addCategoryName() {
  return [
    {
      $addFields: {
        categoryID: { $arrayElemAt: ["$category", 0] },
        subCategoryID: { $arrayElemAt: ["$subCategory", 0] },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "categoryID",
        foreignField: "_id",
        as: "catgoryName",
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "subCategoryID",
        foreignField: "_id",
        as: "subCatgoryName",
      },
    },
    {
      $addFields: {
        selectedCategory: {
          $arrayElemAt: [{ $ifNull: ["$catgoryName.title", ""] }, 0],
        },
        selectedSubCategory: {
          $arrayElemAt: [{ $ifNull: ["$subCatgoryName.title", ""] }, 0],
        },
      },
    },
    {
      $project: {
        catgoryName: 0,
        subCatgoryName: 0,
        categoryID: 0,
        subCategoryID: 0,
      },
    },
  ];
}
