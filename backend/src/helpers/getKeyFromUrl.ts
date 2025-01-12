export const getKeyFromUrl = (fileUrl: string) => {
  const url = new URL(fileUrl);
  return url.pathname.slice(1);
};
