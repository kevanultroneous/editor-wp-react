const sharp = require('sharp');
const EPost = require('../model/post');
const catchAsyncError = require('../utils/catchAsyncError');
const { sendResponse, upload } = require('../utils/commonFunctions');
var ObjectId = require('mongoose').Types.ObjectId;

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
    paidStatus,
    homePageStatus,
    isApproved,
  } = req.body;

  const post = await Post.create({
    title,
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
    submitDate,
    paidStatus,
    homePageStatus,
    isApproved,
  });

  // add all string messages in utils/message

  if (post) {
    return sendResponse(res, 200, {
      msg:
        draftStatus == ["check according to the plan"]
          ? "Post uploaded !"
          : "Post drafted !",
      success: true,
      data: post,
    });
  }

  sendResponse(res, 500, { msg: "Post not uploaded !", success: false });
});

exports.updatePost = catchAsyncError(async (req, res) => {
  const {
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
    sendResponse(res, 500, { msg: "parent id is not valid !", success: false });
  }

  // make it same as add post

  if (
    await Post.findByIdAndUpdate(
      parentid,
      req.sendfile
        ? {
            featuredImage: req.sendfile,
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
          }
        : {
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
          }
    )
  ) {
    sendResponse(res, 200, {
      msg: "Post updated !",
      success: true,
    });
  } else {
    sendResponse(res, 500, { msg: "Post not updated !", success: false });
  }
});

exports.deletePost = catchAsyncError(async (req, res) => {
  const { postid } = req.body;

  if (!ObjectId.isValid(postid)) {
    return sendResponse(res, 500, { msg: "id is not valid !", success: false });
  }

  // make it same as add post
  if (await Post.findByIdAndUpdate(postid, { isActive: false })) {
    sendResponse(res, 200, {
      msg: "Post deleted successfully !",
      success: true,
    });
  }
  sendResponse(res, 500, { msg: "Post not deleted !", success: false });
});

exports.getAllpost = catchAsyncError(async (req, res) => {
  const allpost = await Post.find({ isActive: true })
    .sort({ createdAt: -1 })
    .lean();

  if (allpost) {
    // would work with []
    if (allpost.length <= 0) {
      return sendResponse(res, 200, { success: true, data: null });
    } else {
        sendResponse(res, 500, { msg: "Post not uploaded !", success: false })
    }
})

// remove this api => take id in getallpost => if(id) {show post with id} else {show all posts}

// exports.getSinglePost = catchAsyncError(async (req, res) => {
//   const postid = req.params["postid"];
//   try {
//     const singlepost = await Post.findOne({
//       _id: postid,
//       isActive: true,
//     }).lean();
//     if (!singlepost) {
//       sendResponse(res, 200, { success: true, data: null });
//     } else {
//       sendResponse(res, 200, { success: true, data: singlepost });
//     }
//   } catch (e) {
//     sendResponse(res, 500, { success: false, data: null });
//   }
// });
