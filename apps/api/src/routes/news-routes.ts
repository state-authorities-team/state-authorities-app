import express from "express";
import { getNewsByAgencyHandler } from "../controllers/news-controller.js";
import { validateQuery } from "../middlewares/validate-query.js";
import { getNewsQuerySchema } from "../schemas/news-schema.js";

const newsRouter = express.Router({ mergeParams: true });

newsRouter.get("/", validateQuery(getNewsQuerySchema), getNewsByAgencyHandler);

export default newsRouter;
