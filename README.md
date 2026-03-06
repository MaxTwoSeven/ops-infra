# Ops Infrastructure

Personal operational automation and machine hardening.

## Quick Start

See **[docs/daily_startup.md](docs/daily_startup.md)** for daily startup procedures.

## Systems

- Ops Dashboard → `npm run dev` → http://localhost:5174
- Daily Notes → `./scripts/new_daily_note.sh`
- Weekly Rollup → GitHub Actions (Mondays 9am ET) or `./scripts/generate_weekly_rollup.sh`
- Mission Control → `cd ~/Developer/mx-controller && npm run electron:dev`
- ZSH History Backup → `docs/zsh_history_backup.md`

## Repo Locations

| Repo | Path |
|------|------|
| ops-infra | `~/Developer/ops-infra` |
| mx-controller | `~/Developer/mx-controller` |

## Philosophy

Small tools. Documented control surface. Survives reboot.
