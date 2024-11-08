import multer from "multer";
import path from "path";

const tempPash = path.resolve("temp");

const storage = multer.diskStorage({
  destination: tempPash,
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const limits = {
  fileSize: 1024 * 1024 * 2,
};

const upload = multer({ storage, limits });
export default upload;
