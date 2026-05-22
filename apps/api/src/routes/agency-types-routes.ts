import express from "express";
import * as agencyTypeController from "../controllers/agency-type-controller.js";

const agencyTypeRouter = express.Router();

agencyTypeRouter.get("/", agencyTypeController.getAll);

export default agencyTypeRouter;
