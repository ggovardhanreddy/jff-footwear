# Automated Deployment

## GitHub Pages (active)

**URL:** https://www.jffstores.com/

Source: branch `main`, folder `/docs`.

### Manual

```bash
npm run deploy:pages
git add docs
git commit -m "Update GitHub Pages build"
git push origin main
```

### Automatic

| Workflow           | When                          | What                                |
| ------------------ | ----------------------------- | ----------------------------------- |
| `deploy-pages.yml` | Push to `main` (source paths) | Build + commit `/docs`              |
| `deploy-main.yml`  | Push to `main` (source paths) | CI + Lighthouse + optional Expo OTA |
| `ci.yml`           | PR / push                     | Lint, typecheck, test, build        |

Commits that only change `docs/**` use message `[skip pages]` and do not retrigger builds.

## Mobile OTA (optional)

Add `EXPO_TOKEN` + `EAS_PROJECT_ID`. See [OTA_UPDATES.md](./OTA_UPDATES.md).

## Local requirements

- Node.js ≥ 22 (see `.nvmrc`)
- `npm ci` at repo root
