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

  allEnquiries = await Contact.aggregate([
    {
      $facet: {
        mainDoc: [{ $match: {} }],
        totalCount: [{ $match: {} }, { $count: "total" }],
      },
    },
    {
      $addFields: {
        totalCount: {
          $ifNull: [{ $arrayElemAt: ["$totalCount.total", 0] }, 0],
        },
      },
    },
  ]);

  return sendResponse(res, 200, { data: allEnquiries });
});

exports.searchEnquiry = catchAsyncError(async (req, res) => {
  let searchedContacts;
  const { searchTerm, page, limit } = req.body;

  const pageOptions = {
    skipVal: (parseInt(page) - 1 || 0) * (parseInt(limit) || 30),
    limitVal: parseInt(limit) || 30,
  };

  searchedContacts = {
    $match: {
      $or: [
        { email: new RegExp(searchTerm, "i") },
        { contact: new RegExp(searchTerm, "i") },
        { name: new RegExp(searchTerm, "i") },
      ],
    },
  };

  searchedContacts = await Contact.aggregate([
    {
      $facet: {
        mainDoc: [searchedContacts],
        totalCount: [searchedContacts, { $count: "total" }],
      },
    },
    {
      $addFields: {
        totalCount: {
          $ifNull: [{ $arrayElemAt: ["$totalCount.total", 0] }, 0],
        },
      },
    },
  ]);

  if (searchedContacts)
    return sendResponse(res, 200, { data: searchedContacts });
});
