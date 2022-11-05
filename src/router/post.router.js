const express = require('express')
const { uploadImagesForGallery, resizePhoto, galleryController } = require('../controller/galleryController')
const { uploadPost, deletePost, getAllpost, getSinglePost } = require('../controller/postController')

const postRouter = express.Router()

postRouter.post('/upload-post', uploadPost)
postRouter.post('/delete-post', deletePost)
postRouter.get('/get-all-post/:num', getAllpost)
postRouter.get('/get-post/:postid', getSinglePost)
postRouter.post('/gallery-img-upload',
    uploadImagesForGallery,
    resizePhoto,
    galleryController
)

module.exports = postRouter