const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    title: {
        type: String,
        default: 'category',
        unique: true
    },
    subcategory: {
        type: Array,
    },
    selected: {
        type: Boolean,
        default: true
    },
    posttype: {
        type: Number,
        default: 0
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const ECategory = mongoose.model("categories", schema)
module.exports = ECategory