# Project documentation

Documentation for the **Barthez Kenwou Portfolio** - architecture, domain, workflows, and production deployment.

Live site: [https://barthez-kenwou.dev](https://barthez-kenwou.dev)

---

## Documentation map

| Area                                      | Description                                      |
| :---------------------------------------- | :----------------------------------------------- |
| [Architecture](./architecture/README.md)  | FSD layers, routing, state, diagrams             |
| [Features](./features/README.md)          | Theme, i18n, contact, and related capabilities   |
| [Entities](./entities/README.md)          | Domain models (project, blog, skill, experience) |
| [Onboarding](./onboarding/README.md)      | Local setup, first feature, FAQ                  |
| [Guidelines](./guidelines/README.md)      | Coding standards, naming, testing, deps          |
| [Deployment](./deployment/README.md)      | OVH VPS, GHCR, Watchtower, NPM                   |
| [API conventions](./api/README.md)        | Client conventions and error handling            |
| [ADRs](./decisions/README.md)             | Architecture decision records                    |
| [Project analysis](./PROJECT_ANALYSIS.md) | Executive summary of the product and stack       |

Related (outside `docs/`):

- [../README.md](../README.md) - project entrypoint
- [../infra/README.md](../infra/README.md) - Docker / nginx
- [../.github/workflows/README.md](../.github/workflows/README.md) - CI/CD workflows
- [../CONTRIBUTING.md](../CONTRIBUTING.md) - contribution rules
- [../scripts/README.md](../scripts/README.md) - build / tooling scripts

---

## Tech stack (summary)

| Layer             | Tools                                                                |
| :---------------- | :------------------------------------------------------------------- |
| **Core**          | React 18, TypeScript, Vite (Rolldown), Bun                           |
| **UI**            | Tailwind CSS 4, Radix UI, Framer Motion                              |
| **State / forms** | Zustand, React Hook Form, Zod                                        |
| **Content**       | Velite, React Markdown, Shiki                                        |
| **i18n**          | i18next                                                              |
| **QA**            | Vitest, Cypress, Storybook, Lighthouse CI, Husky, Commitlint         |
| **Runtime / CD**  | Nginx, Docker, GHCR, GitHub Actions, Watchtower, Nginx Proxy Manager |

---

## Quick start

```bash
bun install
cp .env.example .env
bun run dev
```

Details: [onboarding/setup-local.md](./onboarding/setup-local.md)

Production deploy: [deployment/DEPLOY_VPS.md](./deployment/DEPLOY_VPS.md)
