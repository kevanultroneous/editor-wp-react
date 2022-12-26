const express = require("express");

const postController = require("../controller/postController");
const userController = require("../controller/userController");
const { uploadImagesForMulter } = require("../utils/commonFunctions");

const postRouter = express.Router();

//create post
postRouter.post(
  "/create-post",
  postController.uploadImagesForFeatured,
  userController.protect,
  postController.addPost
);

// all posts
postRouter.post(
  "/get-all-post",
  userController.protect,
  postController.getAllpost
);
postRouter.post(
  "/search-admin-posts",
  userController.protect,
  postController.searchAdminPosts
);

//update post
postRouter.post(
  "/update-post",
  postController.uploadImagesForFeatured,
  userController.protect,
  postController.updatePost
);

//delete post
postRouter.post(
  "/delete-post",
  userController.protect,
  postController.deletePost
);
postRouter.post(
  "/hard-delete",
  userController.protect,
  postController.hardDelete
);
postRouter.post(
  "/recently-deleted",
  userController.protect,
  postController.recentlyDeleted
);

//get all post
postRouter.post("/get-all-post", postController.getAllpost);

// front end pr list/ pr detail
postRouter.post("/get-pr-list", postController.getPRList);

// home page prs
postRouter.get("/get-top-buzz", postController.getTopBuzz);
postRouter.get("/get-recent-pr", postController.getRecentPR);

postRouter.post("/search-pr-title", postController.globalSearch);
postRouter.post("/internal-search", postController.internalSearch);

postRouter.post("/interested-posts", postController.interestedPosts);

module.exports = postRouter;
