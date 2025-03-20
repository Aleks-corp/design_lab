import CompressImage from "./compressedImages";

export const handleImageFileChange = async (
  e: React.ChangeEvent<HTMLInputElement>,
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>
) => {
  const maxFiles = 8;
  const maxSize = 8 * 1024 * 1024;
  const files = e.target.files ? Array.from(e.target.files) : [];
  if (files.length > maxFiles) {
    alert(`Maximum number of files is ${maxFiles}`);
    return;
  }
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  if (totalSize > maxSize) {
    alert(`Total file size exceeds the limit of 8MB.`);
    return;
  }
  try {
    const resizedFiles = await Promise.all(
      files.map((file) => CompressImage(file))
    );
    setImageFiles(resizedFiles);
  } catch (error) {
    console.error("Error compressing images:", error);
  }
};

export const handleFileChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setDownloadFile: React.Dispatch<React.SetStateAction<File | null>>
) => {
  const maxFileSize = 2000 * 1024 * 1024;
  if (e.target.files) {
    const file = e.target.files[0];

    if (file.size > maxFileSize) {
      alert("File size exceeds the maximum limit of 2GB.");
      return;
    }
    setDownloadFile(file);
  }
};
