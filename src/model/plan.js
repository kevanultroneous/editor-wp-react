const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
      unique: true,
    },
   planPrice: {
    type: Number,
    required: true
   },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Plan = mongoose.model("contentplan", schema);
module.exports = Plan;
