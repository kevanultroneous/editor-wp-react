const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    image: {
        type: String,
        default: 'gallery/def.jpg'
    }
}, { timestamps: true })

const Gallery = mongoose.model("gallery", schema)
module.exports = Gallery;