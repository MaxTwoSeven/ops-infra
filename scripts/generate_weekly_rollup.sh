#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p docs journal/daily

END="$(date -u +%Y-%m-%d)"
START="$(date -u -d "$END -6 days" +%Y-%m-%d)"
STAMP="$(date -u +%G-W%V)"
OUT="docs/${START}_${STAMP}_weekly-log.md"

# Avoid duplicates if rerun
if [[ -f "$OUT" ]]; then
  echo "Weekly rollup already exists: $OUT"
  echo "$OUT" > .weekly_log_path
  exit 0
fi

COMMITS="$(git log --since="$START 00:00:00" --until="$END 23:59:59" --oneline | wc -l | tr -d ' ')"
FILES_CHANGED="$(git log --since="$START 00:00:00" --until="$END 23:59:59" --name-only --pretty="" | sed '/^$/d' | sort -u | wc -l | tr -d ' ')"
HIGHLIGHTS="$(git log --since="$START 00:00:00" --until="$END 23:59:59" --pretty=format:'- %s' | head -n 20 || true)"

NOTES="$(ls journal/daily/*.md 2>/dev/null | awk -v s="$START" -v e="$END" '
  match($0, /([0-9]{4}-[0-9]{2}-[0-9]{2})\.md$/, a);
  if (a[1] >= s && a[1] <= e) print $0
' || true)"

cat > "$OUT" <<EOF
# Weekly Rollup — ${STAMP}
**Range (UTC):** ${START} → ${END}

## Auto Summary (ops-infra)
- Commits: ${COMMITS}
- Unique files changed: ${FILES_CHANGED}

### Commit highlights (top 20)
${HIGHLIGHTS:-_No commits found._}

---

## Daily Notes (raw)

EOF

if [[ -n "$NOTES" ]]; then
  for f in $NOTES; do
    d="$(basename "$f" .md)"
    echo "### ${d}" >> "$OUT"
    echo "" >> "$OUT"
    cat "$f" >> "$OUT"
    echo "" >> "$OUT"
  done
else
  echo "_No daily notes found for this week._" >> "$OUT"
fi

echo "$OUT" > .weekly_log_path
echo "Created $OUT"
