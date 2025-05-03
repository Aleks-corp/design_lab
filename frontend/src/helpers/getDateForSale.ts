import { instance } from "../api/axios";

export const getDateForSale = async () => {
  try {
    const { data }: { data: { dateForSale: number | string } } =
      await instance.get("/data/date-for-sale");
    const parsed = Number(data.dateForSale);
    return isNaN(parsed) ? 1 : parsed;
  } catch (error) {
    console.error("Error in getDateForSale:", error);
    return 1;
  }
};
