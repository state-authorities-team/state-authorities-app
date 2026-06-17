import express from "express";
import { check } from "../controllers/health-controller.js";

const healthRouter = express.Router();

healthRouter.get("/", check);

export default healthRouter;
