/** PDF CV helpers — keep content sharp while fitting ≤ 3 A4 pages. */

export function cleanPdfText(value: string): string {
  return value
    .replace(/`([^`]+)`/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Prefer lead bullets (usually the strongest); fewer for older roles. */
export function selectExperienceBullets(bullets: string[] | undefined, experienceIndex: number): string[] {
  const list = (bullets ?? []).map(cleanPdfText).filter(Boolean);
  const max = experienceIndex < 3 ? 3 : 2;
  return list.slice(0, max);
}

/** First sentence only — enough signal for a featured project line. */
export function firstSentence(value: string, maxLen = 140): string {
  const cleaned = cleanPdfText(value);
  const match = cleaned.match(/^(.+?[.!?])(\s|$)/);
  const sentence = match?.[1] ?? cleaned;
  if (sentence.length <= maxLen) return sentence;
  return `${sentence.slice(0, maxLen - 1).trim()}…`;
}
