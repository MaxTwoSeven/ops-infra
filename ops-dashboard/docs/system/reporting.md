# Ops Reporting System

This dashboard reporting feature is the operational backbone of my workflow.

It transforms daily activity into structured, versioned, and automated telemetry.

---

# System Architecture

Raw → Versioned → Automated → Compressed → Visualized

## Layers

1. **Raw Telemetry**
   - `journal/daily/YYYY-MM-DD.md`
   - Human-written bullets
   - Ground truth

2. **Versioned Layer**
   - `git add / commit / push`
   - Git becomes event stream

3. **Automation Layer**
   - GitHub Actions (`weekly-rollup.yml`)
   - Scheduled + manual trigger
   - Runs portable rollup script (macOS + Linux)

4. **Compression Layer**
   - `generate_weekly_rollup.sh`
   - Counts commits
   - Counts files changed
   - Extracts highlights
   - Includes raw daily notes

5. **Visualization Layer**
   - Express API
   - React dashboard
   - localhost:5174

---

# Daily Ritual (Operational Habit)

1. Create today's note:

   ```bash
   ./scripts/new_daily_note.sh
