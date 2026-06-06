import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import errorHandler from "./middlewares/errorHandler.js";
import agencyRouter from "./routes/agencies-routes.js";
import agencyTypeRouter from "./routes/agency-types-routes.js";
import authRouter from "./routes/auth-routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(
  cors({
    origin: "http://localhost:5175",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/agencies", agencyRouter);
app.use("/api/agency-types", agencyTypeRouter);
app.use("/api/auth", authRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});
