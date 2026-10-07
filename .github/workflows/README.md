# Workflows

CI/CD for the portfolio. Primary hosting is **OVH VPS + GHCR** (not Vercel).

| Workflow                             | Trigger                                     | Role                                                       |
| :----------------------------------- | :------------------------------------------ | :--------------------------------------------------------- |
| [`deploy-vps.yml`](./deploy-vps.yml) | Push `main` / `master`, `workflow_dispatch` | Full CD: CI → Gitleaks → Sonar → Trivy → GHCR → SSH deploy |
| [`ci.yml`](./ci.yml)                 | PRs + `develop` / `development`             | Format, lint, typecheck, tests, build artifact             |
| [`qa.yml`](./qa.yml)                 | PRs (optional)                              | E2E / Lighthouse                                           |

## Production CD (`deploy-vps.yml`)

```text
CI → Gitleaks → SonarQube → Trivy (FS)
  → build + push image to GHCR (sha + latest)
  → Trivy (image)
  → SSH: docker compose pull + up
```

Watchtower on the VPS also polls GHCR and recreates when `:latest` moves.

Secrets and bootstrap: [docs/deployment/DEPLOY_VPS.md](../../docs/deployment/DEPLOY_VPS.md)

## Notes

- Repo and GHCR package are **private** - VPS needs `docker login ghcr.io` (`GHCR_PULL_TOKEN` recommended for Watchtower).
- Health endpoint: `GET /health` (must stay a valid single-line HTTP response; CSP is single-line in `infra/docker/nginx.conf`).
