import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import "dotenv/config";
import ApiError from "./ApiError";
import { getObjectVersions } from "./getVersions";

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
    const baseUrl = `https://${S3_BUCKET_NAME}.s3.eu-central-003.backblazeb2.com/`;
    if (!fileUrl.startsWith(baseUrl)) {
      console.log("Invalid S3 URL");
      throw new Error("Invalid S3 URL");
    }

    const key = fileUrl.replace(baseUrl, "");
    console.log(" key:", key);
    if (!key) {
      console.log("Failed to extract the file key from URL");
      throw new Error("Failed to extract the file key from URL");
    }
    const versions = await getObjectVersions(key);
    const versionId = versions.length > 0 ? versions[0].VersionId : undefined;
    console.log(" versionId:", versionId);
    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: key,
      ...(versionId && { VersionId: versionId }),
    };

    const command = new DeleteObjectCommand(params);
    const result = await s3.send(command);
    console.log("result:", result);
  } catch (err) {
    console.error("Error deleting file from S3:", err);
    throw ApiError(404, "Error deleting file from S3");
  }
};

export default deleteFromS3;
