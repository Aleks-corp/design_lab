import multer from "multer";
// import path from "path";

// const imgUploadPath = path.resolve("public/post-img");
// const fileUploadPath = path.resolve("public/file");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase();
//     if (ext === ".zip") {
//       cb(null, fileUploadPath);
//     } else {
//       cb(null, imgUploadPath);
//     }
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//     cb(null, `${uniqueSuffix}-${file.originalname}`);
//   },
// });

const limits = {
  fileSize: 1024 * 1024 * 1024 * 2,
};

// const upload = multer({
//   storage,
//   limits,
// }).fields([
//   { name: "imagefiles", maxCount: 4 },
//   { name: "downloadfile", maxCount: 1 },
// ]);

const storage = multer.memoryStorage();
const upload = multer({ storage, limits }).fields([
  { name: "imagefiles", maxCount: 4 },
  { name: "downloadfile", maxCount: 1 },
]);

export default upload;
