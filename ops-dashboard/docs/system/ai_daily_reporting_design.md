# AI-Augmented Daily Reporting Engine (Design Brief)

## Objective

Integrate ChatGPT into the Ops Dashboard to assist in drafting daily reports for specific projects, using:

- Git activity (commits, changed files)
- Optional contextual input (chat excerpts or manual notes)
- Existing project structure

The goal is to enhance daily reporting without destabilizing the existing weekly rollup system.

---

## Current System (Stable)

Raw → Versioned → Automated → Compressed → Visualized

- Daily notes in `journal/daily/YYYY-MM-DD.md`
- Weekly rollup generated via `generate_weekly_rollup.sh`
- Dashboard visualizes rollups and documentation

Weekly rollup remains deterministic and source-based.

---

## Proposed Enhancement

Introduce ChatGPT as a **drafting layer**, not a source-of-truth layer.

Flow:

Git telemetry + Optional chat context  
→ ChatGPT Draft  
→ User review/edit  
→ Saved Daily Note  
→ Weekly rollup naturally includes improved content

---

## Architectural Principles

1. AI drafts — humans approve.
2. Weekly rollup remains deterministic.
3. Git remains the authoritative event stream.
4. No hidden state or opaque automation.

---

## Phase 1 Feature

Dashboard panel:

- Project selector
- Optional context textbox
- "Generate Draft" button
- Editable markdown preview
- "Save to Today’s Note" button

Server endpoint:

- Collect git telemetry for selected project
- Construct structured prompt
- Call OpenAI API
- Return markdown draft

---

## Future Extensions

- AI weekly summary section
- Cross-repo synthesis
- Task extraction
- Health scoring
- Project velocity metrics
