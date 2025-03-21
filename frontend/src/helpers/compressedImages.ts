import { fromBlob } from "image-resize-compress";

const сompressImage = async (file: File) => {
  const quality = 70; // For webp and jpeg formats
  const width = 1800; // Original width
  const height = "auto"; // Original height
  const format = "webp";

  const resizedBlob = await fromBlob(file, quality, width, height, format);
  const resizedFile = new File(
    [resizedBlob],
    file.name.replace(/\.\w+$/, ".webp"),
    {
      type: "image/webp",
    }
  );
  return resizedFile;
};

export default сompressImage;
