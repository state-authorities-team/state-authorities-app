import express from "express";
import * as agencyTypeController from "../controllers/agency-type-controller.js";

const agencyTypeRouter = express.Router();

agencyTypeRouter.get("/", agencyTypeController.getAll);
agencyTypeRouter.get("/export", agencyTypeController.exportCsv);

export default agencyTypeRouter;
