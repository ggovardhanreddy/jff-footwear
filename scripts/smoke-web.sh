#!/usr/bin/env bash
# Soft-launch HTTP smoke for JFF web (requires npm run dev:web)
set -euo pipefail
BASE="${1:-http://127.0.0.1:3000}"
fail=0
check() {
  local path="$1"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" "${BASE}${path}")
  if [[ "$code" != "200" ]]; then
    echo "FAIL $code $path"
    fail=1
  else
    echo "OK   $code $path"
  fi
}

echo "Smoke → $BASE"
check "/"
check "/admin/"
check "/checkout/"
check "/install/"
check "/search/"
check "/wholesale/"
check "/login/"
check "/cart/"
check "/manifest.webmanifest"
check "/sw.js"

if [[ "$fail" -ne 0 ]]; then
  echo "Smoke failed"
  exit 1
fi
echo "Smoke passed"
