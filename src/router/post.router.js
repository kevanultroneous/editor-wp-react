const express = require('express')
const { uploadPost, deletePost, getAllpost, getSinglePost } = require('../controller/postController')

const postRouter = express.Router()

postRouter.post('/upload-post', uploadPost)
postRouter.post('/delete-post', deletePost)
postRouter.get('/get-all-post/:num', getAllpost)
postRouter.get('/get-post/:postid', getSinglePost)

module.exports = postRouter