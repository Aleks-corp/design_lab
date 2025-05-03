import { useState } from "react";
import { generatePresignedUrl } from "../helpers/genSignedUrl";
import { uploadDownLoadFile, uploadImgFiles } from "../helpers/uploadFile";
import { FileUploadProgress } from "../types/upload.types";
import toast from "react-hot-toast";

export const useUploadFiles = () => {
  const [imgUploadProgress, setImgUploadProgress] = useState<
    FileUploadProgress[]
  >([]);
  const [fileUploadProgress, setFileUploadProgress] =
    useState<FileUploadProgress>({ fileName: "", progress: 0 });
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadFiles = async (imageFiles: File[], downloadFile: File) => {
    try {
      const signedUrls = await generatePresignedUrl(imageFiles, downloadFile);

      const { uploadedImageUrls, uploadImgPromises } = await uploadImgFiles(
        imageFiles,
        signedUrls,
        setImgUploadProgress
      );

      const { uploadedFileUrl, uploadFilePromises } = await uploadDownLoadFile(
        downloadFile,
        signedUrls,
        imageFiles,
        setFileUploadProgress
      );

      await Promise.all([...uploadImgPromises, ...uploadFilePromises]);

      return { uploadedImageUrls, uploadedFileUrl };
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError("An error occurred during upload.");
      toast.error("Upload failed. Try again.");
      return null;
    }
  };
  const clearUploadError = () => setUploadError(null);

  const resetProgress = () => {
    setFileUploadProgress({ fileName: "", progress: 0 });
    setImgUploadProgress([]);
  };

  return {
    uploadFiles,
    imgUploadProgress,
    fileUploadProgress,
    uploadError,
    clearUploadError,
    resetProgress,
  };
};
