const mongoose = require("mongoose");

const sendResponse = require("../utils/commonFunctions");
const Plan = require("../model/plan");
const catchAsyncError = require("../utils/catchAsyncError");

exports.createPlan = catchAsyncError(async (req, res) => {
  const { planName, planPrice, isActive } = req.body;
  const existingPlan = await Plan.findOne({ planName: planName });

  if (existingPlan) {
    return sendResponse(res, 200, {
      msg: "Plan Already Created",
      success: true,
    });
  }

  console.log(req.body);
  // await Plan.create({
  //   planName: planName,
  //   planPrice: planPrice,
  //   isActive: isActive,
  // })
  //   .then((res) => {
  //     return sendResponse(res, 200, { msg: "Plan created", success: true });
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //     return sendResponse(res, 500, {
  //       msg: "Plan not created",
  //       success: false,
  //     });
  //   });

  res.send("working")
});

exports.updatePlan = catchAsyncError(async (req, res) => {
  const { planName, planPrice, isActive, planID } = req.body;
  if (!mongoose.isValidObjectId(planID)) {
    return sendResponse(res, 400, { msg: "not a valid ID", success: true });
  }
  const existingPlan = await Plan.findOne({ _id: planID });
  if (!existingPlan) {
    return sendResponse(res, 400, {
      msg: "plan does not exist",
      success: false,
    });
  }

if(!planName && !planPrice && !isActive) {
    return sendResponse(res, 400, {
        msg: "Please Provide all the values",
        success: false,
      });
}

  await Plan.updateOne(
    { _id: planID },
    valuetobeupdated,
    { new: true },
    (e) => {
      if (!e)
        return sendResponse(res, 200, {
          msg: "plan updated",
          success: true,
        });

      return sendResponse(res, 400, {
        msg: "plan not updated",
        success: false,
      });
    }
  );
});

exports.deletePlan = catchAsyncError(async(req, res) => {
    const {planID} = req.body;
    if (!mongoose.isValidObjectId(planID)) {
        return sendResponse(res, 400, { msg: "not a valid ID", success: true });
      }
      const existingPlan = await Plan.findOne({ _id: planID });
      if (!existingPlan) {
        return sendResponse(res, 400, {
          msg: "plan does not exist",
          success: false,
        });
      }
      await Plan.updateOne(
        { _id: planID },
        {isActive: false},
        { new: true },
        (e) => {
          if (!e)
            return sendResponse(res, 200, {
              msg: "plan deleted",
              success: true,
            });
    
          return sendResponse(res, 400, {
            msg: "plan not deleted",
            success: false,
          });
        }
      );
})

exports.getAllPlan = catchAsyncError(async(req, res) => {
  const allPlans = await Plan.find({isActive: true});
  return sendResponse(res, 200, {
    msg: allPlans,
    success: true,
  });
})