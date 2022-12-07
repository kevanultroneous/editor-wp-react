const { default: mongoose } = require("mongoose");
let ObjectId = require("mongoose").Types.ObjectId;
const jwt = require("jsonwebtoken");

const User = require("../model/userModel");

const catchAsyncError = require("../utils/catchAsyncError");
const { sendResponse } = require("../utils/commonFunctions");
const { aggreFilters } = require("../utils/filterJson");
const { errorMessages } = require("../utils/messages");

// extract user info from the token and pass user details to the next middleware
exports.protect = catchAsyncError(async (req, res, next) => {
  let token; // get token sent by the user
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer") // check if the token exists
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    sendResponse(res, 401, {msg: "User not logged in"}) // token is invalid or token is not present
  }

  const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY); // decode and get id

  const userDetails = await User.findById(id);
  console.log(userDetails);
  //   .select("+otp +otpCreatedAt"); // change model name to the data required from

  req.user = userDetails; // save user details in variable
  next(); // pass in to the next controller
});

exports.userSignUp = catchAsyncError(async (req, res) => {
  let user;

  const {
    email,
    title,
    companyName,
    companyEmail,
    companyWebsite,
    role,
    name,
    password,
    contact,
  } = req.body;

  user = await User.findOne({ $or: [{email: email}, {contact: contact}] });

  if (user) {
    return sendResponse(res, 409, { msg: errorMessages.user.exists });
  }

  let userDetails = {
    email,
    name,
    contact,
    password,
    title,
    companyName,
    companyEmail,
    companyWebsite,
    role,
  }

 userDetails = await User.create(userDetails);

  delete userDetails._doc.password;

  sendResponse(res, 200, { data: userDetails, msg: errorMessages.user.created }, true);
});

exports.userSignIn = catchAsyncError(async (req, res) => {
  let user;
  const { email, password } = req.body;

  user = await User.findOne({ email }).select("+password");

  if (!user) {
    return sendResponse(res, 409, { msg: errorMessages.password.wrongPwd });
  }

  if (!(await user.checkPassword(password))) {
    return sendResponse(res, 409, { msg: errorMessages.password.wrongPwd });
  }

  delete user._doc.password;
  delete user._doc.otp;
  delete user._doc.otpCreatedAt;

  sendResponse(res, 200, { data: user, msg: errorMessages.user.loggedIn }, true);
});

exports.changePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");
  const { newPassword } = req.body;

  if (await user.checkPasswordOnReset(newPassword, user.password)) {
    return sendResponse(res, 200, {msg: errorMessages.password.oldAndNewSame});
  }

  // send email for password change

  user.password = newPassword;
  await user.save();

  sendResponse(res,200, {data: user, msg: errorMessages.password.changed});
});

// exports.resetPassword = catchAsyncError(async (req, res, next) => {
//   const { newPassword } = req.body;

//   const user = await User.findById(req.user._id).select("+password");

//   if (await user.checkPasswordOnReset(newPassword, user.password)) {
//     return sendResponse(res, 200, {
//       msg: errorMessages.password.oldAndNewSame,
//     });
//   }

//   user.password = newPassword;
//   await user.save();

//   sendResponse(res, 200, {data: user}, true);
// });

// exports.verifyOtp = catchAsyncError(async (req, res, next) => {
//   const { otp, otpCreatedAt } = req.user;

//   if (
//     Date.now() >
//     new Date(`${otpCreatedAt}`).getTime() +
//       1000 * 60 * process.env.OTP_EXPIRES_IN
//   ) {
//     req.user.otp = "";
//     await req.user.save();
//     return next(
//       new AppError(
//         401,
//         "Otp has expired. Please resend the otp and verify again."
//       )
//     );
//   }

//   if (parseInt(req.body.otp) !== otp) {
//     return next(new AppError(401, "Invalid OTP. Please try again"));
//   }

//   let updatedUser;

//   updatedUser = await ServiceProvider.findByIdAndUpdate(
//     req.user._id,
//     { otp: null },
//     { new: true }
//   );

//   sendResponse(updatedUser, 200, res);
// });

// exports.forgetPassword = catchAsyncError(async (req, res, next) => {
//   let user;
//   let otp = generateOtp();
//   const smsText = `Forgot your password? Here is your reset code: ${otp}. The code will be valid only for ${process.env.OTP_EXPIRES_IN} minutes`;

//   user = await ServiceProvider.findOneAndUpdate(
//     { email: req.body.email },
//     { otp: otp, otpCreatedAt: Date.now() },
//     { new: true }
//   );

//   if (!user) {
//     return next(new AppError(404, "No user found for this account."));
//   }

//   // send email for password
//   sendEmailToUser(
//     user._doc.email,
//     user._doc.name,
//     "Welcome to KYC",
//     otp,
//     "Forgot Password?"
//   );

//   delete user._doc.otp;
//   delete user._doc.otpCreatedAt;

//   sendResponse(user, 200, res, true);
// });

// exports.resendOtp = catchAsyncError(async (req, res, next) => {
//   let user;
//   const { _id } = req.user;
//   let otp = generateOtp();
//   const smsText = `Your otp for forget password is: ${otp}`;

//   user = await ServiceProvider.findByIdAndUpdate(
//     _id,
//     { otp: otp, otpCreatedAt: Date.now() },
//     { new: true }
//   );

//   sendResponse(user, 200, res, true);
// });
