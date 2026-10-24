/** Shared SEO generation constants - keep in sync with src/shared/config/site.ts */

export const SITE_URL = 'https://barthez-kenwou.dev';
export const SITE_NAME = 'Barthez Kenwou';
export const SITE_NAME_FULL = 'Barthez Kenwou - Portfolio';
export const DEFAULT_TITLE = 'Barthez Kenwou | Développeur Full Stack & Ingénieur DevOps';
export const DEFAULT_DESCRIPTION =
  'Barthez Kenwou — développeur Full Stack JavaScript/TypeScript & ingénieur DevOps AWS (Yaoundé, Cameroun). React, Node.js, CI/CD GitHub Actions, Docker, Kubernetes, Terraform, DevSecOps. Freelance remote Afrique francophone & international.';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-share.jpg`;
export const AUTHOR_EMAIL = 'kenwoubarthez@gmail.com';
export const AUTHOR_PHONE = '+237 655 646 688';
export const AUTHOR_LOCATION = 'Yaoundé, Cameroun';
export const SOCIAL = {
  github: 'https://github.com/barthez-kenwou',
  linkedin: 'https://linkedin.com/in/barthez-kenwou',
  whatsapp: 'https://wa.me/237655646688',
} as const;

export const TODAY = new Date().toISOString().split('T')[0];

export type StaticPage = {
  path: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  priority: number;
  changefreq: string;
  bodyFr: string;
  bodyEn: string;
};

export const STATIC_PAGES: StaticPage[] = [
  {
    path: '/',
    titleFr: DEFAULT_TITLE,
    titleEn: 'Barthez Kenwou | Full Stack Developer & DevOps Engineer',
    descriptionFr:
      'Développeur Full Stack React/Node & ingénieur DevOps AWS à Yaoundé (Cameroun). CI/CD, Docker, Kubernetes, Terraform — freelance remote Afrique francophone et international.',
    descriptionEn:
      'Full Stack React/Node developer & AWS DevOps engineer in Yaoundé (Cameroon). CI/CD, Docker, Kubernetes, Terraform — remote freelancing across Francophone Africa and internationally.',
    priority: 1.0,
    changefreq: 'weekly',
    bodyFr: `<h1>Barthez Kenwou</h1>
<p>Développeur Full Stack JavaScript/TypeScript &amp; ingénieur DevOps / AWS Cloud, basé à <strong>Yaoundé (Cameroun)</strong>.</p>
<p>Je conçois, sécurise et déploie en production : React, Node.js, GitHub Actions, Docker, Kubernetes, Terraform, DevSecOps et observabilité.</p>
<p>Missions : locales (Cameroun / Afrique centrale), Afrique francophone, Europe francophone et remote international.</p>
<p>Profil machine-readable pour IA : <a href="${SITE_URL}/llms.txt">llms.txt</a>.</p>
<nav><ul>
<li><a href="${SITE_URL}/about">À propos</a></li>
<li><a href="${SITE_URL}/services">Services</a></li>
<li><a href="${SITE_URL}/projects">Projets</a></li>
<li><a href="${SITE_URL}/skills">Compétences</a></li>
<li><a href="${SITE_URL}/blog">Blog</a></li>
<li><a href="${SITE_URL}/cv">CV</a></li>
<li><a href="${SITE_URL}/contact">Contact</a></li>
</ul></nav>`,
    bodyEn: `<h1>Barthez Kenwou</h1>
<p>Full Stack JavaScript/TypeScript developer &amp; DevOps / AWS Cloud engineer, based in <strong>Yaoundé (Cameroon)</strong>.</p>
<p>I design, secure and ship to production: React, Node.js, GitHub Actions, Docker, Kubernetes, Terraform, DevSecOps and observability.</p>
<p>Available locally (Cameroon / Central Africa), Francophone Africa, Francophone Europe, and remote internationally.</p>
<p>Machine-readable AI profile: <a href="${SITE_URL}/llms.txt">llms.txt</a>.</p>
<nav><ul>
<li><a href="${SITE_URL}/about">About</a></li>
<li><a href="${SITE_URL}/services">Services</a></li>
<li><a href="${SITE_URL}/projects">Projects</a></li>
<li><a href="${SITE_URL}/skills">Skills</a></li>
<li><a href="${SITE_URL}/blog">Blog</a></li>
<li><a href="${SITE_URL}/cv">Resume</a></li>
<li><a href="${SITE_URL}/contact">Contact</a></li>
</ul></nav>`,
  },
  {
    path: '/about',
    titleFr: 'À propos | Barthez Kenwou',
    titleEn: 'About | Barthez Kenwou',
    descriptionFr:
      'Parcours de Barthez Kenwou — Full Stack, DevOps et AWS à Yaoundé. Freelance Cameroun, Afrique francophone et remote international.',
    descriptionEn:
      'Background of Barthez Kenwou — Full Stack, DevOps and AWS in Yaoundé. Freelance Cameroon, Francophone Africa and remote international.',
    priority: 0.9,
    changefreq: 'monthly',
    bodyFr: `<h1>À propos de Barthez Kenwou</h1>
