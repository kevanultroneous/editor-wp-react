const express = require('express');
const bodyparser = require('body-parser');
const multiparty = require('connect-multiparty');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const dotenv = require('dotenv')

const postRouter = require('./src/router/post.router');
const categoryRouter = require('./src/router/category.router');
dotenv.config()
const PORT = process.env.PORT || 8000;
const app = express();
const MuiltiPartyMiddleware = multiparty({ uploadDir: "./images" });

app.use(cors())
app.use(express.static('public'))
app.use(express.static('uploads'))
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// content image upload
app.get('/test', async (req, res) => res.send('working...'))
app.post('/upload', MuiltiPartyMiddleware, async (req, res) => {
    var TempFile = req.files.upload;
    var TempPathfile = TempFile.path;

    const targetPathUrl = path.join(__dirname, "./uploads/" + TempFile.name);

    if (path.extname(TempFile.originalFilename).toLowerCase() === ".png" || ".jpg") {

        fs.rename(TempPathfile, targetPathUrl, err => {

            res.status(200).json({
                uploaded: true,
                url: `http://192.168.1.28:8000/${TempFile.originalFilename}`
            });

            if (err) return console.log(err);
        })
    }
    // console.log(req.files);
})

app.use('/api/post/', postRouter)
app.use('/api/category/', categoryRouter)

// listining
app.listen(PORT, console.log(`Server Started at PORT :${PORT}`))

module.exports = app