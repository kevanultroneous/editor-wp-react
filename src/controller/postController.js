const sharp = require("sharp");
let ObjectId = require("mongoose").Types.ObjectId;

const catchAsyncError = require("../utils/catchAsyncError");
const { sendResponse, upload } = require("../utils/commonFunctions");

const Post = require("../model/postModel");
const { errorMessages } = require("../utils/messages");
const { default: mongoose } = require("mongoose");

// add in common functions => check kyc
exports.uploadImagesForFeatured = upload.single("image");

exports.resizePhotoFimg = (req, res, next) => {
  if (req.file) {
    let newfile = `public/featured/${new Date() + req.file.originalname}.jpeg`;

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

  if (subCategory) {
    newPost.subCategory = subCategory.map((subCate) => subCate.subCategory);
  }

  let post = await Post.create(newPost);

  if (post) {
    return sendResponse(res, 200, {
      msg:
        draftStatus !== "draft"
          ? errorMessages.post.postPublished
          : errorMessages.post.postDraft,
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
    parentid,
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
  } = req.body;

  if (!ObjectId.isValid(parentid)) {
    sendResponse(res, 500, {
      msg: errorMessages.post.inValidParentID,
      success: false,
    });
  }

  const postTobeupdated = {
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
  };

  if (req.sendfile) postTobeupdated.featuredImage = req.sendfile;
  console.log(subCategory);
  const updatedPost = await Post.findByIdAndUpdate(parentid, postTobeupdated);
  if (updatedPost) {
    sendResponse(res, 200, {
      msg: errorMessages.post.postUpdated,
      success: true,
      data: updatedPost,
    });
  } else {
    sendResponse(res, 500, {
      msg: errorMessages.post.postUpdatedError,
      success: false,
    });
  }
});

exports.deletePost = catchAsyncError(async (req, res) => {
  const { postid } = req.body;

  if (!ObjectId.isValid(postid)) {
    return sendResponse(res, 500, { msg: "id is not valid !", success: false });
  }

  const softDeletePost = await Post.findByIdAndUpdate(postid, {
    isActive: false,
  });

  // make it same as add post
  if (softDeletePost) {
    sendResponse(res, 200, {
      msg: errorMessages.post.postDeleted,
      success: true,
      data: softDeletePost,
    });
  }
  sendResponse(res, 500, {
    msg: errorMessages.post.postDeleteError,
    success: false,
  });
});

exports.getAllpost = catchAsyncError(async (req, res) => {
  const { num } = req.params;
  if (ObjectId.isValid(num)) {
    getFullpost = await Post.findOne({ _id: num, isActive: true });
    return sendResponse(res, 200, { success: true, data: getFullpost });
  } else {
    getFullpost = await Post.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();
    return sendResponse(res, 200, { success: true, data: getFullpost });
  }
});
