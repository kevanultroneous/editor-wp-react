const express = require("express");
const categoryRouter = express.Router();

const categoryController = require("../controller/categoryController");
const validator = require("../utils/validator");

categoryRouter.post(
  "/create-category",
  validator.validateCategory,
  categoryController.createCategory
);

categoryRouter.post(
  "/update-category",
  validator.validateCategory,
  categoryController.updateCategory
);

categoryRouter.post("/sub-categories", categoryController.getSubcategories);
categoryRouter.post("/delete-category", categoryController.deleteCategory);
categoryRouter.post("/search-category", categoryController.searchCategory);
categoryRouter.get(
  "/all-category",
  categoryController.getCategoryWithSubcategory
);

module.exports = categoryRouter;
