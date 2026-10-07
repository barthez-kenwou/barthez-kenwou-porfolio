# GitHub Automation and Workflows

This directory contains GitHub Actions workflows used to run CI checks and deploy the application to Vercel.

Workflows

- `.github/workflows/ci.yml` - runs on `push` and `pull_request` for `main` and `develop` branches. It performs:
  - Checkout, Node setup and dependency install
  - `format:check`, `lint`, `typecheck`, `test:ci`, `build`
  - Uploads `dist` as an artifact when build succeeds

- `.github/workflows/deploy-vercel.yml` - runs on push to `main`. It:
  - Checks out code, installs deps and builds
  - Deploys to Vercel using `amondnet/vercel-action`

Required repository secrets for Vercel deploy

- `VERCEL_TOKEN` - personal token or machine token with deploy permissions (required)
- `VERCEL_ORG_ID` - (optional) Vercel organization id
- `VERCEL_PROJECT_ID` - (optional) Vercel project id

Recommended protection

- Protect `main` branch and require status checks from `CI` to pass before merging.
