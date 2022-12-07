const express = require("express");
const contactUsRouter = express.Router();

const contactUsController = require("../controller/contactUsController");
const validator = require("../utils/validator");

// create enquiry
contactUsRouter.post("/create-enquiry", validator.validateContactUS, contactUsController.createEnquiry);

// get enquiry
contactUsRouter.get("/all-enquiry", contactUsController.allEnquiry);
contactUsRouter.post("/search-enquiry", contactUsController.searchEnquiry);


module.exports = contactUsRouter;