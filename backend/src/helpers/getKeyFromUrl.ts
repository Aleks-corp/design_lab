export const getKeyFromUrl = (fileUrl: string) => {
  if (!fileUrl || typeof fileUrl !== "string") {
    return "";
  }
  try {
    const url = new URL(fileUrl);
    return url.pathname.slice(1);
  } catch {
    // Already a bare key (or malformed) — return as-is without the leading slash.
    return fileUrl.replace(/^\/+/, "");
  }
};
