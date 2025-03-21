export const cleanImageFileName = (fileName: string) => {
  let cleanedName = fileName.replace(/\s+/g, "-");
  cleanedName = cleanedName.replace(/[^a-zA-Z0-9-_.]/g, "");
  cleanedName = cleanedName.replace(/[а-яА-ЯёЁ]/g, "");
  const prefixedName = `img-${cleanedName}`;
  return prefixedName;
};

export const cleanDownloadFileName = (fileName: string) => {
  let cleanedName = fileName.replace(/\s+/g, "-");
  cleanedName = cleanedName.replace(/[^a-zA-Z0-9-_.]/g, "");
  cleanedName = cleanedName.replace(/[а-яА-ЯёЁ]/g, "");
  const prefixedName = `file-${cleanedName}`;
  return prefixedName;
};
