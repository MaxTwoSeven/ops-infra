#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p journal/daily

DATE="$(date +%Y-%m-%d)"
DAY="$(date +%A)"
FILE="journal/daily/${DATE}.md"

if [[ ! -f "$FILE" ]]; then
  cat > "$FILE" <<EOF
# ${DATE} — ${DAY}

## Built
-

## Hardened
-

## Learned
-

## Friction
-

## Tomorrow
-
EOF
  echo "Created $FILE"
else
  echo "Exists: $FILE"
fi

# Auto-commit so the weekly rollup picks it up via git history
git add "$FILE"
if git diff --cached --quiet; then
  echo "Nothing new to commit."
else
  git commit -m "journal: daily note ${DATE}"
  echo "Committed $FILE"
fi

# Open in Cursor if available, otherwise print the path
if command -v cursor >/dev/null 2>&1; then
  cursor "$FILE"
else
  echo "$FILE"
fi
