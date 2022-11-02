const path = require('path');
const fs = require('fs');
const EModel = require('../model/model');

const imageUpload = async (req, res) => {
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
}

const savePost = async (req, res) => {
    const { data, draft } = req.body
    if (!data || data === "null" || data.length < 10) {
        return res.status(400).send({ msg: "Enter valid data ! ,data must be 10  words !", success: false })
    } else {
        if (await EModel.create({ data, draft })) {
            return res.status(200).send({ msg: "Post uploaded !", success: true, data: data })
        }
    }
}

module.exports = {
    imageUpload, savePost
}