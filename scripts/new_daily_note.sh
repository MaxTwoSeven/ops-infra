#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p journal/daily

DATE="$(date +%Y-%m-%d)"
FILE="journal/daily/${DATE}.md"

if [[ ! -f "$FILE" ]]; then
  cat > "$FILE" <<EOF
# ${DATE}

- 
EOF
  echo "Created $FILE"
else
  echo "Exists: $FILE"
fi

# Open in Cursor if available, otherwise print the path
if command -v cursor >/dev/null 2>&1; then
  cursor "$FILE"
else
  echo "$FILE"
fi
