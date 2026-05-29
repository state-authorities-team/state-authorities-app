import express from "express";
import { uploadCsvMiddleware } from "../configs/multer-config.js";
import * as agencyController from "../controllers/agency-controller.js";

const agencyRouter = express.Router();

agencyRouter.get("/", agencyController.getAll);
agencyRouter.post("/", agencyController.create);
agencyRouter.put("/:id", agencyController.update);
agencyRouter.get("/:id", agencyController.getById);
agencyRouter.delete("/:id", agencyController.remove);
agencyRouter.post(
  "/import-csv",
  uploadCsvMiddleware.single("file"),
  agencyController.importFromCsv,
);

export default agencyRouter;
