import express from "express";
import { uploadCsvMiddleware } from "../configs/multer-config.js";
import * as agencyTypeController from "../controllers/agency-type-controller.js";

const agencyTypeRouter = express.Router();

agencyTypeRouter.get("/", agencyTypeController.getAll);
agencyTypeRouter.get("/export", agencyTypeController.exportCsv);
agencyTypeRouter.post(
  "/import-csv",
  uploadCsvMiddleware.single("file"),
  agencyTypeController.importFromCsv,
);

export default agencyTypeRouter;
