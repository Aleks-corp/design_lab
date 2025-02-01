export const nextDate = (currentDate: Date) => {
  const datetime = currentDate.getTime();
  const nextDay =
    new Date(datetime).getDate() > 28 ? 28 : new Date(datetime).getDate();
  const currentMonth =
    new Date(datetime).getMonth() === 11
      ? 0
      : new Date(datetime).getMonth() + 1;
  const nextMonth =
    new Date(datetime).getMonth() === 11
      ? 1
      : new Date(datetime).getMonth() + 2;
  const nextYear =
    new Date(datetime).getMonth() === 11
      ? new Date(datetime).getFullYear() + 1
      : new Date(datetime).getFullYear();
  const nextDate = `${nextDay < 10 ? `0` + nextDay : nextDay}.${
    nextMonth < 10 ? `0` + nextMonth : nextMonth
  }.${nextYear}`;
  const dateEnd = `${nextDay < 10 ? `0` + nextDay : nextDay}.${
    nextMonth < 10 ? `0` + currentMonth : currentMonth
  }.${nextYear + 2}`;
  return { nextDate, dateEnd };
};
