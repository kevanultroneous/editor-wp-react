const catchAsyncError = require("../utils/catchAsyncError");
const path = require('path');
const fs = require('fs');

const uploadFromEditorController = catchAsyncError(async (req, res) => {
    let TempFile = req.files.upload;
    let TempPathfile = TempFile.path;
    console.log(__dirname.replace('src/controller', 'other/uploads'))

    const targetPathUrl = path.join(__dirname, "./uploads/" + TempFile.name);

    if (path.extname(TempFile.originalFilename).toLowerCase() === ".png" || ".jpg") {

        fs.rename(TempPathfile, targetPathUrl, err => {

            res.status(200).json({
                uploaded: true,
                url: `${process.env.URL_FOR_GALLERY}${TempFile.originalFilename}`
            });

            if (err) return console.log(err);
        })
    }
})

module.exports = {
    uploadFromEditorController
}