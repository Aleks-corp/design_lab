import AWS from "aws-sdk";
import "dotenv/config";

const { S3_BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } =
  process.env;

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

const deleteFromS3 = async (fileUrl: string) => {
  try {
    const bucketName = S3_BUCKET_NAME;
    const key = fileUrl.split(`${bucketName}/`)[1]; // Витягуємо ключ файлу після імені бакету

    if (!key) throw new Error("Invalid S3 URL");

    const params = {
      Bucket: bucketName!,
      Key: key,
    };

    await s3.deleteObject(params).promise();
    console.log(`File deleted from S3: ${fileUrl}`);
  } catch (err) {
    console.error("Помилка при видаленні файлу з S3:", err);
    throw new Error("Error deleting file from S3");
  }
};

export default deleteFromS3;
