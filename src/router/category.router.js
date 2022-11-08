const express = require('express')
const { uploadCategory, getAllCategory, deleteCategory, updateCategory, searchCategory, getSubcategories, uploadSubcategory } = require('../controller/categoryController')
const categoryRouter = express.Router()

categoryRouter.post('/upload-category', uploadCategory)
categoryRouter.post('/upload-subcategory', uploadSubcategory)
categoryRouter.get('/categories', getAllCategory)
categoryRouter.get('/sub-categories/:id', getSubcategories)
categoryRouter.post('/delete-category', deleteCategory)
categoryRouter.post('/update-category', updateCategory)
categoryRouter.post('/search-category', searchCategory)

module.exports = categoryRouter