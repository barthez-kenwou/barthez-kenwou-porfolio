/**
 * Resolve any common video URL into a playable embed or file sources.
 * Supports: YouTube, Vimeo, Google Drive, Loom, direct files (S3 / CDN / .mp4|.webm…).
 */

export type VideoProvider = 'youtube' | 'vimeo' | 'drive' | 'loom';

export type ParsedVideo = {
  provider: 'youtube' | 'vimeo';
  id: string;
  /** Privacy-friendly embed URL (no autoplay yet). */
  embedSrc: string;
  /** Best-effort public thumbnail. */
  thumbnailSrc: string;
  /** Shorts → portrait; classic YouTube / Vimeo → landscape. */
  aspect: 'portrait' | 'landscape';
  isShort: boolean;
};

export type FileVideoSource = {
  src: string;
  type?: string;
};

export type ResolvedVideoMedia =
  | {
      kind: 'embed';
      provider: VideoProvider;
      embedSrc: string;
      thumbnailSrc: string;
      aspect: 'portrait' | 'landscape';
      isShort: boolean;
      openUrl: string;
    }
  | {
      kind: 'file';
      sources: FileVideoSource[];
      aspect: 'landscape';
      openUrl: string;
    };

const YT_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtu.be',
  'www.youtu.be',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
]);

const FILE_EXT_MIME: Record<string, string> = {
  mp4: 'video/mp4',
  m4v: 'video/mp4',
  webm: 'video/webm',
  ogg: 'video/ogg',
  ogv: 'video/ogg',
  mov: 'video/quicktime',
};

const FILE_EXT_RE = /\.(mp4|m4v|webm|ogg|ogv|mov)(?:$|[?#])/i;

function hostOf(raw: string): string | null {
  try {
    return new URL(raw.trim()).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function pathnameOf(raw: string): string {
  try {
    return new URL(raw.trim()).pathname;
  } catch {
    return raw;
  }
}

export function mimeTypeForVideoUrl(url: string): string | undefined {
  const match = pathnameOf(url).match(/\.([a-z0-9]+)$/i);
  if (!match) return undefined;
  return FILE_EXT_MIME[match[1].toLowerCase()];
}

export function isDirectVideoFileUrl(url: string): boolean {
  return FILE_EXT_RE.test(pathnameOf(url.trim()));
}

/** Extract 11-char YouTube id from any usual link or bare id. */
export function extractYoutubeId(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;

  if (/^[\w-]{11}$/.test(raw)) return raw;

  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }

    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const v = url.searchParams.get('v');
      if (v && /^[\w-]{11}$/.test(v)) return v;

      const parts = url.pathname.split('/').filter(Boolean);
      const markers = new Set(['embed', 'shorts', 'live', 'v', 'e']);
      for (let i = 0; i < parts.length - 1; i += 1) {
        if (markers.has(parts[i]) && /^[\w-]{11}$/.test(parts[i + 1]!)) {
          return parts[i + 1]!;
        }
      }
    }
  } catch {
    // ignore
  }

  const fallback = raw.match(/(?:v=|\/embed\/|\/shorts\/|\/live\/|youtu\.be\/)([\w-]{11})/);
  return fallback?.[1] ?? null;
}

export function extractVimeoId(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  if (/^\d{6,12}$/.test(raw)) return raw;

  try {
    const url = new URL(raw);
    if (!url.hostname.includes('vimeo.com')) return null;
    const match = url.pathname.match(/\/(?:video\/)?(\d{6,12})/);
    return match?.[1] ?? null;
  } catch {
    const match = raw.match(/vimeo\.com\/(?:video\/)?(\d{6,12})/);
    return match?.[1] ?? null;
  }
}

export function extractGoogleDriveId(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, '');
    if (!host.includes('drive.google.com') && !host.includes('docs.google.com')) {
      return null;
    }

    const fileMatch = url.pathname.match(/\/file\/d\/([^/]+)/);
    if (fileMatch?.[1]) return fileMatch[1];

    const openId = url.searchParams.get('id');
    if (openId) return openId;
  } catch {
    // ignore
  }

  const fallback = raw.match(/\/file\/d\/([^/]+)/) || raw.match(/[?&]id=([^&]+)/);
  return fallback?.[1] ?? null;
}

export function extractLoomId(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    if (!url.hostname.includes('loom.com')) return null;
    const parts = url.pathname.split('/').filter(Boolean);
    const markers = new Set(['share', 'embed']);
    for (let i = 0; i < parts.length - 1; i += 1) {
      if (markers.has(parts[i]!) && /^[a-f0-9]{16,64}$/i.test(parts[i + 1]!)) {
        return parts[i + 1]!;
      }
    }
  } catch {
    // ignore
  }

  const match = raw.match(/loom\.com\/(?:share|embed)\/([a-f0-9]+)/i);
  return match?.[1] ?? null;
}

function isYoutubeShort(input: string): boolean {
  try {
    return new URL(input.trim()).pathname.includes('/shorts/');
  } catch {
    return false;
  }
}

/** Swap common container extensions so we can offer Safari/Chrome fallbacks. */
export function alternateFileUrls(primary: string): string[] {
  const raw = primary.trim();
  if (!isDirectVideoFileUrl(raw)) return [];

  const swaps: Record<string, string[]> = {
    webm: ['mp4', 'm4v'],
    mp4: ['webm'],
    m4v: ['mp4', 'webm'],
    mov: ['mp4'],
    ogg: ['mp4'],
    ogv: ['mp4'],
  };

  const extMatch = pathnameOf(raw).match(/\.([a-z0-9]+)$/i);
  if (!extMatch) return [];
  const ext = extMatch[1].toLowerCase();
  const targets = swaps[ext] ?? [];

  return targets.map((next) => raw.replace(new RegExp(`\\.${ext}(?=$|[?#])`, 'i'), `.${next}`));
}