<p>Ingénieur basé à Yaoundé, passionné par le craft logiciel et les infrastructures cloud. Je construis des produits numériques fiables, observés et déployés en continu — pour clients locaux et équipes remote.</p>
<p><a href="${SITE_URL}/cv">Voir mon CV</a> · <a href="${SITE_URL}/contact">Me contacter</a> · <a href="${SITE_URL}/projects">Mes projets</a></p>`,
    bodyEn: `<h1>About Barthez Kenwou</h1>
<p>Engineer based in Yaoundé, focused on software craft and cloud infrastructure. I build reliable digital products with continuous delivery — for local clients and remote teams.</p>
<p><a href="${SITE_URL}/cv">Resume</a> · <a href="${SITE_URL}/contact">Contact</a> · <a href="${SITE_URL}/projects">Projects</a></p>`,
  },
  {
    path: '/services',
    titleFr: 'Services | Barthez Kenwou',
    titleEn: 'Services | Barthez Kenwou',
    descriptionFr:
      'Développement Full Stack React/Node, DevOps CI/CD, Kubernetes, AWS, DevSecOps et hardening VPS — Yaoundé & remote.',
    descriptionEn:
      'Full Stack React/Node development, DevOps CI/CD, Kubernetes, AWS, DevSecOps and VPS hardening — Yaoundé & remote.',
    priority: 0.9,
    changefreq: 'monthly',
    bodyFr: `<h1>Services</h1>
<ul>
<li>Développement d'applications web Full Stack (React, Node.js, TypeScript)</li>
<li>Architecture cloud AWS et déploiement scalable</li>
<li>Pipelines CI/CD, GitOps, Docker &amp; Kubernetes</li>
<li>Observabilité, sécurité et hardening serveur Ubuntu / VPS</li>
<li>Audit technique et accompagnement d'équipes (Cameroun &amp; remote)</li>
</ul>
<p><a href="${SITE_URL}/contact">Demander un devis</a></p>`,
    bodyEn: `<h1>Services</h1>
<ul>
<li>Full Stack web apps (React, Node.js, TypeScript)</li>
<li>AWS cloud architecture and scalable delivery</li>
<li>CI/CD pipelines, GitOps, Docker &amp; Kubernetes</li>
<li>Observability, security and Ubuntu / VPS hardening</li>
<li>Technical audits and team enablement (Cameroon &amp; remote)</li>
</ul>
<p><a href="${SITE_URL}/contact">Get in touch</a></p>`,
  },
  {
    path: '/projects',
    titleFr: 'Projets | Barthez Kenwou',
    titleEn: 'Projects | Barthez Kenwou',
    descriptionFr:
      'Études de cas Full Stack & DevOps : SaaS, ERP Odoo, AWS, Kubernetes, DevSecOps, observabilité — preuves de production.',
    descriptionEn:
      'Full Stack & DevOps case studies: SaaS, Odoo ERP, AWS, Kubernetes, DevSecOps, observability — production proof.',
    priority: 0.9,
    changefreq: 'weekly',
    bodyFr: `<h1>Projets</h1>
