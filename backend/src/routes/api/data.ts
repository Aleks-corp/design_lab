import express from "express";
import { dataController } from "../../controllers/index";

const { getDateForSale } = dataController;

const dataRouter = express.Router();

dataRouter.get("/date-for-sale", getDateForSale);

export default dataRouter;
