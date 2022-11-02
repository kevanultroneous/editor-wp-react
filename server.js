const express = require('express');
const bodyparser = require('body-parser');
const multiparty = require('connect-multiparty');
const mongoose = require('mongoose');

const cors = require('cors');
const { imageUpload, savePost } = require('./src/controller/postController');
const { uploadCategory } = require('./src/controller/categoryController');

const PORT = process.env.PORT || 8000;
const app = express();
const MuiltiPartyMiddleware = multiparty({ uploadDir: "./images" });

app.use(cors())
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.static("uploads"));

// post
app.post('/upload', MuiltiPartyMiddleware, imageUpload)
app.post('/save', savePost)

// category
app.post('/upload-category', uploadCategory)

// database connection
mongoose.connect("mongodb+srv://kevanultroneous:Gs2vHLkMT4J96UhK@cluster0.2uvjism.mongodb.net/editor?retryWrites=true&w=majority")
    .then((r) => console.log("database connect"))
    .catch((e) => console.log("error" + e))

// listining
app.listen(PORT, console.log(`Server Started at PORT :${PORT}`))