const mongoose = require("mongoose");

// status 0 draft
// status 1 publish
// parent 0 press release
// parent 1 guest post

const schema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Title'
    },
    fimg: {
        type: String,
        default: 'img'
    },
    category: {
        type: Array,
        required: true
    },
    date: {
        type: Date,
        default: new Date()
    },
    author: {
        type: String,
        default: 'Ultroneous'
    },
    content: {
        type: String,
        default: '<strong>Some Content is nice !</strong>'
    },
    smeta: {
        type: String,
        default: 'social meta'
    },
    stitle: {
        type: String,
        default: 'social title'
    },
    sdesc: {
        type: String,
        default: 'description'
    },
    url: {
        type: String,
        default: 'www.ultroneous.com'
    },
    status: {
        type: Number,
        default: 0
    },
    parent: {
        type: Number,
        default: 0
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const EPost = mongoose.model("editors", schema)
module.exports = EPost






