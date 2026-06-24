import express from "express";
import * as authController from "../controllers/auth-controller.js";
import { validateBodyMiddleware } from "../middlewares/validate-body.js";
import { loginSchema, registrationSchema } from "../schemas/auth-schema.js";

const authRouter = express.Router();

authRouter.post("/register", validateBodyMiddleware(registrationSchema), authController.register);
authRouter.post("/login", validateBodyMiddleware(loginSchema), authController.login);
authRouter.post("/logout", authController.logout);
export default authRouter;
