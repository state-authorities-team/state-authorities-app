import express from "express";
import { uploadCsvMiddleware } from "../configs/multer-config.js";
import * as agencyController from "../controllers/agency-controller.js";
import { checkRoleMiddleware, requireAuthMiddleware } from "../middlewares/auth-middleware.js";
import { isValidIdMiddleware } from "../middlewares/is-valid-id.js";
import { validateBodyMiddleware } from "../middlewares/validate-body.js";
import { validateQueryMiddleware } from "../middlewares/validate-query.js";
import {
  createAgencySchema,
  getAgencyQuerySchema,
  updateAgencySchema,
} from "../schemas/agency-schema.js";
import newsRouter from "./news-routes.js";

const agencyRouter = express.Router();

agencyRouter.get("/", validateQueryMiddleware(getAgencyQuerySchema), agencyController.getAll);
agencyRouter.get("/export", agencyController.exportCsv);
agencyRouter.get("/:id", isValidIdMiddleware, agencyController.getById);

agencyRouter.post(
  "/import-csv",
  requireAuthMiddleware,
  checkRoleMiddleware(["ADMIN"]),
  uploadCsvMiddleware.single("file"),
  agencyController.importFromCsv,
);

agencyRouter.post(
  "/",
  requireAuthMiddleware,
  checkRoleMiddleware(["ADMIN"]),
  validateBodyMiddleware(createAgencySchema),
  agencyController.create,
);
agencyRouter.put(
  "/:id",
  requireAuthMiddleware,
  checkRoleMiddleware(["ADMIN"]),
  isValidIdMiddleware,
  validateBodyMiddleware(updateAgencySchema),
  agencyController.update,
);
agencyRouter.delete(
  "/:id",
  requireAuthMiddleware,
  checkRoleMiddleware(["ADMIN"]),
  isValidIdMiddleware,
  agencyController.remove,
);

agencyRouter.use("/:id/news", isValidIdMiddleware, newsRouter);

export default agencyRouter;
