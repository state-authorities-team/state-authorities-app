import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { setupSwaggerDocs } from "./configs/swagger-config.js";
import errorHandlerMiddleware from "./middlewares/error-handler.js";
import { httpLoggerMiddleware } from "./middlewares/logger-middleware.js";
import agencyRouter from "./routes/agencies-routes.js";
import agencyTypeRouter from "./routes/agency-types-routes.js";
import authRouter from "./routes/auth-routes.js";
import healthRouter from "./routes/health-routes.js";
import refreshRouter from "./routes/refresh-routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(httpLoggerMiddleware);
setupSwaggerDocs(app);
app.use("/api/agencies", agencyRouter);
app.use("/api/agency-types", agencyTypeRouter);
app.use("/api/auth", authRouter);
app.use("/api/health", healthRouter);
app.use("/api/refresh", refreshRouter);
app.use(errorHandlerMiddleware);

export default app;
