import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { nanoid } from "nanoid";

const { S3_BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } =
  process.env;

const s3 = new S3Client({
  endpoint: `https://s3.eu-central-003.backblazeb2.com`,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!,
  },
});

export const generatePresignedUrl = async (file: string) => {
  // const fileExtension = file.substring(file.lastIndexOf("."));
  // const newFileName = `${file.substring(
  //   0,
  //   file.lastIndexOf(".")
  // )}-${nanoid()}${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: file,
  });
  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return signedUrl;
};
