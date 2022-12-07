const mongoose = require("mongoose");
const {aggreFilters} = require("../utils/filterJson");
const {errorMessages} = require("../utils/messages");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contact: {
        type: String,
    },
    email: {
        type: String,
        required: [true, errorMessages.email.empty],
      },
    postType: {
      type: String,
      default: "press",
      enum: aggreFilters.category.postTypes,
      required: [true, errorMessages.category.postTypeExist]
    },
    topic: {
        type: String,
        required: [true, errorMessages.topic.empty]
    },
    message: {
        type: String,
        required: [true, errorMessages.contactMessage.empty]
    }
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", schema);
module.exports = Contact;
