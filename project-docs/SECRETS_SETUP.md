# GitHub Secrets Setup

Add these in **GitHub → Settings → Secrets and variables → Actions**.

## Required for Vercel (custom domain)

| Secret              | How to get it                                                  |
| ------------------- | -------------------------------------------------------------- |
| `VERCEL_TOKEN`      | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID`     | Vercel project → Settings → General                            |
| `VERCEL_PROJECT_ID` | Same page                                                      |
| `VERCEL_SITE_URL`   | e.g. `https://www.jffstores.com`                               |

### Pause — credentials required

Until these secrets exist, `deploy-main.yml` **skips** the Vercel job and GitHub Pages remains the live host (`https://www.jffstores.com/`).

Add secrets, then either re-run the failed/skipped workflow or push an empty commit to `main`:

```bash
# After creating a Vercel project linked to this repo:
gh secret set VERCEL_TOKEN
gh secret set VERCEL_ORG_ID
gh secret set VERCEL_PROJECT_ID
gh secret set VERCEL_SITE_URL -b'https://www.jffstores.com'
```

Also set the same `NEXT_PUBLIC_SUPABASE_*` and `NEXT_PUBLIC_SITE_URL` in the **Vercel project Environment Variables** (Production + Preview).

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
