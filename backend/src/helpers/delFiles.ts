import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import "dotenv/config";
import ApiError from "./ApiError";

const {
  S3_BUCKET_NAME,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  BACKBLAZE_ENDPOINT,
} = process.env;

const s3 = new S3Client({
  endpoint: BACKBLAZE_ENDPOINT,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!,
  },
});

const deleteFromS3 = async (fileUrl: string) => {
  try {
    const bucketName = S3_BUCKET_NAME;
    const baseUrl = `https://${bucketName}.s3.eu-central-003.backblazeb2.com/`;
    if (!fileUrl.startsWith(baseUrl)) {
      throw new Error("Invalid S3 URL");
    }

    const key = fileUrl.replace(baseUrl, "");
    if (!key) {
      throw new Error("Failed to extract the file key from URL");
    }

    const params = {
      Bucket: bucketName!,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);
  } catch (err) {
    console.error("Помилка при видаленні файлу з S3:", err);
    throw ApiError(404, "Error deleting file from S3");
  }
};

export default deleteFromS3;
