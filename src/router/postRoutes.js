const express = require("express");

const postController = require("../controller/postController");
const galleryController = require("../controller/galleryController");

const postRouter = express.Router();

// a single middleware that runs on all the routes below it. add that middleware above all the links that require jwt. that middleware is used for taking the auth bearer token

//create post
postRouter.post(
  "/upload-post",
  postController.uploadImagesForFeatured,
  postController.resizePhotoFimg,
  postController.addPost
);

//update post
postRouter.post(
  "/update-post",
  postController.uploadImagesForFeatured,
  postController.resizePhotoFimg,
  postController.updatePost
);

//delete post
postRouter.post("/delete-post", postController.deletePost);

//get all post
postRouter.get("/get-all-post/:num", postController.getAllpost);

//delete post
postRouter.get("/get-post/:postid", postController.getSinglePost);

postRouter.post(
  "/gallery-img-upload",
  galleryController.uploadImagesForGallery,
  galleryController.resizePhoto,
  galleryController.createGalleryPost
);
postRouter.get("/gallery", galleryController.fetchAllgalleryImage);

module.exports = postRouter;
