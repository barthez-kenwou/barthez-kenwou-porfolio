export type CompressImageOptions = {
  /** Longest edge in px (default 1920) */
  maxEdge?: number;
  /** WebP / JPEG quality 0–1 (default 0.82) */
  quality?: number;
  /** Skip compression when file is already under this size (default 180_000) */
  skipIfUnderBytes?: number;
  /**
   * `logo` — smaller edge, higher quality; white matte if JPEG fallback (alpha).
   * `photo` — default photo/cover pipeline.
   */
  kind?: 'photo' | 'logo';
};

const DEFAULTS = {
  maxEdge: 1920,
  quality: 0.82,
  skipIfUnderBytes: 180_000,
  kind: 'photo' as const,
};

function canEncodeWebp(): boolean {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').startsWith('data:image/webp');
  } catch {
    return false;
  }
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to decode image'));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const done = (blob: Blob | null) => {
      if (!blob) {
        reject(new Error('Image encoding failed'));
        return;
      }
      resolve(blob);
    };
    // PNG ignores quality; omit the arg to avoid engine quirks
    if (quality == null || type === 'image/png') {
      canvas.toBlob(done, type);
    } else {
      canvas.toBlob(done, type, quality);
    }
  });
}

function replaceExtension(name: string, ext: string): string {
  const base = name.replace(/\.[^.]+$/, '') || 'image';
  return `${base}.${ext}`;
}

/**
 * Client-side resize + WebP (or JPEG/PNG fallback) before CMS upload.
 * Keeps animated GIF / SVG / already-tiny files untouched.
 */
export async function compressImageFile(
  file: File,
  options: CompressImageOptions = {},
): Promise<File> {
  const maxEdge = options.maxEdge ?? DEFAULTS.maxEdge;
  const quality = options.quality ?? DEFAULTS.quality;
  const skipIfUnderBytes = options.skipIfUnderBytes ?? DEFAULTS.skipIfUnderBytes;
  const kind = options.kind ?? DEFAULTS.kind;

  const type = (file.type || '').toLowerCase();
  if (!type.startsWith('image/')) return file;
  if (type === 'image/svg+xml' || type === 'image/gif') return file;

  // Already small WebP/AVIF — no need to re-encode
  if (file.size <= skipIfUnderBytes && (type === 'image/webp' || type === 'image/avif')) {
    return file;
  }

  let img: HTMLImageElement;
  try {
    img = await loadImage(file);
  } catch {
    return file;
  }

  const srcW = img.naturalWidth || img.width;
  const srcH = img.naturalHeight || img.height;
  if (!srcW || !srcH) return file;

  const scale = Math.min(1, maxEdge / Math.max(srcW, srcH));
  const width = Math.max(1, Math.round(srcW * scale));
  const height = Math.max(1, Math.round(srcH * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;

  const preferWebp = canEncodeWebp();
  let outType: string;
  let outExt: string;

  if (preferWebp) {
    outType = 'image/webp';
    outExt = 'webp';
  } else if (kind === 'logo' && (type === 'image/png' || type === 'image/webp')) {
    // Preserve alpha when WebP is unavailable
    outType = 'image/png';
    outExt = 'png';
  } else {
    outType = 'image/jpeg';
    outExt = 'jpg';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }

  ctx.drawImage(img, 0, 0, width, height);

  let blob: Blob;
  try {
    blob = await canvasToBlob(canvas, outType, outType === 'image/png' ? undefined : quality);
  } catch {
    return file;
  }

  // Keep original if compression somehow grew the file (rare for photos)
  if (blob.size >= file.size && scale === 1 && type === outType) {
    return file;
  }
  if (blob.size >= file.size * 0.95 && scale === 1) {
    return file;
  }

  return new File([blob], replaceExtension(file.name || 'image', outExt), {
    type: outType,
    lastModified: Date.now(),
  });
}

/** Cover / hero / project gallery photos */
export const COVER_COMPRESS: CompressImageOptions = {
  maxEdge: 2048,
  quality: 0.84,
  skipIfUnderBytes: 220_000,
  kind: 'photo',
};

/** Inline article images */
export const INLINE_COMPRESS: CompressImageOptions = {
  maxEdge: 1600,
  quality: 0.8,
  skipIfUnderBytes: 160_000,
  kind: 'photo',
};

/**
 * Partner / brand logos — small on screen, need crisp edges + alpha.
 * Display cells are ~40–80px; 640px covers 2–3× retina with headroom.
 */
export const LOGO_COMPRESS: CompressImageOptions = {
  maxEdge: 640,
  quality: 0.9,
  skipIfUnderBytes: 48_000,
  kind: 'logo',
};

/** Admin account avatar */
export const AVATAR_COMPRESS: CompressImageOptions = {
  maxEdge: 512,
  quality: 0.85,
  skipIfUnderBytes: 60_000,
  kind: 'photo',
};
