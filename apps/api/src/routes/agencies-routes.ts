import express from "express";
import * as agencyController from "../controllers/agency-controller.js";

const agencyRouter = express.Router();

agencyRouter.get("/", agencyController.getAll);
agencyRouter.post("/", agencyController.create);
agencyRouter.put("/:id", agencyController.update);
agencyRouter.delete("/:id", agencyController.remove);

export default agencyRouter;
