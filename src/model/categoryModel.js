const mongoose = require("mongoose");
const {aggreFilters} = require("../utils/filterJson");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    parentCategory: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    postType: {
      type: String,
      default: "press",
      enum: aggreFilters.category.postTypes,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", schema);
module.exports = Category;
