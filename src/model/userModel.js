const mongoose = require("mongoose");
const { errorMessages } = require("../utils/messages");

const schema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, errorMessages.name.empty],
    },
    customerTitle: {
      type: String,
    },
    customerEmail: {
      type: String,
      required: [true, errorMessages.email.empty],
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
      default: "serviceProvider",
      enum: ["admin", "serviceProvider"],
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
      default: false,
    },
    password: {
      type: String,
      required: [true, errorMessages.password.empty],
      select: false,
    },
    customerPRs: [
        {
        type: mongoose.Types.ObjectId,
        ref: "Post",
        }
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", schema);
module.exports = User;