<p>Sélection de réalisations Full Stack &amp; DevOps - ERP SaaS, PWA, plateformes cloud, sécurité et observabilité.</p>
<p><a href="${SITE_URL}/">Retour à l'accueil</a></p>`,
    bodyEn: `<h1>Projects</h1>
<p>Selected Full Stack &amp; DevOps work - SaaS ERP, PWAs, cloud platforms, security and observability.</p>
<p><a href="${SITE_URL}/">Back home</a></p>`,
  },
  {
    path: '/skills',
    titleFr: 'Compétences | Barthez Kenwou',
    titleEn: 'Skills | Barthez Kenwou',
    descriptionFr:
      'Stack : React, TypeScript, Node.js, AWS, Docker, Kubernetes, Terraform, GitHub Actions, Trivy, Prometheus, Grafana.',
    descriptionEn:
      'Stack: React, TypeScript, Node.js, AWS, Docker, Kubernetes, Terraform, GitHub Actions, Trivy, Prometheus, Grafana.',
    priority: 0.8,
    changefreq: 'monthly',
    bodyFr: `<h1>Compétences</h1>
<p>Frontend (React, TypeScript, Tailwind), Backend (Node.js, APIs), Cloud AWS, DevOps (Docker, K8s, Terraform, GitHub Actions), sécurité et monitoring.</p>
<p><a href="${SITE_URL}/projects">Voir les projets</a></p>`,
    bodyEn: `<h1>Skills</h1>
<p>Frontend (React, TypeScript, Tailwind), Backend (Node.js, APIs), AWS cloud, DevOps (Docker, K8s, Terraform, GitHub Actions), security and monitoring.</p>
<p><a href="${SITE_URL}/projects">See projects</a></p>`,
  },
  {
    path: '/blog',
    titleFr: 'Blog | Barthez Kenwou',
    titleEn: 'Blog | Barthez Kenwou',
    descriptionFr:
      'Tutoriels DevOps, AWS, Node.js, React, Kubernetes, sécurisation Linux, CI/CD et bonnes pratiques production.',
    descriptionEn:
      'Tutorials on DevOps, AWS, Node.js, React, Kubernetes, Linux hardening, CI/CD and production best practices.',
    priority: 0.8,
    changefreq: 'weekly',
    bodyFr: `<h1>Blog technique</h1>
<p>Guides pratiques sur le CI/CD, AWS, la sécurité, Kubernetes et le développement Full Stack.</p>`,
    bodyEn: `<h1>Tech blog</h1>
<p>Practical guides on CI/CD, AWS, security, Kubernetes and Full Stack development.</p>`,
  },
  {
    path: '/cv',
    titleFr: 'CV | Barthez Kenwou',
    titleEn: 'Resume | Barthez Kenwou',
    descriptionFr:
      'CV de Barthez Kenwou — développeur Full Stack & DevOps AWS à Yaoundé. Expériences, formations, compétences.',
    descriptionEn:
      'Resume of Barthez Kenwou — Full Stack & AWS DevOps engineer in Yaoundé. Experience, education, skills.',
    priority: 0.8,
    changefreq: 'monthly',
    bodyFr: `<h1>Curriculum vitae</h1>
<p>Parcours professionnel, formations et compétences de Barthez Kenwou (Yaoundé / remote).</p>
<p><a href="${SITE_URL}/contact">Me recruter</a> · <a href="${SOCIAL.linkedin}">LinkedIn</a></p>`,
    bodyEn: `<h1>Resume</h1>
<p>Professional background, education and skills of Barthez Kenwou (Yaoundé / remote).</p>
<p><a href="${SITE_URL}/contact">Hire me</a> · <a href="${SOCIAL.linkedin}">LinkedIn</a></p>`,
  },
  {
    path: '/contact',
    titleFr: 'Contact | Barthez Kenwou',
    titleEn: 'Contact | Barthez Kenwou',
    descriptionFr:
      'Contactez Barthez Kenwou (Yaoundé) pour un projet web, DevOps, AWS ou hardening VPS. Email, WhatsApp, LinkedIn.',
    descriptionEn:
      'Contact Barthez Kenwou (Yaoundé) for web, DevOps, AWS or VPS hardening projects. Email, WhatsApp, LinkedIn.',
    priority: 0.7,
    changefreq: 'monthly',
    bodyFr: `<h1>Contact</h1>
<ul>
<li>Email : <a href="mailto:${AUTHOR_EMAIL}">${AUTHOR_EMAIL}</a></li>
<li>Téléphone : <a href="tel:${AUTHOR_PHONE.replace(/\s/g, '')}">${AUTHOR_PHONE}</a></li>
<li>WhatsApp : <a href="${SOCIAL.whatsapp}">Écrire sur WhatsApp</a></li>
<li>LinkedIn : <a href="${SOCIAL.linkedin}">barthez-kenwou</a></li>
<li>GitHub : <a href="${SOCIAL.github}">barthez-kenwou</a></li>
<li>Localisation : ${AUTHOR_LOCATION} — disponible remote Afrique francophone &amp; international</li>
</ul>`,
    bodyEn: `<h1>Contact</h1>
<ul>
<li>Email: <a href="mailto:${AUTHOR_EMAIL}">${AUTHOR_EMAIL}</a></li>
<li>Phone: <a href="tel:${AUTHOR_PHONE.replace(/\s/g, '')}">${AUTHOR_PHONE}</a></li>
<li>WhatsApp: <a href="${SOCIAL.whatsapp}">Chat on WhatsApp</a></li>
<li>LinkedIn: <a href="${SOCIAL.linkedin}">barthez-kenwou</a></li>
<li>GitHub: <a href="${SOCIAL.github}">barthez-kenwou</a></li>
<li>Location: ${AUTHOR_LOCATION} — available remote (Francophone Africa &amp; international)</li>
</ul>`,
  },
];

export function absoluteUrl(path = '/'): string {
  if (!path || path === '/') return `${SITE_URL}/`;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(value: string, max: number): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}
