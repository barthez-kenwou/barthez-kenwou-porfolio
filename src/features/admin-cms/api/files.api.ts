import { apiClient } from '@/shared/api';
import { compressImageFile, type CompressImageOptions } from '@/shared/lib/compressImage';

export type PresignedUpload = {
  url: string;
  key: string;
  expiresIn: number;
  publicUrl: string;
};

/** Docker / LAN hosts that the browser can never reach (and CSP will block). */
const INTERNAL_UPLOAD_HOST = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|seaweed-s3|minio)(:\d+)?$/i;

function assertBrowserReachableUploadUrl(url: string): void {
  let host: string;
  try {
    host = new URL(url).hostname;
  } catch {
    throw new Error('Invalid upload URL from API');
  }
  if (INTERNAL_UPLOAD_HOST.test(host) || host.endsWith('.internal') || host.endsWith('.local')) {
    throw new Error(
      `Upload URL points to an internal host (${host}). The API must sign presigned URLs with MINIO_PUBLIC_URL (e.g. https://s3.zenora360.com), not the Docker S3 hostname.`,
    );
  }
}

export async function createPresignedUpload(input: {
  filename: string;
  contentType: string;
  size: number;
}): Promise<PresignedUpload> {
  return apiClient.post<PresignedUpload>('/files/presign', input);
}

export type UploadAdminImageOptions = CompressImageOptions & {
  /** When false, upload the raw file (default: compress) */
  compress?: boolean;
};

/**
 * Compress (WebP/JPEG) → presign → PUT to object storage → durable public URL.
 */
export async function uploadAdminImage(
  file: File,
  options: UploadAdminImageOptions = {},
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Invalid image type');
  }

  const { compress = true, ...compressOpts } = options;
  const payload =
    compress && typeof document !== 'undefined'
      ? await compressImageFile(file, compressOpts)
      : file;

  const signed = await createPresignedUpload({
    filename: payload.name || 'image.jpg',
    contentType: payload.type || 'image/jpeg',
    size: payload.size,
  });

  assertBrowserReachableUploadUrl(signed.url);

  const put = await fetch(signed.url, {
    method: 'PUT',
    body: payload,
    headers: {
      'Content-Type': payload.type || 'application/octet-stream',
    },
  });

  if (!put.ok) {
    throw new Error(`Upload failed (${put.status})`);
  }

  return signed.publicUrl || signed.key;
}

export const filesApi = {
  createPresignedUpload,
  uploadAdminImage,
};
