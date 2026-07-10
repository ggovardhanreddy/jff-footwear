# Store readiness checklist (Expo — Phase B)

JFF mobile uses **Expo / EAS**, not Flutter. Content updates come from Supabase; only JS/native code changes need a new binary or OTA.

The **website** already auto-detects iOS vs Android and routes visitors to `/install` (PWA now; App Store / Play once `APP_LINKS.storesLive = true`).

## Prerequisites

| Item                               | Status / action                           |
| ---------------------------------- | ----------------------------------------- |
| Expo account                       | https://expo.dev                          |
| `EXPO_TOKEN` GitHub secret         | https://expo.dev/settings/access-tokens   |
| `EAS_PROJECT_ID`                   | Expo project → Project settings           |
| Apple Developer ($99/yr)           | For TestFlight / App Store                |
| Google Play Console ($25 one-time) | For Play release                          |
| Privacy policy URL                 | https://www.jffstores.com/privacy-policy/ |

## After first store publish

1. Put the real App Store URL + `iosAppId` in `packages/config/src/constants.ts` (`APP_LINKS`).
2. Confirm Play URL (`id=com.jfffootwear.app`).
3. Set `APP_LINKS.storesLive = true`.
4. Mirror URLs in `apps/web/public/app-config.json`.
5. Redeploy GitHub Pages — mobile visitors then auto-open the correct store.

## Identifiers (current)

| Platform        | Value                                  |
| --------------- | -------------------------------------- |
| iOS bundle      | `com.jfffootwear.app`                  |
| Android package | `com.jfffootwear.app`                  |
| Scheme          | `jff://`                               |
| EAS channels    | `development`, `preview`, `production` |

See [`apps/mobile/eas.json`](../apps/mobile/eas.json) and [`apps/mobile/app.config.ts`](../apps/mobile/app.config.ts).

## Build commands

```bash
cd apps/mobile
npx eas-cli login
npx eas build --profile preview --platform android
npx eas build --profile preview --platform ios
npx eas build --profile production --platform all
```

OTA (JS-only, no store resubmit):

```bash
npx eas update --channel production --message "Describe the fix"
```

Or push to `main` when `EXPO_TOKEN` is set (see `.github/workflows/ota-update.yml`).

## Android Play checklist

- [ ] App icon + adaptive icon
- [ ] Feature graphic / screenshots
- [ ] Content rating questionnaire
- [ ] Data safety form
- [ ] Privacy policy URL
- [ ] Production track internal → closed → production
- [ ] `eas submit --platform android` (or upload AAB manually)

## iOS TestFlight checklist

- [ ] App Store Connect app created with bundle `com.jfffootwear.app`
- [ ] Screenshots for required device sizes
- [ ] Privacy nutrition labels
- [ ] Push capability (Expo Notifications) if enabling push
- [ ] `eas submit --platform ios` → TestFlight
- [ ] External TestFlight group for beta

## Push notifications (Expo — not Firebase)

1. Run migration `005_realtime_publication.sql` (adds `profiles.expo_push_token`, `notification_prefs`).
2. Register token in app via `expo-notifications` and save to `profiles.expo_push_token`.
3. Send via Expo Push API from an Edge Function later (deferred until needed).
4. Respect `notification_prefs` JSON (`offers`, `orders`, `rewards`, `recommendations`, `restock`).

## Tablet / adaptive

- iOS: `supportsTablet: true` already set.
- Spot-check large layouts on iPad / Android tablets before store submit.

## What does NOT require a store update

- Product copy, prices, stock, banners, coupons, orders, rewards — all Supabase-driven (after catalog cutover for products).
- OTA JS fixes via EAS Update.
