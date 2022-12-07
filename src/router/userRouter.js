const express = require("express");
const userRouter = express.Router();

const userController = require("../controller/userController");
const validator = require("../utils/validator");

userRouter.post("/signup", validator.validateUserSignup, userController.userSignUp);
userRouter.post("/signin", validator.validateUserSignin, userController.userSignIn);
userRouter.post(
  "/change-password",
  validator.validateNewConfirmPassword,
  userController.protect,
  userController.changePassword
);

module.exports = userRouter;