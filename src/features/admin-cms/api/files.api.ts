import { apiClient } from '@/shared/api';

export type PresignedUpload = {
  url: string;
  key: string;
  expiresIn: number;
  publicUrl: string;
};

export async function createPresignedUpload(input: {
  filename: string;
  contentType: string;
  size: number;
}): Promise<PresignedUpload> {
  return apiClient.post<PresignedUpload>('/files/presign', input);
}

/**
 * Presign → PUT to object storage → durable public URL for CMS media fields.
 */
export async function uploadAdminImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Invalid image type');
  }

  const signed = await createPresignedUpload({
    filename: file.name || 'image.jpg',
    contentType: file.type || 'image/jpeg',
    size: file.size,
  });

  const put = await fetch(signed.url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
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
