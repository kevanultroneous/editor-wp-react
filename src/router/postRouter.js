const express = require("express");

const postController = require("../controller/postController");
const galleryController = require("../controller/galleryController");

const postRouter = express.Router();

//create post
postRouter.post(
  "/create-post",
  postController.uploadImagesForFeatured,
  postController.resizePhotoFimg,
  postController.addPost
);

// //update post
postRouter.post(
  "/update-post",
  postController.uploadImagesForFeatured,
  postController.resizePhotoFimg,
  postController.updatePost
);

// //delete post
postRouter.post("/delete-post", postController.deletePost);

// //get all post
postRouter.get("/get-all-post", postController.getAllpost);

// front end pr list/ pr detail
postRouter.get("/get-pr-list", postController.getPRList);

module.exports = postRouter;
