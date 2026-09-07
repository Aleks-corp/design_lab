import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";
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

export const generatePresignedUrl = async (file: string) => {
  // Accept only a bare file name — strip any path so a client can't inject
  // an arbitrary S3 key (e.g. "../", leading "/", nested folders).
  const baseName =
    typeof file === "string" ? file.replace(/^.*[\\/]/, "").trim() : "";

  if (!baseName || !/^[\w .()-]+$/.test(baseName)) {
    throw ApiError(400, "Invalid file name");
  }

  const dotIndex = baseName.lastIndexOf(".");
  const fileExtension = dotIndex > 0 ? baseName.substring(dotIndex) : "";
  const stem = dotIndex > 0 ? baseName.substring(0, dotIndex) : baseName;
  const newFileName = `${stem}-${nanoid()}${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: newFileName,
  });
  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return signedUrl;
};
