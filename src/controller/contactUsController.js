const Contact = require("../model/contactUsModel");

const catchAsyncError = require("../utils/catchAsyncError");
const { sendResponse } = require("../utils/commonFunctions");
const { aggreFilters } = require("../utils/filterJson");
const { errorMessages } = require("../utils/messages");

exports.createEnquiry = catchAsyncError(async (req, res) => {
  let enquiry;
  const { name, email, contact, postType, topic, message } = req.body;

  enquiry = {
    name,
    email,
    contact,
    postType,
    topic,
    message,
  };

  enquiry = await Contact.create(enquiry);

  if (enquiry)
    return sendResponse(res, 200, {
      data: enquiry,
      msg: errorMessages.enquiry.created,
    });

  return sendResponse(res, 200, { msg: errorMessages.other.InternServErr });
});

exports.allEnquiry = catchAsyncError(async (req, res) => {
    let allEnquiries;

    allEnquiries = await Contact.find({}).sort({createdAt: -1})

    return sendResponse(res, 200, {data: allEnquiries})
})