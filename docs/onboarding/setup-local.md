# Local development setup

Get the **Barthez Kenwou Portfolio** running on your machine.

## 1. Prerequisites

- **Bun** (>= 1.3) - install, scripts, preferred runtime
- **Node.js** (>= 18) - CI / some tooling
- **Git**
- Optional: **Docker** - local nginx image smoke tests

## 2. Install

```bash
bun install
```

## 3. Environment

```bash
cp .env.example .env
```

Useful variables:

| Variable                         | Role                            |
| :------------------------------- | :------------------------------ |
| `VITE_SITE_URL` / `VITE_APP_URL` | Canonical site URL              |
| `VITE_ENABLE_PWA`                | Enable service worker in builds |
| `VITE_API_BASE_URL`              | Optional backend base URL       |
| `VITE_PRESENTATION_YOUTUBE_URL`  | Optional presentation video     |

## 4. Dev server

```bash
bun run dev
```

Open `http://localhost:5173`.

## 5. Daily commands

| Action          | Command                            |
| :-------------- | :--------------------------------- |
| Build           | `bun run build`                    |
| Lint            | `bun run lint`                     |
| Typecheck       | `bun run typecheck`                |
| Unit tests      | `bun run test` / `bun run test:ci` |
| Full local gate | `bun run validate`                 |
| Storybook       | `bun run storybook`                |
| SEO artifacts   | `bun run seo:generate`             |

## 6. Docker smoke test (optional)

```bash
NODE_ENV=production VITE_SKIP_IMAGEMIN=true bunx vite build
docker build -f infra/docker/Dockerfile.runtime -t barthez-kenwou-portfolio:local .
docker run --rm -p 18080:8080 barthez-kenwou-portfolio:local
curl -fsS http://127.0.0.1:18080/health
```

More: [../deployment/README.md](../deployment/README.md), [../../infra/README.md](../../infra/README.md)

## Next

- [first-feature.md](./first-feature.md)
- [faq.md](./faq.md)
