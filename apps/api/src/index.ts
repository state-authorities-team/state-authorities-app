import dotenv from "dotenv";
import express from "express";
import agencyRouter from "./routes/agencies-routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use("/api/agencies", agencyRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});
