export type TranslateLang = 'fr' | 'en';

type MyMemoryResponse = {
  responseData?: { translatedText?: string };
  responseStatus?: number;
  quotaFinished?: boolean;
};

const CHUNK = 450;

/** Same-origin proxy (Vite / Nginx) — keeps CSP connect-src on 'self'. */
const TRANSLATE_BASE = '/cms-translate';

function chunkText(text: string): string[] {
  const trimmed = text.trim();
  if (trimmed.length <= CHUNK) return [trimmed];

  const parts: string[] = [];
  const paragraphs = trimmed.split(/\n{2,}/);
  let buf = '';

  const flush = () => {
    if (buf.trim()) parts.push(buf.trim());
    buf = '';
  };

  for (const para of paragraphs) {
    if ((buf + '\n\n' + para).length > CHUNK && buf) {
      flush();
    }
    if (para.length > CHUNK) {
      flush();
      for (let i = 0; i < para.length; i += CHUNK) {
        parts.push(para.slice(i, i + CHUNK));
      }
      continue;
    }
    buf = buf ? `${buf}\n\n${para}` : para;
  }
  flush();
  return parts.length > 0 ? parts : [trimmed];
}

async function translateChunk(text: string, from: TranslateLang, to: TranslateLang) {
  const url = new URL(`${TRANSLATE_BASE}/get`, window.location.origin);
  url.searchParams.set('q', text);
  url.searchParams.set('langpair', `${from}|${to}`);

  let res: Response;
  try {
    res = await fetch(url.toString());
  } catch {
    throw new Error(
      'Translation network error — restart the Vite server if you just pulled this fix',
    );
  }

  if (!res.ok) {
    throw new Error(`Translation HTTP ${res.status}`);
  }

  const data = (await res.json()) as MyMemoryResponse;
  if (data.quotaFinished) {
    throw new Error('Translation quota exceeded');
  }
  const out = data.responseData?.translatedText?.trim();
  if (!out || (data.responseStatus && data.responseStatus !== 200)) {
    throw new Error('Translation failed');
  }
  if (/MYMEMORY WARNING/i.test(out)) {
    throw new Error(out);
  }
  return out;
}

/**
 * Lightweight FR↔EN helper for CMS bilingual fields.
 * Proxied via /cms-translate (MyMemory) so CSP does not need a third-party host.
 */
export async function translateAdminText(
  text: string,
  from: TranslateLang,
  to: TranslateLang,
): Promise<string> {
  const source = text.trim();
  if (!source) return '';
  if (from === to) return source;

  const chunks = chunkText(source);
  const translated: string[] = [];
  for (const chunk of chunks) {
    translated.push(await translateChunk(chunk, from, to));
  }
  return translated.join('\n\n');
}
