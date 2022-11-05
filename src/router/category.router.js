const express = require('express')
const { uploadCategory, getAllCategory, deleteCategory, updateCategory, searchCategory } = require('../controller/categoryController')
const categoryRouter = express.Router()

categoryRouter.post('/upload-category', uploadCategory)
categoryRouter.get('/categories', getAllCategory)
categoryRouter.post('/delete-category', deleteCategory)
categoryRouter.post('/update-category', updateCategory)
categoryRouter.post('/search-category', searchCategory)

module.exports = categoryRouter