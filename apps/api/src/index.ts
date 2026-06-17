import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { logger } from "./configs/logger-config.js";
import { setupSwaggerDocs } from "./configs/swagger-config.js";
import errorHandler from "./middlewares/errorHandler.js";
import { httpLoggerMiddleware } from "./middlewares/logger-middleware.js";
import { NewsCronManager } from "./modules/news-aggregator/cron/news-cron.js";
import agencyRouter from "./routes/agencies-routes.js";
import agencyTypeRouter from "./routes/agency-types-routes.js";
import authRouter from "./routes/auth-routes.js";
import healthRouter from "./routes/health-routes.js";
import refreshRouter from "./routes/refresh-routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

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
app.use(errorHandler);

// const newsCron = new NewsCronManager();
app.listen(PORT, () => {
  logger.info(`Server is running on ${PORT} port`);
  if (!process.env.AI_API_KEY) {
    logger.warn(
      "AI_API_KEY is not defined. The smart news aggregator will operate in standard Cheerio-only mode",
    );
  }

  // newsCron.initScheduleSync();
});
