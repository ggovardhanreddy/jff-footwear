# Auto dependency updates (web + mobile)

This repo does **not** blindly rewrite `package.json` majors on every production deploy (that breaks Expo / Next). Instead:

## What runs automatically

| Mechanism                                 | When             | What                                                                                                     |
| ----------------------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------- |
| **Dependabot** (`.github/dependabot.yml`) | Daily            | Opens PRs for npm + GitHub Actions updates (grouped). Blocks Expo/RN/React/Next **majors**.              |
| **Dependency Updates workflow**           | Nightly + manual | Runs `scripts/update-deps.sh`, CI gates, opens PR `deps/auto-update`.                                    |
| **Deploy jobs**                           | Every deploy     | Uses Node from `.nvmrc` (22 LTS) + `npm ci` from the lockfile (reproducible). No `npm update` on deploy. |
| **EAS**                                   | Mobile deploy    | `eas-version: latest` already.                                                                           |

## Local commands

```bash
# Node 22+
nvm use   # reads .nvmrc

# Safe refresh (minor/patch; Expo/RN majors skipped)
npm run deps:update

# Aggressive (still skips Expo/RN/React/Next majors)
npm run deps:update:latest

npm run lint && npm run typecheck && npm run test && npm run build
```

## Manual workflow

GitHub → Actions → **Dependency Updates** → Run workflow → choose `minor` or `latest`.

## Why not “latest everything” on deploy?

- **Expo / React Native majors** need a coordinated upgrade (SDK bump, native rebuilds).
- **Next / React majors** need a dedicated migration PR.
- Dependabot / `deps:update` PRs keep you current; deploys stay lockfile-pinned so a floating `@types/react` cannot break production builds.

There is **no Nest.js** app in this monorepo — web is **Next.js**, mobile is **Expo**.
