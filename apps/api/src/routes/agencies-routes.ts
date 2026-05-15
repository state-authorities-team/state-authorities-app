import express from "express";
import * as agencyController from "../controllers/agency-controller.js";

const agencyRouter = express.Router();

agencyRouter.get("/", agencyController.getAll);

export default agencyRouter;
