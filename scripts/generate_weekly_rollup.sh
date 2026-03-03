#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p docs journal/daily

END="$(date -u +%Y-%m-%d)"

# START = END minus 6 days (portable: macOS uses -v, Linux uses -d)
if date -u -v-6d +%Y-%m-%d >/dev/null 2>&1; then
  START="$(date -u -v-6d +%Y-%m-%d)"
else
  START="$(date -u -d "$END -6 days" +%Y-%m-%d)"
fi

STAMP="$(date -u +%G-W%V)"
OUT="docs/${START}_${STAMP}_weekly-log.md"

if [[ -f "$OUT" ]]; then
  echo "Weekly rollup already exists: $OUT"
  echo "$OUT" > .weekly_log_path
  exit 0
fi

# Git telemetry
COMMITS="$(git log --since="$START 00:00:00" --until="$END 23:59:59" --oneline | wc -l | tr -d ' ')"
FILES_CHANGED="$(git log --since="$START 00:00:00" --until="$END 23:59:59" --name-only --pretty="" | sed '/^$/d' | sort -u | wc -l | tr -d ' ')"
HIGHLIGHTS="$(git log --since="$START 00:00:00" --until="$END 23:59:59" --pretty=format:'- %s' | head -n 20 || true)"

# Collect daily notes by scanning the filesystem for files in the date range
# This catches notes regardless of whether they were committed
NOTE_FILES=""
for f in journal/daily/*.md; do
  [[ -f "$f" ]] || continue
  d="$(basename "$f" .md)"
  # Include if date is between START and END (string comparison works for YYYY-MM-DD)
  if [[ "$d" >= "$START" && "$d" <= "$END" ]]; then
    NOTE_FILES="${NOTE_FILES}${f}"$'\n'
  fi
done
NOTE_FILES="$(echo "$NOTE_FILES" | sed '/^$/d' | sort)"

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

if [[ -n "$NOTE_FILES" ]]; then
  while IFS= read -r f; do
    [[ -f "$f" ]] || continue
    d="$(basename "$f" .md)"
    echo "### ${d}" >> "$OUT"
    echo "" >> "$OUT"
    cat "$f" >> "$OUT"
    echo "" >> "$OUT"
  done <<< "$NOTE_FILES"
else
  echo "_No daily notes found for this week._" >> "$OUT"
fi

echo "$OUT" > .weekly_log_path
echo "Created $OUT"
