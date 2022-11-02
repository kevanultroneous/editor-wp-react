const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Wrraper'
    },
    featuredImage: {
        type: String,
        default: '/uploads/cover.jpg'
    },
    author: {
        type: String,
        default: 'author'
    },
    data: {
        type: String,
        default: "<h1>Hello</h1>"
    },
    draft: {
        type: Boolean,
        default: false
    },
    btype: {
        type: Number,
        default: 0,
    },
    category: {
        type: mongoose.Types.ObjectId
    },
    url: {
        type: String,
    },
    stitle: {
        type: String
    },
    smeta: {
        type: String
    },
    sdesc: {
        type: String
    }
}, { timestamps: true })

const EModel = mongoose.model("editors", schema)
module.exports = EModel