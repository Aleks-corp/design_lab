export const registrationSale = (saleDate: number) => {
  const currentDate = new Date().getTime();
  const registerSale = {
    substart: new Date(currentDate),
    subend: new Date(
      new Date(currentDate).setDate(new Date(currentDate).getDate() + saleDate)
    ),
    orderReference: "registrationSale",
  };
  return registerSale;
};
