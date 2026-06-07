import express from "express";
import { uploadCsvMiddleware } from "../configs/multer-config.js";
import * as agencyController from "../controllers/agency-controller.js";
import { checkRole, requireAuth } from "../middlewares/auth-middleware.js";
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
agencyRouter.get("/:id", isValidId, agencyController.getById);

agencyRouter.post(
  "/import-csv",
  requireAuth,
  checkRole(["ADMIN"]),
  uploadCsvMiddleware.single("file"),
  agencyController.importFromCsv,
);

agencyRouter.post(
  "/",
  requireAuth,
  checkRole(["ADMIN"]),
  validate(createAgencySchema),
  agencyController.create,
);
agencyRouter.put(
  "/:id",
  requireAuth,
  checkRole(["ADMIN"]),
  isValidId,
  validate(updateAgencySchema),
  agencyController.update,
);
agencyRouter.delete("/:id", requireAuth, checkRole(["ADMIN"]), isValidId, agencyController.remove);

export default agencyRouter;
