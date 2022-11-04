const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    title: {
        type: String,
        default: 'category',
        unique: true
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const ECategory = mongoose.model("categories", schema)
module.exports = ECategory