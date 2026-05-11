import dotenv from "dotenv";
import type { Request, Response } from "express";
import express from "express";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    codeStatus: 200,
    message: "Server is working",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});
