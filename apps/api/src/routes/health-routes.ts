import express from "express";
import { healthController } from "../controllers/health-controller.js";

const healthRouter = express.Router();

healthRouter.get("/", healthController.check);

export default healthRouter;
