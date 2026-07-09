#!/usr/bin/env bash
# Post-deploy notification — GitHub Step Summary + optional webhook
set -euo pipefail

SITE_URL="${VERCEL_SITE_URL:-https://ggovardhanreddy.github.io/jff-footwear}"
PAGES_STATUS="${PAGES_STATUS:-—}"
COMMIT_SHA="${GITHUB_SHA:-local}"
COMMIT_MSG="${COMMIT_MESSAGE:-No message}"
ACTOR="${GITHUB_ACTOR:-developer}"
OTA_STATUS="${OTA_STATUS:-skipped}"
WEB_STATUS="${WEB_STATUS:-unknown}"
LIGHTHOUSE_STATUS="${LIGHTHOUSE_STATUS:-skipped}"
SITEMAP_URLS="${SITEMAP_URLS:-—}"

SUMMARY_FILE="${GITHUB_STEP_SUMMARY:-/dev/stdout}"

{
  echo "## ✅ JFF Footwear — Deployment Successful"
  echo ""
  echo "| Step | Status |"
  echo "|------|--------|"
  echo "| Lint & Tests | ✅ Passed |"
  echo "| Website (GitHub Pages) | ${PAGES_STATUS} |"
  echo "| Website (Vercel) | ${WEB_STATUS} |"
  echo "| Sitemap | ✅ ${SITEMAP_URLS} URLs |"
  echo "| Lighthouse | ${LIGHTHOUSE_STATUS} |"
  echo "| Expo OTA | ${OTA_STATUS} |"
  echo ""
  echo "**Website:** [${SITE_URL}](${SITE_URL})"
  echo ""
  echo "**Commit:** \`${COMMIT_SHA:0:7}\` by @${ACTOR}"
  echo ""
  echo "> ${COMMIT_MSG}"
  echo ""
  echo "### Customer app flow"
  echo "1. User opens app → checks for updates"
  echo "2. Update downloads in background"
  echo "3. \"Update Ready\" prompt → Restart"
  echo "4. Running latest version"
} >> "$SUMMARY_FILE"

if [ -n "${DEPLOY_WEBHOOK_URL:-}" ]; then
  PAYLOAD=$(cat <<EOF
{
  "text": "✅ JFF Footwear deployed successfully",
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*JFF Footwear — Deployment Successful*\n• Website: ${SITE_URL}\n• OTA: ${OTA_STATUS}\n• Commit: \`${COMMIT_SHA:0:7}\` by ${ACTOR}"
      }
    }
  ]
}
EOF
)
  curl -sf -X POST -H "Content-Type: application/json" -d "$PAYLOAD" "$DEPLOY_WEBHOOK_URL" || true
fi

echo "Deployment notification sent."
