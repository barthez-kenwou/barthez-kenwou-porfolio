type AdminLocale = 'fr' | 'en';

type FormatAdminDateOptions = {
  withTime?: boolean;
};

export function formatAdminDate(
  value: string | Date | null | undefined,
  locale: AdminLocale,
  opts?: FormatAdminDateOptions,
): string {
  if (value == null || value === '') return '—';

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    dateStyle: 'medium',
    ...(opts?.withTime ? { timeStyle: 'short' as const } : {}),
  });
}
