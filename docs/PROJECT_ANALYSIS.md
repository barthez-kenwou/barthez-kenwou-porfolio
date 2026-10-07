# Project analysis: Barthez Kenwou Portfolio

## Executive summary

High-end personal portfolio for **Barthez Kenwou** (Full Stack & DevOps).  
Focus: premium dark UI, FSD architecture, SEO, PWA, and a real production CD path to an OVH VPS via GHCR.

Live: [https://barthez-kenwou.dev](https://barthez-kenwou.dev)

---

## Tech stack

| Category          | Technologies                                                                      |
| :---------------- | :-------------------------------------------------------------------------------- |
| **Frontend**      | React 18, TypeScript, Vite (Rolldown), Bun                                        |
| **UI**            | Tailwind CSS 4, Radix UI, Framer Motion / Motion                                  |
| **Architecture**  | Feature-Sliced Design (FSD)                                                       |
| **State**         | Zustand                                                                           |
| **Content**       | Velite, React Markdown, Shiki                                                     |
| **i18n**          | i18next, react-i18next                                                            |
| **Forms**         | React Hook Form, Zod                                                              |
| **QA**            | Vitest, Cypress, Storybook, ESLint, Prettier, Husky, Commitlint                   |
| **Runtime**       | Nginx (Alpine), Docker, PWA (Workbox)                                             |
| **CD / security** | GitHub Actions, GHCR, Gitleaks, SonarQube, Trivy, Watchtower, Nginx Proxy Manager |

---

## Architecture (FSD)

| Layer          | Role                                                                               |
| :------------- | :--------------------------------------------------------------------------------- |
| `src/app`      | Providers, router, global styles                                                   |
| `src/pages`    | Route compositions (Home, About, Blog, Contact, CV, Projects, Services, Skills, …) |
| `src/widgets`  | Navbar, Sidebar, Footer, …                                                         |
| `src/features` | Theme, language, contact, …                                                        |
| `src/entities` | Blog, projects, skills, experiences, services, …                                   |
| `src/shared`   | UI kit, hooks, config, utils                                                       |

Details: [architecture/frontend-architecture.md](./architecture/frontend-architecture.md)

---

## Product surface

- Premium dark / light UI (glassmorphism, ambient flares, motion)
- Multilingual FR / EN
- Blog with syntax highlighting
- Projects, skills, services, testimonials, CV (PDF)
- SEO artifacts (sitemaps, OG, robots, llms.txt)
- Branding error pages (404 / ErrorBoundary) that keep site chrome when possible
- Installable PWA

---

## DevOps & quality

```text
push main → CI (format / lint / typecheck / tests / build)
         → Gitleaks → SonarQube → Trivy FS
         → Docker (Dockerfile.runtime + dist) → GHCR
         → Trivy image → SSH compose pull/up
         → Watchtower syncs :latest on VPS
```

TLS: Nginx Proxy Manager → `barthez-portfolio-web:8080` on `web-proxy`.

Full guide: [deployment/DEPLOY_VPS.md](./deployment/DEPLOY_VPS.md)

---

## Key paths

| Concern                 | Path                                                    |
| :---------------------- | :------------------------------------------------------ |
| Content / Velite        | `velite.config.ts`                                      |
| Tailwind / theme tokens | `tailwind.config.ts`, `src/index.css`, `src/app/style/` |
| Shared UI               | `src/shared/ui/`                                        |
| Public pages            | `src/pages/public/`                                     |
| Nginx / Docker          | `infra/docker/`                                         |
| CD workflow             | `.github/workflows/deploy-vps.yml`                      |

---

## Fast track

```bash
bun install
cp .env.example .env
bun run dev
```

```bash
bun run build
bun run preview
```

```bash
bun run lint && bun run typecheck && bun run test:ci
```

Onboarding: [onboarding/setup-local.md](./onboarding/setup-local.md)

---

## Design direction

Dark premium / glassmorphism:

- Contrast and readability first
- Motion used for hierarchy, not noise
- Typography aligned across pages
- Developer-facing details (code blocks, terminal-like accents where relevant)