export function buildFileVideoSources(
  primary: string,
  extras: string[] = [],
): FileVideoSource[] {
  const seen = new Set<string>();
  const ordered = [primary, ...extras, ...alternateFileUrls(primary)];
  const out: FileVideoSource[] = [];

  for (const src of ordered) {
    const key = src.trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push({ src: key, type: mimeTypeForVideoUrl(key) });
  }
  return out;
}

/**
 * Legacy helper used by presentation video — YouTube / Vimeo only.
 * Prefer `resolveVideoMedia` for project case studies.
 */
export function parseVideoUrl(input: string): ParsedVideo | null {
  const raw = input.trim();
  if (!raw) return null;

  const ytId = extractYoutubeId(raw);
  if (ytId) {
    const short = isYoutubeShort(raw);
    return {
      provider: 'youtube',
      id: ytId,
      embedSrc: `https://www.youtube-nocookie.com/embed/${ytId}`,
      thumbnailSrc: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
      aspect: short ? 'portrait' : 'landscape',
      isShort: short,
    };
  }

  const vimeoId = extractVimeoId(raw);
  if (vimeoId) {
    return {
      provider: 'vimeo',
      id: vimeoId,
      embedSrc: `https://player.vimeo.com/video/${vimeoId}`,
      thumbnailSrc: '',
      aspect: 'landscape',
      isShort: false,
    };
  }

  return null;
}

/** Full resolver for project / CMS video URLs. */
export function resolveVideoMedia(
  input: string,
  alternateUrls: string[] = [],
): ResolvedVideoMedia | null {
  const raw = input.trim();
  if (!raw) return null;

  const ytId = extractYoutubeId(raw);
  if (ytId) {
    const short = isYoutubeShort(raw);
    return {
      kind: 'embed',
      provider: 'youtube',
      embedSrc: `https://www.youtube-nocookie.com/embed/${ytId}`,
      thumbnailSrc: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
      aspect: short ? 'portrait' : 'landscape',
      isShort: short,
      openUrl: `https://www.youtube.com/watch?v=${ytId}`,
    };
  }

  const vimeoId = extractVimeoId(raw);
  if (vimeoId) {
    return {
      kind: 'embed',
      provider: 'vimeo',
      embedSrc: `https://player.vimeo.com/video/${vimeoId}`,
      thumbnailSrc: '',
      aspect: 'landscape',
      isShort: false,
      openUrl: `https://vimeo.com/${vimeoId}`,
    };
  }

  const driveId = extractGoogleDriveId(raw);
  if (driveId) {
    return {
      kind: 'embed',
      provider: 'drive',
      embedSrc: `https://drive.google.com/file/d/${driveId}/preview`,
      thumbnailSrc: '',
      aspect: 'landscape',
      isShort: false,
      openUrl: `https://drive.google.com/file/d/${driveId}/view`,
    };
  }

  const loomId = extractLoomId(raw);
  if (loomId) {
    return {
      kind: 'embed',
      provider: 'loom',
      embedSrc: `https://www.loom.com/embed/${loomId}`,
      thumbnailSrc: '',
      aspect: 'landscape',
      isShort: false,
      openUrl: `https://www.loom.com/share/${loomId}`,
    };
  }

  if (isDirectVideoFileUrl(raw)) {
    return {
      kind: 'file',
      sources: buildFileVideoSources(raw, alternateUrls),
      aspect: 'landscape',
      openUrl: raw,
    };
  }

  const host = hostOf(raw);
  if (host && YT_HOSTS.has(host)) return null;

  // Unknown HTTP(S) URL under a videos path — treat as progressive file
  if (/^https?:\/\//i.test(raw) && /\/videos?\//i.test(pathnameOf(raw))) {
    return {
      kind: 'file',
      sources: buildFileVideoSources(raw, alternateUrls),
      aspect: 'landscape',
      openUrl: raw,
    };
  }

  return null;
}

/** Build final iframe src with provider-correct query params. */
export function buildVideoEmbedSrc(embedBase: string, playing: boolean): string {
  try {
    const url = new URL(embedBase);
    const host = url.hostname.replace(/^www\./, '');

    if (host.includes('youtube') || host.includes('youtube-nocookie')) {
      url.searchParams.set('rel', '0');
      url.searchParams.set('modestbranding', '1');
      url.searchParams.set('playsinline', '1');
      url.searchParams.set('iv_load_policy', '3');
      if (playing) url.searchParams.set('autoplay', '1');
      else url.searchParams.delete('autoplay');
      return url.toString();
    }

    if (host.includes('vimeo')) {
      url.searchParams.set('title', '0');
      url.searchParams.set('byline', '0');
      url.searchParams.set('portrait', '0');
      url.searchParams.set('dnt', '1');
      if (playing) url.searchParams.set('autoplay', '1');
      else url.searchParams.delete('autoplay');
      return url.toString();
    }

    if (host.includes('loom.com')) {
      if (playing) url.searchParams.set('autoplay', '1');
      else url.searchParams.delete('autoplay');
      return url.toString();
    }

    // Google Drive preview — no reliable autoplay flag
    return url.toString();
  } catch {
    return embedBase;
  }
}

/** Prefer sources the current browser claims to support (may be empty). */
export function filterPlayableFileSources(sources: FileVideoSource[]): FileVideoSource[] {
  if (typeof document === 'undefined') return sources;
  const probe = document.createElement('video');
  return sources.filter((s) => {
    if (!s.type) return true;
    return probe.canPlayType(s.type) !== '';
  });
}
