export const registrationSale = () => {
  const currentDate = new Date().getTime();
  const saleDate = 3;
  const registerSale = {
    substart: new Date(currentDate),
    subend: new Date(
      new Date(currentDate).setDate(new Date(currentDate).getDate() + saleDate)
    ),
    orderReference: "registrationSale",
  };
  return registerSale;
};
