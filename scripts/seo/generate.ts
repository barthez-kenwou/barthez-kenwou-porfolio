import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projectsData } from '../../src/entities/projets/api/mocks/projectData.mocks';
import { blogPostsData } from '../../src/entities/blogs/api/mock/blog.mocks';
import type { IProject } from '../../src/entities/projets/model/project.types';
import type { IBlog } from '../../src/entities/blogs/model/blog.type';
import { getBlogPathSlug, getProjectPathSlug } from '../../src/shared/lib/entity-slug';
import {
  AUTHOR_EMAIL,
  AUTHOR_LOCATION,
  AUTHOR_PHONE,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_NAME_FULL,
  SITE_URL,
  SOCIAL,
  STATIC_PAGES,
  TODAY,
  absoluteUrl,
  escapeHtml,
  escapeXml,
  truncate,
} from './config';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const PUBLIC_DIR = join(ROOT, 'public');
const DIST_DIR = join(ROOT, 'dist');
const WELL_KNOWN = join(PUBLIC_DIR, '.well-known');

type UrlEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
};

function ensureDir(filePath: string) {
  mkdirSync(dirname(filePath), { recursive: true });
}

function writeBoth(relativePath: string, content: string) {
  const publicPath = join(PUBLIC_DIR, relativePath);
  ensureDir(publicPath);
  writeFileSync(publicPath, content, 'utf8');
  if (existsSync(DIST_DIR)) {
    const distPath = join(DIST_DIR, relativePath);
    ensureDir(distPath);
    writeFileSync(distPath, content, 'utf8');
  }
}

