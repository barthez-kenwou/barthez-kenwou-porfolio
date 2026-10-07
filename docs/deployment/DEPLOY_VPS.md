# Déploiement VPS OVH - barthez-kenwou.dev

Pipeline CD : **push `main` → CI → Gitleaks → SonarQube → Trivy → build image GHCR → Trivy image → SSH deploy**.  
Sur le VPS, **Watchtower** repull `latest` automatiquement.  
TLS / routage : **Nginx Proxy Manager** sur le réseau Docker externe `web-proxy`.

|               |                                                                 |
| ------------- | --------------------------------------------------------------- |
| Compte GitHub | `barthez-kenwou` (ex-`01Barthez`)                               |
| Repo          | **privé** - `github.com/barthez-kenwou/barthez-kenwou-porfolio` |
| Image GHCR    | `ghcr.io/barthez-kenwou/barthez-kenwou-porfolio` (**privée**)   |
| Conteneur     | `barthez-portfolio-web:8080` sur `web-proxy`                    |

---

## Architecture

```text
GitHub Actions (deploy-vps.yml)
  ├─ ci → gitleaks → sonar → trivy-fs
  ├─ build-push  Dockerfile.runtime + dist → GHCR (privé)
  ├─ trivy-image
  └─ deploy SSH → docker compose pull + up

OVH VPS
  ├─ nginx-proxy-manager  (réseau web-proxy, :80/:443)
  ├─ /srv/apps/barthez-kenwou-portfolio/
  │    docker-compose.yml   ← docker-compose.prod.yml
  │    .env
  ├─ barthez-portfolio-web       → networks: portfolio + web-proxy
  └─ barthez-portfolio-watchtower
       ↓
  NPM Proxy Host: barthez-kenwou.dev → http://barthez-portfolio-web:8080
       ↓
  https://barthez-kenwou.dev
```

---

## Secrets GitHub

| Secret                                          | Rôle                                                              |
| ----------------------------------------------- | ----------------------------------------------------------------- |
| `OVH_SSH_HOST` / `OVH_SSH_USER` / `OVH_SSH_KEY` | Deploy SSH                                                        |
| `OVH_SSH_PORT`                                  | optionnel (`22`)                                                  |
| `OVH_APP_DIR`                                   | optionnel (`/srv/apps/barthez-kenwou-portfolio`)                  |
| `GHCR_PULL_TOKEN`                               | **recommandé** - PAT `read:packages` (repo privé → package privé) |
| `SONAR_TOKEN` / `SONAR_HOST_URL`                | SonarQube                                                         |
| `GITLEAKS_LICENSE`                              | optionnel                                                         |

Environment GitHub : `production`.

### Repo privé + GHCR

Le code source reste privé ; l’image GHCR l’est aussi. Le VPS **doit** être authentifié :

```bash
# PAT classic : read:packages (+ write:packages si tu push depuis la machine)
echo "$GHCR_PULL_TOKEN" | docker login ghcr.io -u barthez-kenwou --password-stdin
```

Ce login remplit `~/.docker/config.json` - requis aussi pour **Watchtower**.  
Sans `GHCR_PULL_TOKEN`, le job deploy peut utiliser le `GITHUB_TOKEN` d’Actions (court), insuffisant pour Watchtower au long cours.

---

## Bootstrap VPS (une fois)

Prérequis : Docker, réseau `web-proxy` (déjà créé par Nginx Proxy Manager).

```bash
export APP_DIR=/srv/apps/barthez-kenwou-portfolio
export GHCR_IMAGE=ghcr.io/barthez-kenwou/barthez-kenwou-porfolio

echo "$GHCR_PULL_TOKEN" | docker login ghcr.io -u barthez-kenwou --password-stdin

# Depuis une copie du repo sur le VPS, ou après scp de infra/
bash infra/scripts/bootstrap-vps.sh
```

### Nginx Proxy Manager

Créer un **Proxy Host** :

| Champ                 | Valeur                                   |
| --------------------- | ---------------------------------------- |
| Domain Names          | `barthez-kenwou.dev` (+ `www` si besoin) |
| Scheme                | `http`                                   |
| Forward Hostname / IP | `barthez-portfolio-web`                  |
| Forward Port          | `8080`                                   |
| SSL                   | Let’s Encrypt (force SSL)                |
| Websockets            | off (SPA statique)                       |

Le conteneur n’expose **pas** de port hôte : NPM parle uniquement via `web-proxy`.

DNS A/AAAA → IP du VPS.

---

## Test local

```bash
bun install --frozen-lockfile
bun run typecheck && bun run lint && bun run test:ci
cp .env.example .env
NODE_ENV=production VITE_SKIP_IMAGEMIN=true bunx vite build

DOCKER_BUILDKIT=1 docker build \
  -f infra/docker/Dockerfile.runtime \
  -t barthez-kenwou-portfolio:local .

docker run --rm -p 18080:8080 barthez-kenwou-portfolio:local
curl -fsS http://127.0.0.1:18080/health
```

Compose local (ports publiés, pas besoin de `web-proxy`) :

```bash
docker compose -f infra/docker/docker-compose.yml up -d --build
```

---

## Fichiers clés

| Fichier                                | Rôle                    |
| -------------------------------------- | ----------------------- |
| `.github/workflows/deploy-vps.yml`     | CD                      |
| `infra/docker/Dockerfile.runtime`      | Image CI (nginx + dist) |
| `infra/docker/docker-compose.prod.yml` | VPS + `web-proxy`       |
| `infra/docker/nginx.conf`              | SPA `/health`           |
| `infra/scripts/bootstrap-vps.sh`       | Bootstrap               |

---

## Première mise en prod

1. Secrets GitHub (+ `GHCR_PULL_TOKEN`) + environment `production`
2. Sur le VPS : `docker login ghcr.io` + `bootstrap-vps.sh`
3. Proxy Host NPM → `barthez-portfolio-web:8080`
4. Push `main` ou **Actions → Deploy VPS → Run workflow**
5. Vérifier `https://barthez-kenwou.dev/health`

---

## Notes

- Ancien compte `01Barthez` → `barthez-kenwou` : mettre à jour le remote local si besoin  
  `git remote set-url origin git@github.com:barthez-kenwou/barthez-kenwou-porfolio.git`
- `deploy-vercel.yml` = manuel uniquement
- Watchtower poll 300 s ; le job SSH redéploie aussi à chaque push
