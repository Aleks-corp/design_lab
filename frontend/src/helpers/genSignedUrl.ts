import { instance } from "../api/axios";

export const generatePresignedUrl = async (
  imageFiles: File[],
  downloadFile: File | null
) => {
  const { data } = await instance.post("/posts/generate-presigned-url", {
    files: [
      ...imageFiles.map((file) => file.name),
      downloadFile ? downloadFile.name : "",
    ],
  });
  const signedUrls: string[] = data.signedUrls;
  return signedUrls;
};
