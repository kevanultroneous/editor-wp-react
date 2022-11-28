const mongoose = require("mongoose");

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
    category: [
      {
        type: mongoose.Types.ObjectId,
        ref: "categories",
      },
    ],
    subcategory: [
      {
        type: mongoose.Types.ObjectId,
        ref: "categories",
      },
    ],
    content: {
      type: String,
      required: true,
      default:
        "<h2>Title</h2><p><strong>Write here !. </strong> your content is important !.</p>",
    },
    featuredImage: {
      type: mongoose.Types.ObjectId,
      ref: "gallery",
    },
    author: {
      type: String,
      default: "Ultroneous",
    },
    companyName: {
      type: String,
    },
    seoTitle: {
      type: String,
      default: "social title",
    },
    seoDescription: {
      type: String,
      default: "description",
    },
    webUrl: {
      type: String,
      default: "www.ultroneous.com",
    },
    slugUrl: {
      type: String,
      unique: true,
    },
    draftStatus: {
      type: Boolean,
      default: 0,
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
    submitDate: {
      type: Date,
      default: new Date(),
    },
    paidStatus: {
      type: mongoose.Types.ObjectId,
      ref: "contentplan",
      required: true,
    },
    homePageStatus: {
      type: Boolean,
      required: true,
    },
    isApproved: {
      type: Boolean,
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
