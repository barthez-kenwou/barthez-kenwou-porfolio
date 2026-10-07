# Deployment

Production hosting for [barthez-kenwou.dev](https://barthez-kenwou.dev).

## Pipeline (summary)

```text
push main → CI → Gitleaks → SonarQube → Trivy (FS)
         → build Docker image → push GHCR (sha + latest) → Trivy (image)
         → SSH deploy (compose pull + up)
         → Watchtower keeps :latest in sync on the VPS
```

Edge TLS / routing: **Nginx Proxy Manager** on Docker network `web-proxy` → container `barthez-portfolio-web:8080`.

## Guides

| Document                         | Content                                                   |
| :------------------------------- | :-------------------------------------------------------- |
| [DEPLOY_VPS.md](./DEPLOY_VPS.md) | Full OVH VPS guide (secrets, bootstrap, NPM, smoke tests) |

## Related

- [../../infra/README.md](../../infra/README.md) - Dockerfiles, compose, nginx
- [../../.github/workflows/README.md](../../.github/workflows/README.md) - `deploy-vps.yml`, `ci.yml`, `qa.yml`

## Image & compose (quick refs)

| Item               | Value                                            |
| :----------------- | :----------------------------------------------- |
| GHCR image         | `ghcr.io/barthez-kenwou/barthez-kenwou-porfolio` |
| Runtime Dockerfile | `infra/docker/Dockerfile.runtime`                |
| Prod compose       | `infra/docker/docker-compose.prod.yml`           |
| Health             | `GET /health` → `200 OK`                         |
