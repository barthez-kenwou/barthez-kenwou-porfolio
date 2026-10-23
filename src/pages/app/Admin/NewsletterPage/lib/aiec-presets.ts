import type { NewsletterBroadcastPayload } from '@/features/newsletter';

export type AiecPresetId = 'engagement' | 'interet' | 'conversion' | 'blank';

export type AiecPreset = {
  id: AiecPresetId;
  labelFr: string;
  labelEn: string;
  hintFr: string;
  hintEn: string;
  payload: Partial<NewsletterBroadcastPayload>;
};

const FLAGSHIP =
  'https://barthez-kenwou.dev/blog/ci-cd-github-actions-zero-to-expert?utm_source=newsletter&utm_medium=email&utm_campaign=edition-cicd&utm_content=cta-blog';

const CONTACT =
  'https://barthez-kenwou.dev/contact?utm_source=newsletter&utm_medium=email&utm_campaign=edition-audit&utm_content=cta-contact';

export const AIEC_PRESETS: AiecPreset[] = [
  {
    id: 'engagement',
    labelFr: 'Engagement (E) — reply',
    labelEn: 'Engagement (E) — reply',
    hintFr: '1 idée + question. CTA = répondre au mail. 3 éditions sur 4.',
    hintEn: '1 idea + question. CTA = reply. 3 of 4 editions.',
    payload: {
      subjectFr: 'Ton CI est vert. Ta prod peut quand même tomber.',
      subjectEn: 'Your CI is green. Production can still fail.',
      headlineFr: 'CI vert ≠ production sûre',
      headlineEn: 'Green CI ≠ safe production',
      previewFr: 'Une note concrète sur le delivery en production — sans bruit.',
      previewEn: 'One practical note on production delivery — no noise.',
      bodyFr: [
        'Un pipeline qui passe au vert rassure.',
        'Il ne garantit pas que le chemin de production est testé : secrets, environnements, rollback, déploiement réel.',
        '',
        'Sur beaucoup de PME, le CI valide le build…',
        'et le déploiement reste un script du vendredi soir.',
        '',
        'J’ai documenté des pipelines GitHub Actions complets (jusqu’au pattern que j’utilise en production) :',
        '',
        'Si vous le souhaitez, répondez à ce message :',
        'chez vous, la partie la plus fragile, c’est les tests, les secrets, ou le déploiement ?',
      ].join('\n'),
      bodyEn: [
        'A green pipeline is reassuring.',
        'It does not guarantee that the production path is tested: secrets, environments, rollback, real deploy.',
        '',
        'On many product SMBs, CI validates the build…',
        'and deploy remains a Friday-night script.',
        '',
        'I documented complete GitHub Actions pipelines (including the pattern I use in production):',
        '',
        'If you wish, reply to this email:',
        'for you, is the weakest part tests, secrets, or deploy?',
      ].join('\n'),
      ctaUrl: FLAGSHIP,
      ctaLabelFr: 'Lire le guide',
      ctaLabelEn: 'Read the guide',
    },
  },
  {
    id: 'interet',
    labelFr: 'Intérêt (I) — profondeur',
    labelEn: 'Interest (I) — depth',
    hintFr: 'Méthode + lien blog. Moins de pitch, plus de preuve.',
    hintEn: 'Method + blog link. Less pitch, more proof.',
    payload: {
      subjectFr: 'Ce que j’applique pour déployer sans surprise',
      subjectEn: 'What I use to deploy without surprises',
      headlineFr: 'Méthode delivery, version courte',
      headlineEn: 'Delivery method, short version',
      previewFr: 'Un extrait actionnable — le guide long est sur le blog.',
      previewEn: 'An actionable excerpt — the full guide is on the blog.',
      bodyFr: [
        'Voici l’angle que je retiens ce mois-ci : fiabiliser le chemin de déploiement, pas seulement le build.',
        '',
        'Le détail (étapes, garde-fous, exemples) est dans le guide public.',
        'Cette note sert à poser le problème clairement — la profondeur est sur le site.',
      ].join('\n'),
      bodyEn: [
        'This month’s angle: harden the deploy path, not only the build.',
        '',
        'The detail (steps, guardrails, examples) is in the public guide.',
        'This note frames the problem clearly — depth lives on the site.',
      ].join('\n'),
      ctaUrl: FLAGSHIP,
      ctaLabelFr: 'Lire l’article',
      ctaLabelEn: 'Read the article',
    },
  },
  {
    id: 'conversion',
    labelFr: 'Conversion (C) — soft',
    labelEn: 'Conversion (C) — soft',
    hintFr: 'Max 1× / trimestre en “offre claire”. Reste courtois.',
    hintEn: 'Max 1× / quarter as a clear offer. Stay courteous.',
    payload: {
      subjectFr: 'Si vous voulez un regard externe sur votre pipeline',
      subjectEn: 'If you want an external look at your pipeline',
      headlineFr: 'Audit pipeline — créneaux limités',
      headlineEn: 'Pipeline audit — limited slots',
      previewFr: 'Une proposition claire, sans pression.',
      previewEn: 'A clear offer, no pressure.',
      bodyFr: [
        'Si vous avez un frein concret (déploiement, AWS, sécurité, performance)',
        'et que vous souhaitez un regard externe sur votre stack,',
        'vous pouvez prendre contact via le formulaire.',
        '',
        'Sinon, on se retrouve dans la prochaine note mensuelle — toujours une idée, rarement un pitch.',
      ].join('\n'),
      bodyEn: [
        'If you have a concrete friction (deploy, AWS, security, performance)',
        'and want an external look at your stack,',
        'you can reach out through the contact form.',
        '',
        'Otherwise, see you in the next monthly note — always one idea, rarely a pitch.',
      ].join('\n'),
      ctaUrl: CONTACT,
      ctaLabelFr: 'Prendre contact',
      ctaLabelEn: 'Get in touch',
    },
  },
];

export function applyAiecPreset(
  presetId: AiecPresetId,
  current: NewsletterBroadcastPayload,
): NewsletterBroadcastPayload {
  if (presetId === 'blank') {
    return {
      ...current,
      subjectFr: '',
      subjectEn: '',
      headlineFr: '',
      headlineEn: '',
      bodyFr: '',
      bodyEn: '',
      previewFr: '',
      previewEn: '',
      ctaUrl: '',
      ctaLabelFr: '',
      ctaLabelEn: '',
    };
  }
  const preset = AIEC_PRESETS.find((p) => p.id === presetId);
  if (!preset) return current;
  return { ...current, ...preset.payload };
}
