const mongoose = require("mongoose");
const { aggreFilters } = require("../utils/filterJson");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Title",
    },
    summary: {
      type: String,
    },
    featuredImage: {
      type: String,
    },
    thumbnailImage: {
      type: String,
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
      default:
        "<h2>Title</h2><p><strong>Write here !. </strong> your content is important !.</p>",
    },
    author: {
      type: String,
      default: "Ultroneous",
    },
    companyName: {
      type: String,
      default: "Ultroneous Technologies",
    },
    seoTitle: {
      type: String,
      default: "social title",
    },
    seoDescription: {
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
    slugUrl: {
      type: String,
      unique: true,
    },
    draftStatus: {
      type: String,
      default: "draft",
      enum: ["draft", "published"],
    },
    postType: {
      type: String,
      default: "press",
      enum: aggreFilters.category.postTypes,
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
      default: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("posts", schema);
module.exports = Post;

/*

*/
