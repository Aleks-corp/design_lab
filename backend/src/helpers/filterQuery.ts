const filterQuery = (query: any) => {
  const allowedFields = ["title", "category", "tags"]; // Поля, які можна використовувати у фільтрах
  const filteredQuery: Record<string, any> = {};

  for (const key in query) {
    if (allowedFields.includes(key)) {
      filteredQuery[key] = query[key];
    }
  }

  return filteredQuery;
};

export default filterQuery;
