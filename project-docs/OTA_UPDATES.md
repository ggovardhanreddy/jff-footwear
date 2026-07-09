# OTA Updates (Expo)

Mobile app: `apps/mobile` (Expo 52 + EAS Update).

## Prerequisites

1. Expo account and project linked (`eas.json`, `app.config.ts`)
2. GitHub secrets: `EXPO_TOKEN`, `EAS_PROJECT_ID`
3. Optional: `EXPO_PUBLIC_WEB_ASSET_BASE_URL` points to production website

## Automatic (CI)

On push to `main`, `deploy-main.yml`:

- **JS-only changes** → `eas update --branch production --channel production`
- **Native changes** (app.config, eas.json, assets, ios/, android/) → triggers EAS **build** instead of OTA; store submission required

## Manual publish

GitHub → Actions → **Publish Mobile OTA Update** → choose branch.

Or locally:

```bash
cd apps/mobile
eas update --branch production --channel production --message "Your message"
```

## Rollback

GitHub → Actions → **OTA Rollback** workflow, or:

```bash
cd apps/mobile
eas update:rollback --branch production
```

## Customer experience

1. App checks for updates on launch
2. Update downloads in background
3. User sees “Update ready” → restart
4. Running latest JS bundle