/** W3C date for sitemaps: YYYY-MM-DD, valid calendar day only. */
function toSitemapDate(raw: string | undefined, fallback = TODAY): string {
  if (!raw?.trim()) return fallback;
  const match = raw.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (!match) return fallback;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1) return fallback;

  // Invalid days (e.g. 2026-02-30) roll in UTC - detect and clamp to month end.
  const parsed = new Date(Date.UTC(year, month - 1, day));
  const valid =
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day;

  const safe = valid ? parsed : new Date(Date.UTC(year, month, 0));
  const y = safe.getUTCFullYear();
  const m = String(safe.getUTCMonth() + 1).padStart(2, '0');
  const d = String(safe.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function writeUrlset(entries: UrlEntry[]): string {
  const body = entries
    .map((e) => {
      const lines = [`    <loc>${escapeXml(e.loc)}</loc>`];
      if (e.lastmod) {
        lines.push(`    <lastmod>${toSitemapDate(e.lastmod)}</lastmod>`);
      }
      if (e.changefreq) lines.push(`    <changefreq>${e.changefreq}</changefreq>`);
      if (e.priority !== undefined) {
        lines.push(`    <priority>${e.priority.toFixed(1)}</priority>`);
      }
      return `  <url>\n${lines.join('\n')}\n  </url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function blogTitle(post: IBlog, lang: 'fr' | 'en' = 'en'): string {
  if (lang === 'en') return post.titleEn?.trim() || post.titleFr;
  return post.titleFr;
}

function blogExcerpt(post: IBlog, lang: 'fr' | 'en' = 'en'): string {
  if (lang === 'en') {
    return (
      post.excerptEn?.trim() ||
      post.excerptFr ||
      truncate(post.contentEn || post.contentFr || '', 160)
    );
  }
  return post.excerptFr || truncate(post.contentFr || '', 160);
}

function projectImage(project: IProject): string {
  return project.images?.[0] || project.preview || DEFAULT_OG_IMAGE;
}

function flattenTech(project: IProject): string[] {
  const stack = project.techStack || {};
  return [
    ...(stack.frontend || []),
    ...(stack.backend || []),
    ...(stack.database || []),
    ...(stack.devops || []),
  ];
}

function collectCategories(): Map<string, IBlog[]> {
  const map = new Map<string, IBlog[]>();
  for (const post of blogPostsData) {
    const key = post.category || 'Autres';
    const list = map.get(key) || [];
    list.push(post);
    map.set(key, list);
  }
  return map;
}

function generateRobots() {
  const content = `User-agent: *
Allow: /

# Public portfolio - index pages and content
Allow: /about
Allow: /services
Allow: /projects
Allow: /skills
Allow: /blog
Allow: /cv
Allow: /contact

# Error / private surfaces (must stay out of search indexes)
Disallow: /server-error
Disallow: /barthez-admin
Disallow: /barthez-admin/
Disallow: /feedback
Disallow: /feedback/
# Legacy path: keep blocked if ever probed
Disallow: /admin

# AI / LLM discovery
# Spec: https://llmstxt.org/
# llms.txt and llms-full.txt are intentionally crawlable

Sitemap: ${SITE_URL}/sitemap-index.xml
Sitemap: ${SITE_URL}/sitemap.xml
`;
  writeBoth('robots.txt', content);
}

function generateHumans() {
  const content = `/* TEAM */
Name: Barthez Kenwou
Role: Full Stack Developer & DevOps Engineer (AWS Cloud Specialist)
Location: ${AUTHOR_LOCATION}
Contact: ${AUTHOR_EMAIL}
GitHub: ${SOCIAL.github}
LinkedIn: ${SOCIAL.linkedin}
Site: ${SITE_URL}/

/* THANKS */
Nginx Proxy Manager - TLS & reverse proxy on production VPS
OVHcloud - VPS hosting
GitHub Actions + GHCR - CI/CD & container registry
Aqua Trivy - dependency & image scanning
SonarQube - static analysis

/* SITE */
Last update: ${TODAY}
Language: fr-FR / en-US
Standards: HTML5, CSS3, ES2022+, JSON-LD, Open Graph, llms.txt
Software: React, TypeScript, Vite, Bun, Tailwind CSS, nginx
Doctype: HTML5
IDE: Cursor, VS Code
`;
  writeBoth('humans.txt', content);
}

function generateSecurityTxt() {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  const content = `Contact: mailto:${AUTHOR_EMAIL}
Contact: ${SOCIAL.linkedin}
Expires: ${expires.toISOString()}
Preferred-Languages: fr, en
Canonical: ${SITE_URL}/.well-known/security.txt
Policy: ${SITE_URL}/contact
Hiring: ${SITE_URL}/cv
Acknowledgments: ${SITE_URL}/humans.txt
`;
  const relative = '.well-known/security.txt';
  ensureDir(join(WELL_KNOWN, 'security.txt'));
  writeFileSync(join(PUBLIC_DIR, relative), content, 'utf8');
  if (existsSync(DIST_DIR)) {
    ensureDir(join(DIST_DIR, relative));
    writeFileSync(join(DIST_DIR, relative), content, 'utf8');
  }
}

function generateSitemaps() {
  const pages: UrlEntry[] = STATIC_PAGES.map((p) => ({
    loc: absoluteUrl(p.path),
    lastmod: TODAY,
    changefreq: p.changefreq,
    priority: p.priority,
  }));

  const projets: UrlEntry[] = [
    {
      loc: absoluteUrl('/projects'),
      lastmod: TODAY,
      changefreq: 'weekly',
      priority: 0.9,
    },
    ...projectsData.map((p) => ({
      loc: absoluteUrl(`/projects/${getProjectPathSlug(p)}`),
      lastmod: TODAY,
      changefreq: 'monthly',
      priority: p.isFeatured ? 0.85 : 0.75,
    })),
  ];

  const blog: UrlEntry[] = [
    {
      loc: absoluteUrl('/blog'),
      lastmod: TODAY,
      changefreq: 'weekly',
      priority: 0.8,
    },
    ...blogPostsData.map((p) => ({
      loc: absoluteUrl(`/blog/${getBlogPathSlug(p)}`),
      lastmod: toSitemapDate(p.date, TODAY),
      changefreq: 'monthly',
      priority: 0.7,
    })),
  ];

  // Image sitemap (Google image extension) - only real page URLs
  const imageUrls: string[] = [];
  imageUrls.push(`  <url>
    <loc>${escapeXml(absoluteUrl('/'))}</loc>
    <image:image>
      <image:loc>${escapeXml(DEFAULT_OG_IMAGE)}</image:loc>
      <image:title>${escapeXml(SITE_NAME_FULL)}</image:title>
      <image:caption>${escapeXml(DEFAULT_DESCRIPTION)}</image:caption>
    </image:image>
    <image:image>
      <image:loc>${escapeXml(`${SITE_URL}/images/barthez-kenwou.png`)}</image:loc>
      <image:title>${escapeXml('Portrait Barthez Kenwou')}</image:title>
    </image:image>
  </url>`);

  for (const p of projectsData) {
    const images = (p.images?.length ? p.images : [projectImage(p)]).slice(0, 8);
    const imageBlocks = images
      .map(
        (img) => `    <image:image>
      <image:loc>${escapeXml(img)}</image:loc>
      <image:title>${escapeXml(p.titleFr)}</image:title>
      <image:caption>${escapeXml(truncate(p.descriptionFr, 200))}</image:caption>
    </image:image>`,
      )
      .join('\n');
    imageUrls.push(`  <url>
    <loc>${escapeXml(absoluteUrl(`/projects/${getProjectPathSlug(p)}`))}</loc>
${imageBlocks}
  </url>`);
  }

  for (const post of blogPostsData) {
    if (!post.image) continue;
    imageUrls.push(`  <url>
    <loc>${escapeXml(absoluteUrl(`/blog/${getBlogPathSlug(post)}`))}</loc>
    <image:image>
      <image:loc>${escapeXml(post.image)}</image:loc>
      <image:title>${escapeXml(blogTitle(post))}</image:title>
      <image:caption>${escapeXml(truncate(blogExcerpt(post), 200))}</image:caption>
    </image:image>
  </url>`);
  }

  const imagesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${imageUrls.join('\n')}
</urlset>
`;

  const videoBlocks: string[] = [];
  for (const p of projectsData) {
    if (!p.videoDemo) continue;
    videoBlocks.push(`  <url>
    <loc>${escapeXml(absoluteUrl(`/projects/${getProjectPathSlug(p)}`))}</loc>
    <video:video>
      <video:thumbnail_loc>${escapeXml(projectImage(p))}</video:thumbnail_loc>
      <video:title>${escapeXml(p.titleFr)}</video:title>
      <video:description>${escapeXml(truncate(p.descriptionFr, 2048))}</video:description>
      <video:content_loc>${escapeXml(p.videoDemo)}</video:content_loc>
      <video:family_friendly>yes</video:family_friendly>
      <video:live>no</video:live>
    </video:video>
  </url>`);
  }

  const videosXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${videoBlocks.length ? videoBlocks.join('\n') : `  <!-- No hosted video demos yet - update when videoDemo URLs are added -->`}
</urlset>
`;

  const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap-pages.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-projets.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-blog.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-images.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-videos.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
</sitemapindex>
`;

  const flat = writeUrlset([...pages, ...projets.slice(1), ...blog.slice(1)]);

  writeBoth('sitemap-pages.xml', writeUrlset(pages));
  writeBoth('sitemap-projets.xml', writeUrlset(projets));
  writeBoth('sitemap-blog.xml', writeUrlset(blog));
  writeBoth('sitemap-images.xml', imagesXml);
  writeBoth('sitemap-videos.xml', videosXml);
  writeBoth('sitemap-index.xml', indexXml);
  writeBoth('sitemap.xml', flat);
}

function generateLlms() {
  const featured = projectsData.filter((p) => p.isFeatured);
  const categories = collectCategories();

  const projectLinks = projectsData
    .map(
      (p) =>
        `- [${p.titleFr}](${absoluteUrl(`/projects/${getProjectPathSlug(p)}`)}): ${truncate(p.descriptionFr, 140)} [${p.category}]`,
    )
    .join('\n');

  const featuredLinks = featured
    .map(
      (p) =>
        `- [${p.titleFr}](${absoluteUrl(`/projects/${getProjectPathSlug(p)}`)}): ${truncate(p.descriptionFr, 140)}`,
    )
    .join('\n');

  const blogLinks = blogPostsData
    .map(
      (p) =>
        `- [${blogTitle(p)}](${absoluteUrl(`/blog/${getBlogPathSlug(p)}`)}): ${truncate(blogExcerpt(p), 120)} (${p.category}, ${p.readTime})`,
    )
    .join('\n');

  const categoryNotes = [...categories.entries()]
    .map(([name, posts]) => `- ${name}: ${posts.length} article(s) (filtre UI sur /blog)`)
    .join('\n');

  const llms = `# ${SITE_NAME}

> ${DEFAULT_DESCRIPTION}

Barthez Kenwou est un développeur Full Stack JavaScript et ingénieur DevOps spécialisé AWS Cloud, basé à ${AUTHOR_LOCATION}.
Ce site portfolio présente ses services, compétences, études de cas projets et articles techniques (FR/EN).

Langues du site : français (par défaut) et anglais (même URL, bascule UI).
Contact : ${AUTHOR_EMAIL} · ${AUTHOR_PHONE} · ${SOCIAL.linkedin} · ${SOCIAL.github}

## Pages principales

- [Accueil](${absoluteUrl('/')}): Présentation, positionnement Full Stack & DevOps, appels à l'action
- [À propos](${absoluteUrl('/about')}): Parcours, vision et expertise
- [Services](${absoluteUrl('/services')}): Offres développement, cloud, CI/CD, Kubernetes, sécurité
- [Projets](${absoluteUrl('/projects')}): Catalogue d'études de cas techniques
- [Compétences](${absoluteUrl('/skills')}): Stack Frontend, Backend, Cloud, DevOps
- [Blog](${absoluteUrl('/blog')}): Tutoriels AWS, DevOps, Node.js, React, sécurité
- [CV](${absoluteUrl('/cv')}): Expériences, formations et téléchargement CV
- [Contact](${absoluteUrl('/contact')}): Email, téléphone, WhatsApp, réseaux

## Projets en vedette

${featuredLinks}

## Tous les projets (${projectsData.length})

${projectLinks}

## Articles du blog (${blogPostsData.length})

${blogLinks}

## Thématiques blog (filtres in-page)

${categoryNotes}

## Fichiers machine-readable

- [llms-full.txt](${SITE_URL}/llms-full.txt): Contenu Markdown étendu (bio, projets, articles)
- [sitemap-index.xml](${SITE_URL}/sitemap-index.xml): Index des sitemaps Google
- [robots.txt](${SITE_URL}/robots.txt): Politique de crawl
- [humans.txt](${SITE_URL}/humans.txt): Crédits humains & stack
- [security.txt](${SITE_URL}/.well-known/security.txt): Contact sécurité (RFC 9116)
- [Open Graph image](${DEFAULT_OG_IMAGE}): Visuel de partage 1200×630

## Optional

- [GitHub](${SOCIAL.github}): Dépôts open source et expérimentations
- [LinkedIn](${SOCIAL.linkedin}): Profil professionnel
`;

  // Full companion file - dense context for agents
  const projectFull = projectsData
    .map((p) => {
      const tech = flattenTech(p).join(', ');
      return `### ${p.titleFr}

- URL: ${absoluteUrl(`/projects/${getProjectPathSlug(p)}`)}
- EN: ${p.titleEn}
- Category: ${p.category}
- Status: ${p.status} · Role: ${p.role} · Duration: ${p.duration} · Date: ${p.date}
- Featured: ${p.isFeatured ? 'yes' : 'no'}
- Tech: ${tech || 'n/a'}
- Demo: ${p.demo || 'n/a'}
- GitHub: ${p.github || 'n/a'}
- Image: ${projectImage(p)}

**FR:** ${p.descriptionFr}

${p.fullDescriptionFr ? truncate(p.fullDescriptionFr, 1200) : ''}

**Problem:** ${p.problemFr}

**Impact:** ${(p.impactFr || []).join(' · ')}
`;
    })
    .join('\n');

  const blogFull = blogPostsData
    .map((p) => {
      const body = truncate((p.contentFr || '').replace(/```[\s\S]*?```/g, '[code]'), 1800);
      return `### ${blogTitle(p)}

- URL: ${absoluteUrl(`/blog/${getBlogPathSlug(p)}`)}
- Slug: ${p.slug || 'n/a'}
- Category: ${p.category} · ${p.date} · ${p.readTime}
- Tags: ${(p.tags || []).join(', ')}
- Cover: ${p.image}

**Excerpt:** ${blogExcerpt(p)}

${body}
`;
    })
    .join('\n');

  const llmsFull = `# ${SITE_NAME_FULL} - Full context for LLMs

> ${DEFAULT_DESCRIPTION}

## Identity

- Name: ${SITE_NAME}
- Titles: Développeur Full Stack & Ingénieur DevOps · AWS Cloud Specialist
- Location: ${AUTHOR_LOCATION}
- Email: ${AUTHOR_EMAIL}
- Phone: ${AUTHOR_PHONE}
- Website: ${SITE_URL}/
- GitHub: ${SOCIAL.github}
- LinkedIn: ${SOCIAL.linkedin}
- WhatsApp: ${SOCIAL.whatsapp}

## Positioning

Je conçois et déploie des applications web modernes (React/TypeScript/Node.js) avec une culture DevOps forte : CI/CD, Docker, Kubernetes, Terraform, sécurité (DevSecOps), observabilité et cloud AWS.
Ce portfolio documente des études de cas réelles (SaaS, PWA, ERP Odoo, hardening Linux, supply chain security, monitoring LGTM) et des articles techniques détaillés.

## Primary pages

${STATIC_PAGES.map((p) => `- ${p.titleFr}: ${absoluteUrl(p.path)} - ${p.descriptionFr}`).join('\n')}

## Projects detail

${projectFull}

## Blog detail

${blogFull}

## Discovery endpoints

- ${SITE_URL}/llms.txt
- ${SITE_URL}/sitemap-index.xml
- ${SITE_URL}/robots.txt
- ${SITE_URL}/.well-known/security.txt
`;

  writeBoth('llms.txt', llms);
  writeBoth('llms-full.txt', llmsFull);
}

function replaceMeta(
  html: string,
  attr: 'name' | 'property',
  key: string,
  content: string,
): string {
  const re = new RegExp(`<meta\\s+${attr}=["']${key}["']\\s+content=["'][^"']*["']\\s*/?>`, 'i');
  const tag = `<meta ${attr}="${key}" content="${escapeHtml(content)}" />`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace('</head>', `  ${tag}\n</head>`);
}

function replaceTitle(html: string, title: string): string {
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
}

function replaceCanonical(html: string, url: string): string {
  const re = /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i;
  const tag = `<link rel="canonical" href="${escapeHtml(url)}" />`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace('</head>', `  ${tag}\n</head>`);
}

function injectJsonLd(html: string, id: string, data: unknown): string {
  const script = `<script type="application/ld+json" id="${id}">${JSON.stringify(data)}</script>`;
  // Remove previous same id if any
  const cleaned = html.replace(
    new RegExp(`<script[^>]*id="${id}"[^>]*>[\\s\\S]*?<\\/script>`, 'i'),
    '',
  );
  return cleaned.replace('</head>', `  ${script}\n</head>`);
}

function injectRoot(html: string, bodyInner: string): string {
  const block = `<div id="root">
    <main id="seo-prerender" data-seo-prerender="true" style="max-width:72rem;margin:0 auto;padding:1.5rem;font-family:system-ui,sans-serif;line-height:1.6;color:#111;background:#fff">
      ${bodyInner}
      <hr />
      <p style="font-size:.875rem;opacity:.8">Site de <strong>${escapeHtml(SITE_NAME)}</strong> - <a href="${SITE_URL}/">${SITE_URL}</a></p>
    </main>
  </div>`;
  return html.replace(/<div id="root"><\/div>/i, block);
}

type PrerenderPage = {
  path: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  type?: string;
  bodyHtml: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

function buildPrerenderPages(): PrerenderPage[] {
  const pages: PrerenderPage[] = [];

  for (const p of STATIC_PAGES) {
    let body = p.bodyFr;
    if (p.path === '/projects') {
      const list = projectsData
        .map(
          (proj) =>
            `<li><a href="${absoluteUrl(`/projects/${getProjectPathSlug(proj)}`)}"><strong>${escapeHtml(proj.titleFr)}</strong></a> - ${escapeHtml(truncate(proj.descriptionFr, 160))}</li>`,
        )
        .join('\n');
      body += `<ul>\n${list}\n</ul>`;
    }
    if (p.path === '/blog') {
      const list = blogPostsData
        .map(
          (post) =>
            `<li><a href="${absoluteUrl(`/blog/${getBlogPathSlug(post)}`)}"><strong>${escapeHtml(blogTitle(post))}</strong></a> - ${escapeHtml(truncate(blogExcerpt(post), 140))} <em>(${escapeHtml(post.category)})</em></li>`,
        )
        .join('\n');
      body += `<ul>\n${list}\n</ul>`;
    }
    pages.push({
      path: p.path,
      title: p.titleFr,
      description: p.descriptionFr,
      bodyHtml: body,
      type: 'website',
    });
  }

  for (const proj of projectsData) {
    const tech = flattenTech(proj);
    const solutions = (proj.solutionFr || []).map((s) => `<li>${escapeHtml(s)}</li>`).join('');
    pages.push({
      path: `/projects/${getProjectPathSlug(proj)}`,
      title: `${truncate(proj.titleFr, 55)} | ${SITE_NAME}`,
      description: truncate(proj.descriptionFr, 160),
      image: projectImage(proj),
      imageAlt: proj.titleFr,
      type: 'article',
      bodyHtml: `<article>
  <h1>${escapeHtml(proj.titleFr)}</h1>
  <p><strong>${escapeHtml(proj.category)}</strong> · ${escapeHtml(proj.status)} · ${escapeHtml(proj.role)} · ${escapeHtml(proj.duration)}</p>
  <p>${escapeHtml(proj.descriptionFr)}</p>
  <h2>Problème</h2>
  <p>${escapeHtml(proj.problemFr)}</p>
  <h2>Solution</h2>
  <ul>${solutions}</ul>
  <h2>Stack</h2>
  <p>${escapeHtml(tech.join(', '))}</p>
  ${proj.demo ? `<p><a href="${escapeHtml(proj.demo)}">Démo</a></p>` : ''}
  ${proj.github ? `<p><a href="${escapeHtml(proj.github)}">Code source</a></p>` : ''}
  <p><a href="${absoluteUrl('/projects')}">Tous les projets</a> · <a href="${absoluteUrl('/contact')}">Contact</a></p>
</article>`,
      jsonLd: {
        '@type': 'CreativeWork',
        name: proj.titleFr,
        alternateName: proj.titleEn,
        description: proj.descriptionFr,
        url: absoluteUrl(`/projects/${getProjectPathSlug(proj)}`),
        image: projectImage(proj),
        dateCreated: proj.date,
        author: { '@type': 'Person', name: SITE_NAME, url: SITE_URL },
        keywords: tech.join(', '),
      },
    });
  }

  for (const post of blogPostsData) {
    const related = blogPostsData
      .filter((p) => p.category === post.category && p.id !== post.id)
      .slice(0, 4)
      .map(
        (p) =>
          `<li><a href="${absoluteUrl(`/blog/${getBlogPathSlug(p)}`)}">${escapeHtml(blogTitle(p))}</a></li>`,
      )
      .join('');
    pages.push({
      path: `/blog/${getBlogPathSlug(post)}`,
      title: `${truncate(blogTitle(post), 55)} | Blog`,
      description: truncate(blogExcerpt(post), 160),
      image: post.image || DEFAULT_OG_IMAGE,
      imageAlt: blogTitle(post),
      type: 'article',
      bodyHtml: `<article>
  <h1>${escapeHtml(blogTitle(post))}</h1>
  <p>${escapeHtml(post.category)} · ${escapeHtml(post.date)} · ${escapeHtml(post.readTime)} · ${escapeHtml(post.author)}</p>
  <p>${escapeHtml(blogExcerpt(post))}</p>
  <p>Tags : ${escapeHtml((post.tags || []).join(', '))}</p>
  ${related ? `<h2>Articles liés</h2><ul>${related}</ul>` : ''}
  <p><a href="${absoluteUrl('/blog')}">Retour au blog</a></p>
</article>`,
      jsonLd: {
        '@type': 'BlogPosting',
        headline: blogTitle(post),
        description: blogExcerpt(post),
        image: post.image,
        datePublished: post.date,
        author: { '@type': 'Person', name: post.author || SITE_NAME, url: SITE_URL },
        mainEntityOfPage: absoluteUrl(`/blog/${getBlogPathSlug(post)}`),
        keywords: (post.tags || []).join(', '),
        articleSection: post.category,
      },
    });
  }

  return pages;
}

function prerender() {
  if (!existsSync(DIST_DIR)) {
    console.warn('[seo] dist/ missing - skip HTML prerender (run vite build first)');
    return 0;
  }
  const indexPath = join(DIST_DIR, 'index.html');
  if (!existsSync(indexPath)) {
    console.warn('[seo] dist/index.html missing - skip prerender');
    return 0;
  }

  const template = readFileSync(indexPath, 'utf8');
  const pages = buildPrerenderPages();
  let count = 0;

  for (const page of pages) {
    let html = template;
    const url = absoluteUrl(page.path);
    const image = page.image || DEFAULT_OG_IMAGE;
    const imageAlt = page.imageAlt || SITE_NAME_FULL;

    html = replaceTitle(html, page.title);
    html = replaceCanonical(html, url);
    html = replaceMeta(html, 'name', 'description', page.description);
    html = replaceMeta(html, 'property', 'og:title', page.title);
    html = replaceMeta(html, 'property', 'og:description', page.description);
    html = replaceMeta(html, 'property', 'og:url', url);
    html = replaceMeta(html, 'property', 'og:image', image);
    html = replaceMeta(html, 'property', 'og:image:secure_url', image);
    html = replaceMeta(html, 'property', 'og:image:alt', imageAlt);
    html = replaceMeta(html, 'property', 'og:type', page.type || 'website');
    html = replaceMeta(html, 'name', 'twitter:title', page.title);
    html = replaceMeta(html, 'name', 'twitter:description', page.description);
    html = replaceMeta(html, 'name', 'twitter:image', image);
    html = replaceMeta(html, 'name', 'twitter:image:alt', imageAlt);

    if (page.jsonLd) {
      const payload = Array.isArray(page.jsonLd)
        ? { '@context': 'https://schema.org', '@graph': page.jsonLd }
        : { '@context': 'https://schema.org', ...page.jsonLd };
      html = injectJsonLd(html, 'seo-jsonld-prerender', payload);
    }

    html = injectRoot(html, page.bodyHtml);
    // Page-specific crawlable body lives in #root - drop the home-only noscript shell
    html = html.replace(/<noscript>[\s\S]*?<\/noscript>/i, '');

    const outFile =
      page.path === '/'
        ? join(DIST_DIR, 'index.html')
        : join(DIST_DIR, page.path.replace(/^\//, ''), 'index.html');

    ensureDir(outFile);
    writeFileSync(outFile, html, 'utf8');
    count += 1;
  }

  return count;
}

function main() {
  console.log('[seo] generating discovery files + prerender…');
  mkdirSync(WELL_KNOWN, { recursive: true });
  generateRobots();
  generateHumans();
  generateSecurityTxt();
  generateSitemaps();
  generateLlms();
  const prerendered = prerender();
  console.log(
    `[seo] done - ${STATIC_PAGES.length} pages, ${projectsData.length} projects, ${blogPostsData.length} posts, ${prerendered} HTML shells`,
  );
}

main();
