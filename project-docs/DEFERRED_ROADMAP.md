# Deferred roadmap (Phase C)

Items from the full “production ecosystem” prompt that are **intentionally not built** yet. Do not treat these as missing bugs.

| Ask                                 | Decision                        | When                                    |
| ----------------------------------- | ------------------------------- | --------------------------------------- |
| Flutter rewrite                     | Rejected — keep Expo            | Never (unless product decision changes) |
| Firebase / FCM                      | Rejected — Expo Push            | After Expo Push Edge Function           |
| Windows / macOS store apps          | Deferred                        | After mobile store traction             |
| Tauri desktop                       | Deferred                        | Optional later                          |
| Full offline CRDT sync              | Deferred                        | After catalog SoT on Supabase           |
| Full catalog Realtime on storefront | Deferred                        | After admin catalog cutover             |
| Play / App Store submit             | Needs accounts + Phase B builds | When store accounts ready               |
| Plausible / Umami analytics         | Recommended free option         | Soft-launch week 2+                     |
| Sentry crash reporting              | Recommended                     | Before paid ads                         |
| Native APNs/FCM direct              | Not needed if Expo Push works   | Only if Expo limits hit                 |

## Content vs code updates

- **Supabase content** (orders, banners, coupons, AI products, notifications): live immediately via API/Realtime — no app store release.
- **Application code**: website = GitHub Pages deploy; mobile JS = EAS OTA; native modules = new store binary.
