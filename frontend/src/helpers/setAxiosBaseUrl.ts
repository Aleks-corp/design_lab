export async function setAxiosBaseUrl(): Promise<string> {
  try {
    const host: string = import.meta.env.VITE_BASE_URL;
    return host;
  } catch (error) {
    console.error("Failed to fetch environment variables:", error);
    return "http://localhost:3000";
  }
}
