# GitHub Secrets Setup

Add these in **GitHub → Settings → Secrets and variables → Actions**.

## Website hosting

The site deploys to **GitHub Pages** only (`deploy-pages.yml` → `docs/` → https://www.jffstores.com/).  
No Vercel (or other third-party web host) secrets are required.

Optional:

| Secret     | Purpose                                      |
| ---------- | -------------------------------------------- |
| `SITE_URL` | Override public site URL (default jffstores) |

## Required for Expo OTA

| Secret           | How to get it                                                              |
| ---------------- | -------------------------------------------------------------------------- |
| `EXPO_TOKEN`     | [expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens) |
| `EAS_PROJECT_ID` | `apps/mobile/app.config.ts` or Expo dashboard                              |

## Optional

| Secret               | Purpose                                 |
| -------------------- | --------------------------------------- |
| `DEPLOY_WEBHOOK_URL` | Slack/Discord webhook on deploy success |

## GitHub Pages (no secrets)

Works out of the box via `/docs` on `main`. Workflows:

- `deploy-pages.yml` — build + commit docs on source changes
- `deploy-main.yml` — CI, Lighthouse, optional Expo OTA (skips Expo if secrets missing)

## Enable workflow push (one-time, local)

If `git push` fails with “workflow scope”:

```bash
gh auth refresh -h github.com -s workflow
```

## Remove old Vercel secrets (if present)

```bash
gh secret delete VERCEL_TOKEN
gh secret delete VERCEL_ORG_ID
gh secret delete VERCEL_PROJECT_ID
gh secret delete VERCEL_SITE_URL
```
