# Development plan – Tablet landscape vertical utilization

## Goal and delivery scope

Improve vertical space utilization for iPad-class landscape viewports while preserving the completed compact responsive behavior on phones.

Baseline is `main` at `a406a22c8dc79bdc741f45acb2b4410c21e22aed`, with main CI #115 and Pages deployment green.

## Planning assumptions

- iPad Pro 9.7 landscape is represented by approximately 1024×768 CSS pixels.
- Existing tablet compact media query (`761–1100px` wide, `601–820px` high) is the intended scope boundary.
- Phone landscape remains governed by the separate `max-height: 600px` rules and must not change.
- Phone portrait acceptance at 375×812 remains unchanged.
- Existing left secondary workspace / right calculator geometry stays intact.

## Step overview

| Step | Name | Primary result |
|---|---|---|
| DEV-023 | Tablet landscape vertical fill | 1024×768 tablet landscape stretches calculator/graph/scientific workspace to use available height without overflow |
| DEV-024 | Tablet layout acceptance and docs | Regression evidence, canonical docs/status sync and merge-ready change |

## Development steps

### DEV-023 – Tablet landscape vertical fill

#### Objective

Make iPad-class landscape layouts use the available vertical viewport instead of remaining content-height.

#### Scope

**Included**
- Adjust only tablet-landscape responsive CSS.
- Stretch app/workspace/calculator card to near full `100dvh` while retaining small outer margins.
- Let numeric keypad rows consume available vertical space.
- Ensure graph workspace follows the stretched card height.
- Preserve scientific bottom alignment.
- Keep display/toolbars proportionate rather than simply scaling all fonts.
- Add Playwright geometry assertions at 1024×768.
- Re-run existing phone portrait/landscape geometry regressions.

**Not included**
- Changes to React state or calculator logic.
- Changes to graph engine/gestures.
- Phone layout redesign.

#### Verification

- Playwright 1024×768:
  - calculator card/workspace uses >= 90% of viewport height,
  - secondary workspace left / calculator right,
  - scientific and numeric keypad lower edges aligned,
  - graph activation does not move numeric keypad,
  - no page overflow.
- Existing 844×390 phone-landscape assertions remain green.
- Existing 375×812 portrait assertions remain green.
- Full CI.
- DEV-023 CI #118 passed: `npm run verify`, Pages-build and Playwright E2E, including 1024×768 vertical-fill geometry plus existing 844×390 and 375×812 regressions.

#### Done criteria

- [x] iPad-class landscape visibly uses most of available vertical space.
- [x] Numeric/scientific/graph areas stretch without overflow or geometry drift.
- [x] Phone portrait and phone landscape remain unchanged in behavior.
- [x] Full CI green.

---

### DEV-024 – Tablet layout acceptance and docs

#### Objective

Close the change with regression evidence and documentation matching the final tablet landscape behavior.

#### Scope

- Review responsive E2E coverage across 375×812, 844×390 and 1024×768.
- Re-run calculator, graph, persistence and PWA regressions.
- Update README/functional specification/architecture/release-readiness/change record where the tablet layout behavior is materially described.
- Update `.system-builder/work-status.yaml`.
- Record real-device iPad Pro 9.7 follow-up as recommended unless actually verified.

#### Verification

- Full CI: lint, typecheck, unit/component, Pages build and Playwright E2E.
- No unresolved blockers.
- DEV-024 final regression/doc sync uses DEV-023 CI #118 plus closing status-head CI #120 as pre-final evidence; final synchronized head must also pass full CI.

#### Done criteria

- [x] Tablet landscape acceptance behavior is verified.
- [x] Existing phone/calculator/graph/PWA regression remains green.
- [x] Canonical documentation and System Builder state are synchronized.
- [x] Change is merge-ready.

## Cross-cutting verification

Every step must preserve:
- calculator and graph mathematics,
- system-only theme behavior,
- history/memory/DEG-RAD persistence,
- offline/PWA behavior,
- phone safe-area handling,
- stable numeric keypad behavior through graph/functions transitions.
