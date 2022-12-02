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
postRouter.post("/get-all-post", postController.getAllpost);

// front end pr list/ pr detail
postRouter.post("/get-pr-list", postController.getPRList);

// home page prs
postRouter.get("/get-top-buzz", postController.getTopBuzz);
postRouter.get("/get-recent-pr", postController.getRecentPR);

postRouter.post("/search-pr-title", postController.globalSearch);
postRouter.post("/interested-posts", postController.interestedPosts);


module.exports = postRouter;
