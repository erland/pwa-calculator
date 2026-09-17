# Development plan – Compact responsive layout

## Goal and delivery scope

Refine the merged graphing UI so constrained portrait screens devote maximum height to the calculator, while landscape uses a more natural left secondary workspace / right calculator arrangement.

The change also removes the user-selectable theme preference and lets light/dark presentation follow the system setting exclusively.

Baseline is `main` at `27a27a9646576c37b4eeec6ecf451ba5de49e88f`, containing the completed graphing change series.

## Planning assumptions

- Existing graphing, arithmetic, scientific, history, memory and offline behavior must remain unchanged.
- Responsive behavior is viewport/orientation based; no device detection.
- iPhone 13 mini-sized portrait is a primary constrained-height acceptance viewport.
- Numeric keypad stability remains a key landscape invariant.
- Legacy localStorage with `theme` and/or older `mode` fields must remain readable without losing angle mode, memory or history.
- Theme follows `prefers-color-scheme`; no explicit theme persistence remains.

## Step overview

| Step | Name | Primary result |
|---|---|---|
| DEV-019 | System-only theme and header removal | No title/theme UI; state and persistence no longer carry a user theme preference |
| DEV-020 | Reversed landscape workspace | Secondary surface left, stable calculator right, scientific controls bottom-aligned |
| DEV-021 | Compact portrait fit | Expanded Functions + numeric keypad fit an iPhone 13 mini-sized portrait without page scroll |
| DEV-022 | Responsive acceptance and docs | Full regression, canonical docs/status sync and merge-ready change series |

## Development steps

### DEV-019 – System-only theme and header removal

#### Objective

Remove non-essential header chrome and simplify theming to system preference only.

#### Scope

**Included**
- Remove the visible application header/title and theme selector from `App`.
- Remove `theme` from calculator application state/actions.
- Remove `theme` from the current persisted state shape.
- Keep the existing light/dark CSS design, driven by `prefers-color-scheme`.
- Accept legacy v1 storage containing `theme: system|light|dark` and ignore that field.
- Preserve angle mode, memory and history while reading legacy data.
- Update unit/component/E2E tests affected by theme-state removal.

**Not included**
- Landscape column reordering.
- Portrait spacing optimization beyond height gained by removing the header.

#### Verification

- Persistence migration tests including legacy `theme` values.
- Calculator state/component regression.
- Browser assertion that no theme selector/header remains.
- Light/dark system-preference coverage where practical.
- Full CI.

#### Done criteria

- [x] No user-selectable theme control remains.
- [x] UI follows system light/dark preference.
- [x] New persisted state does not require/write `theme`.
- [x] Existing persisted data with a theme field loads without data loss.
- [x] Header/title no longer consumes calculator layout space.

#### Dependencies

Green merged graphing baseline.

---

### DEV-020 – Reversed landscape workspace

#### Objective

Make landscape feel more natural by placing the active calculator on the right and the secondary graph/scientific workspace on the left.

#### Scope

**Included**
- Reverse the landscape grid so graph/scientific workspace is left and calculator display/actions/numeric keypad are right.
- Keep numeric keypad coordinates stable when switching between scientific controls and graph.
- Bottom-align scientific controls so the scientific keypad visually starts from the same lower baseline as the numeric keypad.
- Preserve phone safe-area handling and no-scroll constraints.
- Apply the same spatial model to phone and iPad/desktop landscape.

**Not included**
- Changes to graph engine, graph gestures or button semantics.

#### Verification

- Phone-landscape Playwright position assertions.
- iPad-landscape position/alignment assertions.
- Graph activation + Functions switching keeps numeric keypad fixed.
- No horizontal/vertical page overflow.
- Full CI.
- Initial CI #87 exposed a 6.6–8.2 px lower-edge offset caused by scientific-panel bottom padding; repaired in-step and reverified by CI #89.

#### Done criteria

- [x] Secondary workspace is left of the calculator in landscape.
- [x] Calculator/numeric keypad remains fixed through graph/function transitions.
- [x] Scientific controls are bottom-aligned relative to numeric keypad.
- [x] Safe-area/no-scroll behavior remains green.

#### Dependencies

DEV-019.

---

### DEV-021 – Compact portrait fit

#### Objective

Use the space freed by header removal to make expanded scientific functions practical on constrained portrait phones.

#### Scope

**Included**
- Tune portrait spacing/button sizing only as needed to fit the complete expanded Functions panel plus numeric keypad.
- Primary acceptance viewport: 375×812 CSS pixels (iPhone 13 mini class).
- Preserve readable display/result and touch-friendly controls.
- Keep Functions collapsed initially and auto-collapse behavior unchanged.
- Preserve graph-in-landscape hint behavior for `x` expressions.

**Not included**
- Device-specific branches.
- Permanent graph surface in portrait.

#### Verification

- Playwright at 375×812 with Functions expanded: `documentElement.scrollHeight <= innerHeight`.
- Numeric keypad and full scientific controls visible/usable.
- Portrait graph hint regression.
- Full CI.
- DEV-021 CI #101 passed with dedicated 375×812 expanded-layout and graph-hint coverage.

#### Done criteria

- [x] Expanded Functions and numeric keypad fit without page scroll at 375×812.
- [x] Controls remain readable and touch-usable.
- [x] Existing portrait calculator and graph-hint behavior remains intact.

#### Dependencies

DEV-019.

---

### DEV-022 – Responsive acceptance and docs

#### Objective

Close the change series with full regression evidence and documentation matching the simplified UI.

#### Scope

- Review E2E coverage for portrait, phone landscape, iPad landscape, graph transitions and system theme.
- Re-run calculator, persistence, PWA/offline and graph regressions.
- Update README, functional specification, architecture, changelog and release-readiness.
- Update change record and `.system-builder/work-status.yaml`.
- Record real-device follow-up for iPhone 13 mini and iPad where automated browser geometry cannot emulate physical safe areas/touch feel exactly.

#### Verification

- Full CI: lint, typecheck, unit/component, build/pages build and Playwright E2E.
- No unresolved blockers.

#### Done criteria

- [ ] All compact-layout acceptance behavior is implemented and verified.
- [ ] Existing calculator/graph/PWA acceptance remains green.
- [ ] Canonical docs describe system-only theme and final responsive layout.
- [ ] Change series is ready to merge.

#### Dependencies

DEV-020 and DEV-021.

## Cross-cutting verification

Every step must preserve:

- calculator and graph mathematics,
- stable numeric keypad behavior,
- history/memory/DEG-RAD persistence,
- offline/PWA operation,
- local-only data handling,
- phone landscape safe-area behavior,
- accessibility semantics for primary controls.
