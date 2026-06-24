import express from "express";
import { kmuRefreshController } from "../controllers/kmu-refresh-controller.js";
import { checkRoleMiddleware, requireAuthMiddleware } from "../middlewares/auth-middleware.js";

const refreshRouter = express.Router();

refreshRouter.post(
  "/",
  requireAuthMiddleware,
  checkRoleMiddleware(["ADMIN"]),
  kmuRefreshController.handle,
);

export default refreshRouter;
