# Barthez Kenwou Portfolio

Professional portfolio of **Barthez Kenwou** - Full Stack Developer & DevOps Engineer (AWS).  
Live site: [https://barthez-kenwou.dev](https://barthez-kenwou.dev)

[![Version](https://img.shields.io/badge/version-1.4.0-blue.svg)](./package.json)
[![License](https://img.shields.io/badge/license-UNLICENSED-red.svg)](./LICENSE)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

---

## Overview

SPA portfolio built with React 18 + TypeScript, Feature-Sliced Design, and a production DevOps pipeline (GHCR → OVH VPS).

**Highlights**

- Dark premium UI, glassmorphism, Framer Motion, PWA
- FR / EN via `i18next`
- Blog (Markdown + Shiki), projects, skills, services, CV (PDF)
- SEO: sitemaps, Open Graph, robots, prerender-oriented meta
- CI/CD: GitHub Actions → Gitleaks → SonarQube → Trivy → GHCR → SSH deploy + Watchtower

Full documentation lives in [`docs/`](./docs/README.md).

---

## Tech stack

| Layer             | Tools                                                           |
| :---------------- | :-------------------------------------------------------------- |
| **App**           | React 18, TypeScript, Vite (Rolldown), Bun                      |
| **UI**            | Tailwind CSS 4, Radix UI, Framer Motion / Motion                |
| **State & forms** | Zustand, React Hook Form, Zod                                   |
| **Content**       | Velite, React Markdown, Shiki                                   |
| **i18n**          | i18next, react-i18next                                          |
| **QA**            | Vitest, Cypress, Storybook, ESLint, Prettier, Lighthouse CI     |
| **Runtime**       | Nginx (Alpine), Docker, PWA (Workbox)                           |
| **CD**            | GitHub Actions, GHCR, Watchtower, Nginx Proxy Manager (OVH VPS) |

---

## Project structure

```text
src/
├── app/        # Providers, router, global styles
├── pages/      # Route compositions (Home, Blog, Projects, …)
├── widgets/    # Navbar, Sidebar, Footer, …
├── features/   # User scenarios (theme, language, contact, …)
├── entities/   # Domain (blog, projects, skills, …)
└── shared/     # UI kit, hooks, config, utils

infra/          # Docker, nginx, compose, VPS bootstrap
docs/           # Architecture, guidelines, deployment
.github/        # CI / CD workflows
```

Architecture details: [docs/architecture](./docs/architecture/frontend-architecture.md).

---

## Getting started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.3
- Node.js >= 18 (CI / tooling fallback)
- Git

### Install

```bash
git clone git@github.com:barthez-kenwou/barthez-kenwou-porfolio.git
cd barthez-kenwou-porfolio
bun install
cp .env.example .env
```

### Develop

```bash
bun run dev
```

App: `http://localhost:5173`

See [docs/onboarding/setup-local.md](./docs/onboarding/setup-local.md).

---

## Scripts

| Command                        | Description                           |
| :----------------------------- | :------------------------------------ |
| `bun run dev`                  | Vite dev server                       |
| `bun run build`                | Production build (`scripts/build.sh`) |
| `bun run preview`              | Preview production build              |
| `bun run lint`                 | ESLint                                |
| `bun run typecheck`            | TypeScript (`tsc --noEmit`)           |
| `bun run test` / `test:ci`     | Vitest                                |
| `bun run validate`             | lint + typecheck + test:ci            |
| `bun run e2e:open` / `e2e:run` | Cypress                               |
| `bun run storybook`            | Storybook                             |
| `bun run seo:generate`         | Generate SEO artifacts                |

---

## Deployment

Production path:

```text
push main → CI → Gitleaks → SonarQube → Trivy
         → Docker image → GHCR (sha + latest)
         → SSH on OVH VPS (compose pull/up)
         → Watchtower keeps :latest in sync
```

Edge: Nginx Proxy Manager → `barthez-portfolio-web:8080` (TLS).

Guides:

- [docs/deployment/DEPLOY_VPS.md](./docs/deployment/DEPLOY_VPS.md)
- [infra/README.md](./infra/README.md)
- [.github/workflows/README.md](./.github/workflows/README.md)

Local image smoke test:

```bash
NODE_ENV=production VITE_SKIP_IMAGEMIN=true bunx vite build
docker build -f infra/docker/Dockerfile.runtime -t barthez-kenwou-portfolio:local .
docker run --rm -p 18080:8080 barthez-kenwou-portfolio:local
curl -fsS http://127.0.0.1:18080/health
```

---

## Documentation map

| Section          | Path                                                              |
| :--------------- | :---------------------------------------------------------------- |
| Docs index       | [docs/README.md](./docs/README.md)                                |
| Architecture     | [docs/architecture](./docs/architecture/frontend-architecture.md) |
| Features         | [docs/features](./docs/features/README.md)                        |
| Entities         | [docs/entities](./docs/entities/README.md)                        |
| Guidelines       | [docs/guidelines](./docs/guidelines/README.md)                    |
| Onboarding       | [docs/onboarding](./docs/onboarding/README.md)                    |
| Deployment       | [docs/deployment](./docs/deployment/README.md)                    |
| ADRs             | [docs/decisions](./docs/decisions/README.md)                      |
| Project analysis | [docs/PROJECT_ANALYSIS.md](./docs/PROJECT_ANALYSIS.md)            |
| Contributing     | [CONTRIBUTING.md](./CONTRIBUTING.md)                              |

---

## License

`UNLICENSED` - owned and maintained by **Barthez Kenwou**.
