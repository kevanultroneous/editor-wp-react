const express = require('express')
const { uploadImagesForGallery, resizePhoto, galleryController, fetchAllgalleryImage } = require('../controller/galleryController')
const { uploadPost, deletePost, getAllpost, getSinglePost, featuredresizePhoto, featureduploadUserPhoto, uploadImagesForFeatured, resizePhotoFimg } = require('../controller/postController')

const postRouter = express.Router()

postRouter.post('/upload-post',
    uploadImagesForFeatured,
    resizePhotoFimg,
    uploadPost
)

postRouter.post('/delete-post', deletePost)

postRouter.get('/get-all-post/:num', getAllpost)

postRouter.get('/get-post/:postid', getSinglePost)

postRouter.post('/gallery-img-upload',
    uploadImagesForGallery,
    resizePhoto,
    galleryController
)
postRouter.get('/gallery', fetchAllgalleryImage)

module.exports = postRouter