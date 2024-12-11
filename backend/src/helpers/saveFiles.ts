import { v4 as uuidv4 } from "uuid";
import path from "path";
import AWS from "aws-sdk";
import "dotenv/config";

const { S3_BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } =
  process.env;

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});
const uploadToS3 = async (file: Express.Multer.File, folder: string) => {
  const fileContent = file.buffer; // Якщо ви використовуєте Multer з buffer
  const fileName = `${folder}/${uuidv4()}-${path.basename(file.originalname)}`;

  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
    ContentType: file.mimetype,
  };

  try {
    const { Location } = await s3.upload(params).promise();
    return Location; // Повертаємо посилання на файл у S3
  } catch (err) {
    console.error("Помилка при завантаженні в S3:", err);
    throw new Error("Error uploading to S3");
  }
};
export default uploadToS3;
