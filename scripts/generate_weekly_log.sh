#!/usr/bin/env bash
set -euo pipefail

# Work in repo root no matter where called from
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

DATE="$(date -u +%Y-%m-%d)"
DAY="$(date -u +%A)"
FILE="docs/${DATE}-${DAY}-weekly-log.md"

mkdir -p docs

if [[ -f "$FILE" ]]; then
  echo "Weekly log already exists: $FILE"
  exit 0
fi

cat > "$FILE" <<EOF
# ${DATE} – ${DAY}
## Weekly Operational Log

## 1. Systems Built
-

## 2. Systems Hardened
-

## 3. Tooling Learned
-

## 4. Conceptual Gains
-

## 5. Friction Points
-

## 6. Open Threads
-
EOF

echo "Created $FILE"
echo "$FILE" > .weekly_log_path
