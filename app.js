const express = require('express');
const bodyparser = require('body-parser');
const multiparty = require('connect-multiparty');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const dotenv = require('dotenv')

const postRouter = require('./src/router/postRouter');
const categoryRouter = require('./src/router/categoryRouter');
const planRouter = require('./src/router/planRouter');

dotenv.config()
const PORT = process.env.PORT || 8000;
const app = express();
const MuiltiPartyMiddleware = multiparty({ uploadDir: __dirname + "/public/other/uploads/" });

app.use(cors())
app.use(express.static('public'))
app.use(express.static('uploads'))
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// content image upload
app.get('/test', async (req, res) => {
    const {a, b} = req.body;

    console.log(a, b);
    res.send("working")
})
app.post('/upload', MuiltiPartyMiddleware, async (req, res) => {
    let TempFile = req.files.upload;
    let TempPathfile = TempFile.path;
    const targetPathUrl = path.join(__dirname + "/public/other/uploads/" + TempFile.name);

    if (path.extname(TempFile.originalFilename).toLowerCase() === ".png" || ".jpg") {
        fs.rename(TempPathfile, targetPathUrl, err => {
            res.status(200).json({
                uploaded: true,
                url: `${process.env.URL_FOR_GALLERY}/other/uploads/${TempFile.originalFilename}`
            });

            if (err) return console.log(err);
        })
    }
})

app.use('/api/post/', postRouter)
app.use('/api/category/', categoryRouter)
app.use('/api/plan', planRouter);

// listining
app.listen(PORT, console.log(`Server Started at PORT :${PORT}`))

module.exports = app