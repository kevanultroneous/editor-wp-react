const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Title",
    },
    fimg: {
      type: String,
      default: "img",
    },
    featuredImage: {
      type: mongoose.Types.ObjectId,
      ref: "gallery",
    },
    category: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Category",
      },
    ],
    subCategory: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Category",
      },
    ],
    content: {
      type: String,
      required: true,
      default: "<strong>Some Content is nice !</strong>",
    },
    author: {
      type: String,
      default: "Ultroneous",
    },
    companyName: {
      type: String,
      default: "Ultroneous Technologies",
    },
    stitle: {
      type: String,
      default: "social title",
    },
    sdesc: {
      type: String,
      default: "description",
    },
    seoKeywords: {
      type: String,
      default: "keywords",
    },
    backlinkUrl: {
      type: String,
      default: "www.ultroneous.com",
    },
    status: {
      type: Number,
      default: 0,
    },
    draftStatus: {
      type: String,
      default: "draft",
      enum: ["draft", "published"],
    },
    postType: {
      type: String,
      default: "press",
      enum: ["blog", "press"],
    },
    releaseDate: {
      type: Date,
      default: new Date(),
    },
    submittedDate: {
      type: Date,
      default: new Date(),
    },
    paidStatus: {
      type: Boolean,
      required: true,
      default: false,
    },
    plan: {
      type: mongoose.Types.ObjectId,
      ref: "Plan",
    },
    totalPaidAmount: {
      type: String,
      default: 0,
      ref: "Plan",
    },
    homePageStatus: {
      type: Boolean,
      required: false,
    },
    isApproved: {
      type: Boolean,
      requrired: false,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);
