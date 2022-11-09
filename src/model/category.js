const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    parentCategory: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    type: {
        type: String,
        default: 0,
        enum: ['blog', 'press']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const ECategory = mongoose.model("categories", schema)
module.exports = ECategory