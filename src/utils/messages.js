const empty = "Please enter";

const errorMessages = {
  user: {
    exists: "User already exists with this contact number or email.",
    notExists: "No user exist with this email.",
    blocked: "Your account is has been suspended. Kindly contact admin.",
  },
  name: {
    empty: `${empty} name.`,
  },
  email: {
    invalid: "${empty}valid email",
    empty: `${empty} email.`,
  },
  contact: {
    invalid: "Contact number length must be between 7 and 15 characters",
    notContact: "Only numbers are allowed",
    empty: `${empty} contact number.`,
  },
  password: {
    invalid:
      "Password must contain min 8 characters. One uppercase, one lowercase, one number and one special character.",
    oldAndNewSame: "Old and New password cannot be same.",
    newAndConfirmSame: "Password and Confirm password must be same.",
    empty: `${empty} password.`,
    wrongPwd: "Email or password is incorrect. Please try again.",
  },
  post: {
    uploadError: "Post was not uploaded",
    postDraft: "Post is in draft",
    postPublished:"Post is uploaded",
    inValidParentID: "parent id is not valid !",
    postUpdated: "Post updated !",
    postUpdatedError: "Post not updated !",
    postDeleted: "Post deleted successfully !",
    postDeleteError: "Post not deleted !",
    invalidPostID: "post id is not valid !"
  },
  other: {
    InternServErr: "Internal server error !"
  }
};

module.exports = { errorMessages };
