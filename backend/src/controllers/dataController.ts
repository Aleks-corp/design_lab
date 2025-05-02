import { Request, Response } from "express";
import { ctrlWrapper } from "src/decorators";
import { DATE_FOR_SALE } from "src/constants/saleConstant";

const getDateForSale = async (req: Request, res: Response) => {
  //   const {dateForSale} = await Data.find();

  res.json({ dateForSale: DATE_FOR_SALE });
};
export default {
  getDateForSale: ctrlWrapper(getDateForSale),
};
