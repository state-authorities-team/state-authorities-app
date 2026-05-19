import dotenv from "dotenv";
import express from "express";
import agencyRouter from "./routes/agencies-routes.js";
import agencyTypeRouter from "./routes/agency-types-routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use("/api/agencies", agencyRouter);
app.use("/api/agency-types", agencyTypeRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});
