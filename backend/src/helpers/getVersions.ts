import { S3Client, ListObjectVersionsCommand } from "@aws-sdk/client-s3";

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

export const getObjectVersions = async (key: string) => {
  const command = new ListObjectVersionsCommand({
    Bucket: S3_BUCKET_NAME,
  });

  const response = await s3.send(command);
  const versions = response.Versions || [];

  const objectVersions = versions.filter((version) => version.Key === key);
  return objectVersions;
};
