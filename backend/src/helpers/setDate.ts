export const nextDate = (datetime: number) => {
  const currentDate = new Date(datetime);
  const nextDay = currentDate.getDate() > 28 ? 28 : currentDate.getDate();
  const nextMonth =
    currentDate.getMonth() === 11 ? 1 : currentDate.getMonth() + 2;
  const nextYear =
    currentDate.getMonth() === 11
      ? currentDate.getFullYear() + 1
      : currentDate.getFullYear();
  const dateEndString = `${nextYear}-${
    nextMonth < 10 ? `0` + nextMonth : nextMonth
  }-${nextDay < 10 ? `0` + nextDay : nextDay}T09:00:00`;
  const dateEnd = new Date(dateEndString);
  return dateEnd;
};

export const dateBegin = (datetime: number) => {
  const currentDate = new Date(datetime);

  currentDate.setMonth(
    currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1
  );

  return new Date(currentDate);
};
