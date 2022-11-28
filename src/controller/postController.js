const sharp = require("sharp");
const Post = require("../model/post");
const catchAsyncError = require("../utils/catchAsyncError");
const { sendResponse, upload } = require("../utils/commonFunctions");
let ObjectId = require("mongoose").Types.ObjectId;

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

exports.uploadPost = catchAsyncError(async (req, res) => {
  const {
    title,
    summary,
    category,
    subcategory,
    content,
    author,
    companyName,
    seoTitle,
    seoDescription,
    webUrl,
    slugUrl,
    draftStatus,
    postType,
    releaseDate,
    submitDate,
    // paidStatus,
    homePageStatus,
    isApproved,
  } = req.body;

  if (
    await Post.create({
      title,
      featuredImage: req.sendfile,
      summary,
      category,
      subcategory,
      content,
      author,
      companyName,
      seoTitle,
      seoDescription,
      webUrl,
      slugUrl,
      draftStatus,
      postType,
      releaseDate,
      submitDate,
      // paidStatus,
      homePageStatus,
      isApproved,
    })
  ) {
    sendResponse(res, 200, {
      msg: draftStatus == 1 ? "Post uploaded !" : "Post drafted !",
      success: true,
    });
  } else {
    sendResponse(res, 500, { msg: "Post not uploaded !", success: false });
  }
});

exports.updatePost = catchAsyncError(async (req, res) => {
  const {
    parentid,
    title,
    summary,
    category,
    subcategory,
    content,
    author,
    companyName,
    seoTitle,
    seoDescription,
    webUrl,
    slugUrl,
    draftStatus,
    postType,
    releaseDate,
    submitDate,
    paidStatus,
    homePageStatus,
    isApproved,
  } = req.body;

  if (!ObjectId.isValid(parentid)) {
    sendResponse(res, 500, { msg: "parent id is not valid !", success: false });
  }
  if (
    await Post.findByIdAndUpdate(
      parentid,
      req.sendfile
        ? {
            title,
            featuredImage: req.sendfile,
            summary,
            category,
            subcategory,
            content,
            author,
            companyName,
            seoTitle,
            seoDescription,
            webUrl,
            slugUrl,
            draftStatus,
            postType,
            releaseDate,
            submitDate,
            paidStatus,
            homePageStatus,
            isApproved,
          }
        : {
            title,
            summary,
            category,
            subcategory,
            content,
            author,
            companyName,
            seoTitle,
            seoDescription,
            webUrl,
            slugUrl,
            draftStatus,
            postType,
            releaseDate,
            submitDate,
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

exports.getAllpost = catchAsyncError(async (req, res) => {
  const allpost = await Post.find({ isActive: true })
    .sort({ createdAt: -1 })
    .lean();
  if (allpost) {
    if (allpost.length <= 0) {
      sendResponse(res, 200, { success: true, data: null });
    } else {
      sendResponse(res, 200, { success: true, data: allpost });
    }
  } else {
    sendResponse(res, 500, { success: false, data: "Internal server error !" });
  }
});

exports.deletePost = catchAsyncError(async (req, res) => {
  const { postid } = req.body;
  if (!ObjectId.isValid(postid)) {
    sendResponse(res, 500, { msg: "id is not valid !", success: false });
  } else {
    if (await Post.findByIdAndUpdate(postid, { isActive: false })) {
      sendResponse(res, 200, {
        msg: "Post deleted successfully !",
        success: true,
      });
    } else {
      sendResponse(res, 500, { msg: "Post not deleted !", success: false });
    }
  }
});

exports.getSinglePost = catchAsyncError(async (req, res) => {
  const postid = req.params["postid"];
  try {
    const singlepost = await Post.findOne({
      _id: postid,
      isActive: true,
    }).lean();
    if (!singlepost) {
      sendResponse(res, 200, { success: true, data: null });
    } else {
      sendResponse(res, 200, { success: true, data: singlepost });
    }
  } catch (e) {
    sendResponse(res, 500, { success: false, data: null });
  }
});
