import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

export const generateSignedUrlImage = async (file: string) => {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: file,
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return signedUrl;
};

export const generateSignedUrlFile = async (file: string) => {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: file,
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 600 });
  return signedUrl;
};
