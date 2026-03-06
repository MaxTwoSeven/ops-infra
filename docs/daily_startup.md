# Daily Startup Procedures

Quick reference for getting all systems running each session.

---

## 1. Ops Dashboard

Start the Express API server and Vite dashboard together:

```bash
cd /Users/maxguarin/Developer/ops-infra
npm run dev
```

| Service | URL |
|---------|-----|
| Dashboard (Vite) | http://localhost:5174 |
| API Server (Express) | http://localhost:4310 |

---

## 2. Daily Note

Create today's journal entry and auto-commit it:

```bash
cd /Users/maxguarin/Developer/ops-infra
./scripts/new_daily_note.sh
```

Opens in Cursor. Fill in the 5 sections: **Built / Hardened / Learned / Friction / Tomorrow**.

---

## 3. Mission Control (MX Controller)

Start the Electron app for live controller input monitoring:

```bash
cd /Users/maxguarin/Developer/mx-controller
npm run electron:dev
```

- App opens at **http://localhost:5173** inside Electron
- **Press any button on the controller once** to wake up the Web Gamepad API
- Navigate to **Live Inputs** to see analog sticks, buttons, and TOF sensors

If port 5173 is already in use from a previous session:

```bash
pkill -f "Electron" ; pkill -f "vite" ; sleep 1 && npm run electron:dev
```

---

## 4. Weekly Rollup (Mondays only)

Runs automatically via GitHub Actions every Monday at 9am ET.
To run manually and preview locally:

```bash
cd /Users/maxguarin/Developer/ops-infra
./scripts/generate_weekly_rollup.sh
```

---

## 5. End of Session

Commit and push daily note if not already done:

```bash
cd /Users/maxguarin/Developer/ops-infra
git add journal/daily/$(date +%Y-%m-%d).md
git commit -m "journal: daily note $(date +%Y-%m-%d)"
git push
```

---

## Quick Diagnostics

| Check | Command |
|-------|---------|
| Git status | `git -C /Users/maxguarin/Developer/ops-infra status` |
| Controller USB port | `ls /dev/cu.usbmodem*` |
| Ports in use | `lsof -i :5173 -i :5174 -i :4310` |
| Recent commits | `git -C /Users/maxguarin/Developer/ops-infra log --oneline -10` |
| List daily notes | `ls /Users/maxguarin/Developer/ops-infra/journal/daily/` |

---

## Repo Locations

| Repo | Path |
|------|------|
| ops-infra | `/Users/maxguarin/Developer/ops-infra` |
| mx-controller | `/Users/maxguarin/Developer/mx-controller` |

---

## How the Reporting Pipeline Works

```
YOU
 ↓
Daily Note  (journal/daily/YYYY-MM-DD.md)
 ↓
Git Commit  (versioned event stream)
 ↓
GitHub main branch
 ↓
GitHub Action  (weekly-rollup — runs every Monday 9am ET)
 ↓
generate_weekly_rollup.sh
 ↓
docs/YYYY-W##_weekly-log.md
 ↓
Local Dashboard  (localhost:4310)
```

**Mental model:** `Raw → Versioned → Automated → Compressed → Visualized`

This is your operational feedback loop.

---

## When to Check GitHub Web

**Do check GitHub when:**
- You pushed and want confirmation it landed
- A weekly-rollup Action should have run
- You want to inspect generated rollup files

**Don't check GitHub for:**
- Local debugging
- Staging / working tree status
