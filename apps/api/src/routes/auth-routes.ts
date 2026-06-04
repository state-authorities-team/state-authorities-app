import express from "express";
import * as authController from "../controllers/auth-controller.js";
import { validateBody } from "../middlewares/validate-body.js";
import { registrationSchema } from "../schemas/auth-schema.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registrationSchema), authController.register);

export default authRouter;
