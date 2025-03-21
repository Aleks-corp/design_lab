import axios from "axios";
import { FileUploadProgress } from "../types/upload.types";
import toast from "react-hot-toast";

export const uploadImgFiles = async (
  imageFiles: File[],
  signedUrls: string[],
  setImgUploadProgress: React.Dispatch<
    React.SetStateAction<FileUploadProgress[]>
  >
) => {
  const uploadImgPromises: Promise<void>[] = [];
  const uploadedImageUrls: string[] = [];
  imageFiles.forEach((file, index) => {
    const url = signedUrls[index];
    const uploadPromise = axios
      .put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setImgUploadProgress((prev) => {
              const newProgress = [...prev];
              const existingIndex = newProgress.findIndex(
                (item) => item.fileName === file?.name
              );

              if (existingIndex !== -1) {
                newProgress[existingIndex].progress = percent;
              } else {
                newProgress.push({
                  fileName: file?.name || "",
                  progress: percent,
                });
              }
              return newProgress;
            });
          }
        },
      })
      .then(() => {
        uploadedImageUrls[index] = url.split("?")[0];
      })
      .catch((error) => {
        toast.error(`Failed to upload image ${file.name}`);
        console.error(`Failed to upload image ${file.name}:`, error);
      });

    uploadImgPromises.push(uploadPromise.then(() => {}));
  });
  await Promise.all(uploadImgPromises);
  return { uploadedImageUrls, uploadImgPromises };
};

export const uploadDownLoadFile = async (
  downloadFile: File | null,
  signedUrls: string[],
  imageFiles: File[],
  setFileUploadProgress: React.Dispatch<
    React.SetStateAction<FileUploadProgress>
  >
): Promise<{
  uploadedFileUrl: string;
  uploadFilePromises: Promise<void>[];
}> => {
  const uploadFilePromises: Promise<void>[] = [];
  const url = signedUrls[imageFiles.length];
  let uploadedFileUrl = "";
  if (downloadFile) {
    const uploadPromise = axios
      .put(url, downloadFile, {
        headers: {
          "Content-Type": downloadFile.type,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setFileUploadProgress({
              fileName: downloadFile?.name || "",
              progress: percent,
            });
          }
        },
      })
      .then(() => {
        uploadedFileUrl = url.split("?")[0];
      })
      .catch((error) => {
        toast.error(`Failed to upload image ${downloadFile.name}`);
        console.error(`Failed to upload file ${downloadFile.name}:`, error);
      });

    uploadFilePromises.push(uploadPromise);
  }

  await Promise.all(uploadFilePromises);

  return { uploadedFileUrl, uploadFilePromises };
};
