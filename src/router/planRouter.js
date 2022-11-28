const express = require('express')
const planRouter = express.Router()

const planController = require("../controller/planController");

planRouter.get("/get-all-plans", planController.getAllPlan);
planRouter.post("/create-new-plan", planController.createPlan);
planRouter.post("/update-plan", planController.updatePlan);
planRouter.post("/delete-plan", planController.deletePlan);


module.exports = planRouter;