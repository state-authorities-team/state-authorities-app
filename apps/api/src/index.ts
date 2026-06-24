import dotenv from "dotenv";
import app from "./app.js";
import { logger } from "./configs/logger-config.js";
import { NewsCronManager } from "./modules/news-aggregator/cron/news-cron.js";

dotenv.config();

const PORT = process.env.PORT ?? 3000;

const newsCron = new NewsCronManager();
app.listen(PORT, () => {
  logger.info(`Server is running on ${PORT} port`);
  newsCron.initScheduleSync();
});
