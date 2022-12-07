const empty = "Please enter";
const provide = "Please provide valid";

const errorMessages = {
  user: {
    exists: "User already exists with this contact number or email.",
    notExists: "No user exist with this email.",
    blocked: "Your account is has been suspended. Kindly contact admin.",
    loggedIn: `User logged in!`,
    created: `News user created !`
  },
  name: {
    empty: `${empty} name.`,
  },
  email: {
    invalid: `${empty} valid email`,
    empty: `${empty} email.`,
  },
  contact: {
    invalid: "Contact number length must be between 7 and 15 characters",
    notContact: "Only numbers are allowed",
    empty: `${empty} contact number.`,
  },
  topic: {
    empty: `${empty} topic.`,
  },
  contactMessage: {
    empty: `${empty} message`
  },
  enquiry: {
    created: "Enquiry created !",
  },
  password: {
    invalid:
      "Password must contain min 8 characters. One uppercase, one lowercase, one number and one special character.",
    oldAndNewSame: "Old and New password cannot be same.",
    newAndConfirmSame: "Password and Confirm password must be same.",
    empty: `${empty} password.`,
    wrongPwd: "Email or password is incorrect. Please try again.",
    changed: `Password has changed`
  },
  otp : {
    expired: "Otp has expired. Please resend the otp and verify again.",
    invalid: `${provide} OTP`,
  },
  post: {
    uploadError: "Post was not uploaded",
    Draft: "Post is in draft",
    Published: "Post is uploaded",
    inValidParentID: "parent id is not valid !",
    UpdateSucess: "Post updated !",
    UpdateError: "Post not updated !",
    Deleted: "Post deleted successfully !",
    DeleteError: "Post not deleted !",
    invalidID: "post id is not valid !",
    NotFound: "post not found !",
  },
  category: {
    created: "Category created!",
    updated: "Category updated!",
    deleted: "Category Deleted!",
    inValidCategoryID: `${provide} category ID`,
    invalidTitle: `${provide} title !`,
    invalidTitleLength: `Title length must be greater than 3 and lessthan 30 words !`,
    inComplete: `${provide} details`,
    inValidParentID: `${provide} parent category id !`,
    doesntExist: `Category does not exist`,
    postTypeExist: `${empty} post type`,
    invalidPostType: `${provide} postType`,
    categoryExists: "Category already exists !"
  },
  other: {
    InternServErr: "Internal server error !",
  },
};

module.exports = { errorMessages };
