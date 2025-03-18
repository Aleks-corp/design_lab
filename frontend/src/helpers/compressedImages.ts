import { fromBlob } from "image-resize-compress";

const сompressImage = async (file: File) => {
  const quality = 80; // For webp and jpeg formats
  const width = 1800; // Original width
  const height = "auto"; // Original height
  const format = "webp";

  const resizedBlob = await fromBlob(file, quality, width, height, format);
  const resizedFile = new File([resizedBlob], file.name, {
    type: resizedBlob.type,
  });
  return resizedFile;
};

export default сompressImage;
