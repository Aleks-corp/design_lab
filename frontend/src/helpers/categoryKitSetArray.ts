interface Items {
  [x: string]: boolean;
}
export const setArrayString = (items: Items[]) => {
  const arrayOfString = items
    .map((i) => {
      if (Object.values(i)[0] === true) {
        return Object.keys(i)[0];
      }
      return null;
    })
    .filter((item) => item !== null);
  return arrayOfString;
};
