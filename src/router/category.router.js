const express = require('express')
const { uploadCategory, getAllCategory, deleteCategory, updateCategory, searchCategory, getSubcategories, uploadSubcategory, getCategoryWithSubcategory } = require('../controller/categoryController')
const categoryRouter = express.Router()

categoryRouter.post('/upload-category', uploadCategory)//
categoryRouter.get('/sub-categories/:id', getSubcategories)//
categoryRouter.post('/delete-category', deleteCategory)//
categoryRouter.post('/update-category', updateCategory)//
categoryRouter.post('/search-category', searchCategory)//
categoryRouter.get('/all-category', getCategoryWithSubcategory)//

module.exports = categoryRouter