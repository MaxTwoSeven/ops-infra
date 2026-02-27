# Ops Reporting System Reference

## System Overview

You built a layered reporting pipeline:

1.  Daily Notes → `journal/daily/YYYY-MM-DD.md`
2.  Git Commit → Versioned event stream
3.  GitHub Actions → Weekly rollup automation
4.  Rollup Script → Telemetry compression (commits, files changed, daily
    notes)
5.  Local Dashboard → Express + React @ http://localhost:4310

------------------------------------------------------------------------

# Daily Workflow

## Create Today's Note

./scripts/new_daily_note.sh

## Add 3--6 Bullets

## Commit & Push

git add journal/daily git commit -m "journal: daily note" git push

------------------------------------------------------------------------

# Weekly Rollup

## Run Locally (Test Only)

./scripts/generate_weekly_rollup.sh cat .weekly_log_path

## If Push Is Rejected

git pull --rebase origin main git push

------------------------------------------------------------------------

# Status & Diagnostics Cheat Sheet

## Check Working State

git status

## View Recent Commits

git log --oneline -n 10

## List Daily Notes

ls journal/daily

## View Rollups

ls docs

------------------------------------------------------------------------

# When To Check GitHub Web

Check GitHub when: - You push and want confirmation - A workflow should
have run - You want to inspect generated rollups

Do NOT check GitHub for: - Local debugging - Staging status

------------------------------------------------------------------------

# Architecture Diagram (Conceptual)

YOU ↓ Daily Note (journal/daily) ↓ Git Commit ↓ GitHub main branch ↓
GitHub Action (weekly-rollup) ↓ generate_weekly_rollup.sh ↓
docs/YYYY-W##\_weekly-log.md ↓ Local Dashboard (localhost:4310)

------------------------------------------------------------------------

# Mental Model

Raw → Versioned → Automated → Compressed → Visualized

This is your operational feedback loop.
