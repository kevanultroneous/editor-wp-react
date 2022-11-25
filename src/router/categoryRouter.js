const express = require('express')
const categoryController = require('../controller/categoryController')
const categoryRouter = express.Router()

categoryRouter.post('/upload-category', categoryController.uploadCategory)
categoryRouter.get('/sub-categories/:id', categoryController.getSubcategories)
categoryRouter.post('/delete-category', categoryController.deleteCategory)
categoryRouter.post('/update-category', categoryController.updateCategory)
categoryRouter.post('/search-category', categoryController.searchCategory)
categoryRouter.get('/all-category', categoryController.getCategoryWithSubcategory)

module.exports = categoryRouter