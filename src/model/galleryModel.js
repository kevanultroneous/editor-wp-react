const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    path: {
      type: String,
      default: "gallery/def.jpg",
    },
  },
  { timestamps: true }
);

const Gallery = mongoose.model("Gallery", schema);
module.exports = Gallery;
