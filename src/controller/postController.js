const sharp = require("sharp");
let ObjectId = require("mongoose").Types.ObjectId;

const catchAsyncError = require("../utils/catchAsyncError");
const { sendResponse, upload } = require("../utils/commonFunctions");

const Post = require("../model/postModel");
const Category = require("../model/categoryModel");
const { errorMessages } = require("../utils/messages");
const { default: mongoose } = require("mongoose");

// add in common functions => check kyc
exports.uploadImagesForFeatured = upload.single("image");

exports.resizePhotoFimg = (req, res, next) => {
  if (req.file) {
    let newfile = `public/other/featured/${
      new Date() + req.file.originalname
    }.jpeg`;
    console.log(req.file);
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
    submitDate,
    // paidStatus,
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
    // paidStatus,
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

  console.log(category, subCategory);

  if (req.sendfile) changesTobeUpdated.featuredImage = req.sendfile;

  if (category || subCategory) {
    const postTobeupdated = await Post.findOne({ _id: postid });

    changesTobeUpdated.category = category
      ? postTobeupdated.category[0]
        ? [...postTobeupdated.category, category]
        : category
      : postTobeupdated.category;

    changesTobeUpdated.subCategory = subCategory
      ? postTobeupdated.subCategory[0]
        ? [...postTobeupdated.subCategory, subCategory]
        : subCategory
      : postTobeupdated.subCategory;
  }

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

  console.log(req.body);
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
  const { postid, page, limit } = req.body;
  console.log(postid);
  let getFullpost;
  let categoryPopulateString = "title parentCategory";

  if (!postid) {
    const pageOptions = {
      skipVal: (parseInt(page) - 1 || 0) * (parseInt(limit) || 30),
      limitVal: parseInt(limit) || 30,
    };

    getFullpost = await Post.find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(pageOptions.skipVal)
      .limit(pageOptions.limitVal)
      .lean();
  } else {
    if (postid && !mongoose.isValidObjectId(postid))
      return sendResponse(res, 500, {
        success: false,
        msg: errorMessages.post.invalidPostID,
      });
    getFullpost = await Post.findOne({ _id: postid, isActive: true });

    if (!getFullpost)
      return sendResponse(res, 404, {
        success: true,
        data: errorMessages.post.NotFound,
      });
  }

  if (getFullpost)
    return sendResponse(res, 200, { success: true, data: getFullpost });
});

exports.getPRList = catchAsyncError(async (req, res) => {
  const { postid, page, limit } = req.body;

  let getFullpost;
  let categoryPopulateString = "title parentCategory";

  if (!postid) {
    const pageOptions = {
      skipVal: (parseInt(page) - 1 || 0) * (parseInt(limit) || 30),
      limitVal: parseInt(limit) || 30,
    };

    getFullpost = await Post.find({
      isActive: true,
      draftStatus: "published",
      isApproved: true,
    })
      .sort({ releaseDate: -1 })
      .skip(pageOptions.skipVal)
      .limit(pageOptions.limitVal)
      .lean();
  } else {
    if (postid && !mongoose.isValidObjectId(postid))
      return sendResponse(res, 500, {
        success: false,
        msg: errorMessages.post.invalidID,
      });

    getFullpost = await Post.findOne({ _id: postid, isActive: true });
  }

  if (getFullpost)
    return sendResponse(res, 200, { success: true, data: getFullpost });

  return sendResponse(res, 500, {
    success: false,
    data: errorMessages.other.InternServErr,
  });
});
