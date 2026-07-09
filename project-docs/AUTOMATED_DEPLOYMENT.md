# Automated Deployment

## GitHub Pages (active)

**URL:** https://ggovardhanreddy.github.io/jff-footwear/

Source: branch `main`, folder `/docs`.

### Manual

```bash
npm run deploy:pages
git add docs
git commit -m "Update GitHub Pages build"
git push origin main
```

### Automatic

| Workflow           | When                          | What                                          |
| ------------------ | ----------------------------- | --------------------------------------------- |
| `deploy-pages.yml` | Push to `main` (source paths) | Build + commit `/docs`                        |
| `deploy-main.yml`  | Push to `main` (source paths) | CI + Lighthouse + Pages + optional Vercel/OTA |
| `ci.yml`           | PR / push                     | Lint, typecheck, test, build                  |

Commits that only change `docs/**` use message `[skip pages]` and do not retrigger builds.

## Vercel (optional)

Add secrets from [SECRETS_SETUP.md](./SECRETS_SETUP.md). `deploy-main.yml` deploys `apps/web` to Vercel when `VERCEL_TOKEN` is set.

Manual: Actions → **Deploy Website**.

## Mobile OTA (optional)

Add `EXPO_TOKEN` + `EAS_PROJECT_ID`. See [OTA_UPDATES.md](./OTA_UPDATES.md).

## Local requirements

- Node.js ≥ 20
- `npm ci` at repo root
