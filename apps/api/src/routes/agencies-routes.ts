import express from "express";
import * as agencyController from "../controllers/agency-controller.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const agencyRouter = express.Router();

agencyRouter.get("/", asyncHandler(agencyController.getAll));

export default agencyRouter;
