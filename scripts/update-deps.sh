#!/usr/bin/env bash
# Refresh npm dependencies to the newest versions allowed by policy.
# - Web / shared packages: latest within npm-check-updates (minor by default)
# - Expo / React Native: patch+minor only (majors are manual)
# Usage:
#   ./scripts/update-deps.sh           # minor/patch (safe default)
#   ./scripts/update-deps.sh latest    # latest including majors except expo/rn/react/next majors rejected below
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

TARGET="${1:-minor}"

echo "==> Node $(node -v) | npm $(npm -v)"
echo "==> Update target: $TARGET"

REJECT="expo,expo-*,react-native,react-native-*,@expo/*,metro,metro-*"

if [[ "$TARGET" == "latest" ]]; then
  # Still block ecosystem-breaking majors unless explicitly forced later
  npx --yes npm-check-updates@latest -u \
    --target latest \
    --reject "$REJECT,react,react-dom,next"
else
  npx --yes npm-check-updates@latest -u \
    --target "$TARGET" \
    --reject "$REJECT"
fi

echo "==> Installing updated lockfile"
npm install

echo "==> Done. Run: npm run lint && npm run typecheck && npm run test && npm run build"
