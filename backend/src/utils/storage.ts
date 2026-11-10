import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// Check if R2 is configured
const isR2Configured = !!(
  process.env.R2_ACCOUNT_ID &&
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY &&
  process.env.R2_BUCKET_NAME &&
  process.env.R2_PUBLIC_URL
);

// Initialize S3 client for R2 if configured
let s3Client: S3Client | null = null;

if (isR2Configured) {
  s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID!}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

export const uploadImage = async (
  buffer: Buffer,
  filename: string,
  publicBaseUrl?: string
): Promise<string> => {
  // Process image with sharp
  const processedBuffer = await sharp(buffer)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  // Use R2 if configured, otherwise fall back to local storage
  if (isR2Configured && s3Client) {
    return uploadToR2(processedBuffer, filename);
  }
  return uploadToLocal(processedBuffer, filename, publicBaseUrl);
};

const uploadToR2 = async (buffer: Buffer, filename: string): Promise<string> => {
  if (!s3Client || !process.env.R2_BUCKET_NAME || !process.env.R2_PUBLIC_URL) {
    throw new Error('R2 not properly configured');
  }

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: filename,
    Body: buffer,
    ContentType: 'image/webp',
  });

  await s3Client.send(command);

  return `${process.env.R2_PUBLIC_URL}/${filename}`;
};

const uploadToLocal = async (buffer: Buffer, filename: string, publicBaseUrl?: string): Promise<string> => {
  const uploadsDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const outputPath = path.join(uploadsDir, filename);
  await fs.promises.writeFile(outputPath, buffer);

  // Build an absolute URL so it passes API validation (z.string().url())
  // and renders correctly in <NuxtImg> on the frontend.
  const base = (publicBaseUrl || process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 3000}`).replace(/\/+$/, '');
  return `${base}/uploads/${filename}`;
};
