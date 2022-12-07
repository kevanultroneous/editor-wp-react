const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { errorMessages } = require("../utils/messages");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, errorMessages.name.empty],
    },
    title: {
      type: String,
    },
    email: {
      type: String,
      required: [true, errorMessages.email.empty],
      unique: true,
    },
    contact: {
      type: String,
      required: [true, errorMessages.contact.empty],
      unique: true,
    },
    companyName: {
      type: String,
    },
    companyEmail: {
      type: String,
    },
    companyWebsite: {
      type: String,
    },
    role: {
      type: String,
      default: "PRUser",
      enum: ["admin", "PRUser"],
    },
    otp: {
      type: Number,
      default: null,
      select: false,
    },
    otpCreatedAt: {
      type: Date,
      default: null,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      required: [true, errorMessages.password.empty],
      select: false,
    },
    // posts: [
    //   {
    //     type: mongoose.Types.ObjectId,
    //     ref: "Post",
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

schema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

schema.methods.checkPassword = async function (loginPassword) {
  return await bcrypt.compare(loginPassword, this.password).then((res) => res);
};

schema.methods.checkPasswordOnReset = async function (
  loginPassword,
  oldHashedPassword
) {
  return await bcrypt
    .compare(loginPassword, oldHashedPassword)
    .then((res) => res);
};


const User = mongoose.model("User", schema);
module.exports = User;
