# Infrastructure

Docker, nginx, and VPS bootstrap for [barthez-kenwou.dev](https://barthez-kenwou.dev).

Full deploy guide: [docs/deployment/DEPLOY_VPS.md](../docs/deployment/DEPLOY_VPS.md)  
Docs index: [docs/deployment/README.md](../docs/deployment/README.md)

## Docker (production path)

| File                             | Purpose                                                 |
| -------------------------------- | ------------------------------------------------------- |
| `docker/Dockerfile`              | Multi-stage Bun → nginx (optional full in-image build)  |
| `docker/Dockerfile.runtime`      | **CI default** - nginx:stable-alpine + prebuilt `dist/` |
| `docker/docker-compose.yml`      | Local build + optional Watchtower profile               |
| `docker/docker-compose.prod.yml` | VPS pull-only from GHCR                                 |
| `docker/nginx.conf`              | SPA on `:8080`, `/health`, security headers             |
| `scripts/bootstrap-vps.sh`       | One-shot VPS bootstrap                                  |

Full guide: [docs/deployment/DEPLOY_VPS.md](../docs/deployment/DEPLOY_VPS.md)

Production sits behind **Nginx Proxy Manager** on external network `web-proxy`  
(`barthez-kenwou.dev` → `barthez-portfolio-web:8080`). Repo + GHCR package are **private**.

### Quick local

```bash
NODE_ENV=production VITE_SKIP_IMAGEMIN=true bunx vite build
docker build -f infra/docker/Dockerfile.runtime -t barthez-kenwou-portfolio:local .
docker run --rm -p 18080:8080 barthez-kenwou-portfolio:local
curl -fsS http://127.0.0.1:18080/health
```

### Security posture

- Non-root user `1001`
- `read_only: true` + tmpfs for nginx dirs
- `no-new-privileges`
- Memory limit 256M
- Healthcheck on `/health`
