# GitHub Secrets Setup

Add these in **GitHub → Settings → Secrets and variables → Actions**.

## Required for Vercel (custom domain)

| Secret              | How to get it                                                  |
| ------------------- | -------------------------------------------------------------- |
| `VERCEL_TOKEN`      | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID`     | Vercel project → Settings → General                            |
| `VERCEL_PROJECT_ID` | Same page                                                      |
| `VERCEL_SITE_URL`   | e.g. `https://jfffootwear.com`                                 |

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
- `deploy-main.yml` — full pipeline (skips Vercel/Expo if secrets missing)

## Enable workflow push (one-time, local)

If `git push` fails with “workflow scope”:

```bash
gh auth refresh -h github.com -s workflow
```

## Workflow OAuth scope

Cursor/GitHub OAuth must include `workflow` to push `.github/workflows/*` from the IDE.
