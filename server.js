const express = require('express');
const bodyparser = require('body-parser');
const multiparty = require('connect-multiparty');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { imageUpload, savePost } = require('./src/controller/postController');
const { uploadCategory } = require('./src/controller/categoryController');

const PORT = process.env.PORT || 8000;
const app = express();
const MuiltiPartyMiddleware = multiparty({ uploadDir: "./images" });

app.use(cors())
app.use(express.static('public'))
app.use(express.static('uploads'))
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// post
app.post('/upload', MuiltiPartyMiddleware, async (req, res) => {
    var TempFile = req.files.upload;
    var TempPathfile = TempFile.path;

    const targetPathUrl = path.join(__dirname, "./uploads/" + TempFile.name);

    if (path.extname(TempFile.originalFilename).toLowerCase() === ".png" || ".jpg") {

        fs.rename(TempPathfile, targetPathUrl, err => {

            res.status(200).json({
                uploaded: true,
                url: `${TempFile.originalFilename}`
            });

            if (err) return console.log(err);
        })
    }
    // console.log(req.files);
})

app.post('/save', savePost)

// category
app.post('/upload-category', uploadCategory)

// database connection
mongoose.connect("mongodb+srv://kevanultroneous:Gs2vHLkMT4J96UhK@cluster0.2uvjism.mongodb.net/editor?retryWrites=true&w=majority")
    .then((r) => console.log("database connect"))
    .catch((e) => console.log("error" + e))

// listining
app.listen(PORT, console.log(`Server Started at PORT :${PORT}`))