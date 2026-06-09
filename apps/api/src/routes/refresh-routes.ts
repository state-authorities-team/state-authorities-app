import express from "express";
import { kmuRefreshController } from "../controllers/kmu-refresh-controller.js";
import { checkRole, requireAuth } from "../middlewares/auth-middleware.js";

const refreshRouter = express.Router();

refreshRouter.post("/", requireAuth, checkRole(["ADMIN"]), kmuRefreshController.handle);

export default refreshRouter;
