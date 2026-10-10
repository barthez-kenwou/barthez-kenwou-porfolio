export type NewsletterTab = 'overview' | 'subscribers' | 'campaigns' | 'compose';

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'success'
  | 'warning'
  | 'destructive';

export const NEWSLETTER_TABS: NewsletterTab[] = [
  'overview',
  'subscribers',
  'campaigns',
  'compose',
];

export function isNewsletterTab(value: string | null): value is NewsletterTab {
  return !!value && (NEWSLETTER_TABS as string[]).includes(value);
}

export function subscriberStatusLabel(status: string, fr: boolean): string {
  if (!fr) return status;
  const map: Record<string, string> = {
    pending: 'En attente',
    active: 'Actif',
    unsubscribed: 'Désabonné',
    bounced: 'Bounced',
  };
  return map[status] ?? status;
}

export function subscriberStatusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    pending: 'warning',
    active: 'success',
    unsubscribed: 'secondary',
    bounced: 'destructive',
  };
  return map[status] ?? 'secondary';
}

export function campaignTypeLabel(type: string | undefined, fr: boolean): string {
  if (!type) return '·';
  if (!fr) {
    const en: Record<string, string> = {
      confirm: 'Confirm',
      welcome: 'Welcome',
      blog_publish: 'Blog alert',
      digest: 'Digest',
      broadcast: 'Broadcast',
    };
    return en[type] ?? type;
  }
  const frMap: Record<string, string> = {
    confirm: 'Confirmation',
    welcome: 'Bienvenue',
    blog_publish: 'Alerte blog',
    digest: 'Digest',
    broadcast: 'Diffusion',
  };
  return frMap[type] ?? type;
}

export function campaignStatusLabel(status: string, fr: boolean): string {
  if (!fr) return status;
  const map: Record<string, string> = {
    queued: 'En file',
    sending: 'Envoi…',
    sent: 'Envoyée',
    failed: 'Échouée',
    cancelled: 'Annulée',
  };
  return map[status] ?? status;
}

export function campaignStatusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    queued: 'warning',
    sending: 'default',
    sent: 'success',
    failed: 'destructive',
    cancelled: 'secondary',
  };
  return map[status] ?? 'secondary';
}

export function formatDate(value: string | null | undefined, fr: boolean): string {
  if (!value) return '·';
  return new Date(value).toLocaleString(fr ? 'fr-FR' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
