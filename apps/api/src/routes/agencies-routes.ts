import express from "express";
import { uploadCsvMiddleware } from "../configs/multer-config.js";
import * as agencyController from "../controllers/agency-controller.js";
import { isValidId } from "../middlewares/is-valid-id.js";
import { validateBody as validate } from "../middlewares/validate-body.js";
import { validateQuery } from "../middlewares/validate-query.js";
import {
  createAgencySchema,
  getAgencyQuerySchema,
  updateAgencySchema,
} from "../schemas/agency.schema.js";

const agencyRouter = express.Router();

agencyRouter.get("/", validateQuery(getAgencyQuerySchema), agencyController.getAll);
agencyRouter.post("/", validate(createAgencySchema), agencyController.create);
agencyRouter.put("/:id", isValidId, validate(updateAgencySchema), agencyController.update);
agencyRouter.get("/:id", isValidId, agencyController.getById);
agencyRouter.delete("/:id", isValidId, agencyController.remove);
agencyRouter.post(
  "/import-csv",
  uploadCsvMiddleware.single("file"),
  agencyController.importFromCsv,
);

export default agencyRouter;
