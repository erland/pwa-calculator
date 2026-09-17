# Compact responsive layout change

## Classification

- Mode: CHANGE
- Change ID: CHG-COMPACT-RESPONSIVE-LAYOUT
- Blast radius: UI layout + calculator state/persistence
- Baseline: `main` at `27a27a9646576c37b4eeec6ecf451ba5de49e88f`
- Baseline graphing support was complete and deployed successfully before this change series.

## Goal

Make the calculator more space-efficient and visually balanced after graphing support, with particular focus on iPhone 13 mini portrait and phone/tablet landscape.

## Product decisions

- Remove the application title/header from the calculator UI instead of reserving permanent vertical space for it.
- Remove the user-selectable theme setting. Light/dark presentation follows `prefers-color-scheme` exclusively.
- Existing stored `theme` values remain readable as legacy data but are ignored; new persistence does not write a user theme preference.
- In landscape, the stable calculator column is on the **right** and the secondary workspace (scientific controls or graph) is on the **left**.
- The numeric keypad remains spatially stable when graphing activates or when Functions replaces the graph.
- Scientific controls in landscape are bottom-aligned so their keypad shares the numeric keypad's lower visual baseline.
- Small portrait layouts prioritize display, toolbar, scientific controls and numeric keypad. At 375×812, fully expanded Functions plus the entire numeric keypad fits without page scroll.
- Graph behavior, graph sampling, viewport interaction, history, memory, DEG/RAD and calculator mathematics are otherwise unchanged.

## Compatibility decisions

- No device detection; responsive behavior is based on viewport/orientation.
- System theme changes are reflected by CSS/media queries without persistent application theme state.
- Legacy version-1 localStorage may contain `theme` and older `mode` fields. The reader accepts and ignores those fields while preserving angle mode, memory and history.
- No backend, migration service or storage reset is required.

## Implemented steps

### DEV-019 – System-only theme and header removal

- Removed header/title and theme selector.
- Removed `theme` from calculator state/actions and new persisted state.
- Kept legacy `theme`/`mode` readable but ignored.
- Verified system light/dark switching and no persisted theme.
- CI #83 passed full verify/build/pages/E2E.

### DEV-020 – Reversed landscape workspace

- Moved secondary graph/scientific workspace left and stable calculator right.
- Kept numeric keypad coordinates stable through graph/functions transitions.
- Bottom-aligned scientific keypad against numeric keypad.
- Initial CI #87 exposed a 6.6–8.2 px lower-edge offset caused by panel padding; repaired in-step.
- CI #89 passed full verify/build/pages/E2E.

### DEV-021 – Compact portrait fit

- Added portrait-only compact override loaded after existing responsive styles.
- Kept five scientific columns at 375 px to avoid an extra row.
- Reduced vertical spacing/padding while keeping numeric keys about 48 px and scientific keys about 42 px high.
- Added dedicated 375×812 Playwright acceptance for fully expanded Functions + full numeric keypad without page scroll.
- Preserved x auto-collapse and portrait graph hint.
- CI #101 and closing status-head CI #103 passed.

### DEV-022 – Responsive acceptance and docs

- Canonical README/spec/architecture/changelog/release-readiness/change record are synchronized to final behavior.
- Final CI must be green on the synchronized PR head before this step/change is marked completed.
- Real-device iPhone/iPad checks remain recommended follow-up and are not claimed as already performed.

## Acceptance focus

- iPhone 13 mini-sized portrait: expanded Functions plus numeric keypad fits without vertical page scrolling.
- Phone landscape: secondary workspace left, calculator right, no overflow, safe areas preserved.
- iPad landscape: same left/right model with aligned scientific and numeric keypad baselines.
- Graph activation and Functions switching do not move the numeric keypad.
- App has no visible title/header or theme selector.
- Theme follows system light/dark preference.
- Existing persisted angle mode, memory and history survive upgrade from data that contains legacy theme/mode fields.

## Automated evidence

- DEV-019 CI #83: passed.
- DEV-020 repaired CI #89: passed.
- DEV-021 CI #101: passed.
- DEV-021 closing head CI #103: passed.
- Final DEV-022 synchronized-head CI: pending at time of this documentation commit.

## Manual follow-up

Recommended on real hardware after/before merge:

- iPhone 13 mini portrait full expanded Functions fit and touch feel.
- iPhone landscape notch/safe-area and graph gestures.
- iPad landscape visual balance and scientific bottom alignment.
- Light/dark system-theme readability.

## Out of scope

- New graph features or graph-analysis tools.
- User-selectable/custom themes.
- Redesign of calculator button semantics.
- History redesign.
- Persistence of graph viewport.
