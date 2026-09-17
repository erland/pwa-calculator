# Compact responsive layout change

## Classification

- Mode: CHANGE
- Change ID: CHG-COMPACT-RESPONSIVE-LAYOUT
- Blast radius: UI layout + calculator state/persistence
- Baseline: `main` at `27a27a9646576c37b4eeec6ecf451ba5de49e88f`
- Baseline: merged graphing support is complete and GitHub Pages deployment on the baseline commit passed

## Goal

Make the calculator more space-efficient and visually balanced after graphing support, with particular focus on iPhone 13 mini portrait and phone/tablet landscape.

## Product decisions

- Remove the application title/header from the calculator UI instead of reserving permanent vertical space for it.
- Remove the user-selectable theme setting. Light/dark presentation follows the operating-system/browser `prefers-color-scheme` setting.
- Existing stored `theme` values remain readable as legacy data but are ignored; new persistence should not require or write a user theme preference.
- In landscape, the stable calculator column moves to the **right** and the secondary workspace (scientific controls or graph) moves to the **left**.
- The numeric keypad remains spatially stable when graphing activates or when Functions replaces the graph.
- Scientific controls in landscape are aligned toward the bottom so their keypad starts from the same visual baseline as the numeric keypad rather than hanging from the top.
- Small portrait layouts prioritize display, toolbar, scientific controls and numeric keypad. On an iPhone 13 mini-sized viewport, expanding Functions should fit without requiring page scroll.
- Graph behavior, graph sampling, viewport interaction, history, memory, DEG/RAD and calculator mathematics are unchanged.

## Compatibility decisions

- Do not use device detection; responsive behavior is based on viewport/orientation.
- System theme changes should be reflected by CSS/media-query behavior without adding persistent application state.
- Legacy version-1 localStorage may contain `theme` and older `mode` fields. The new reader must accept and ignore those fields while preserving angle mode, memory and history.
- No backend, migration service or storage reset is required.

## Acceptance focus

- iPhone 13 mini-sized portrait: expanded Functions plus numeric keypad fits without vertical page scrolling.
- Phone landscape: secondary workspace left, calculator right, no overflow, safe areas preserved.
- iPad landscape: same left/right model with aligned scientific and numeric keypad baselines.
- Graph activation and Functions switching do not move the numeric keypad.
- App has no visible title/header or theme selector.
- Theme follows system light/dark preference.
- Existing persisted angle mode, memory and history survive upgrade from data that contains a legacy theme field.

## Out of scope

- New graph features or graph-analysis tools.
- User-selectable/custom themes.
- Redesign of calculator button semantics.
- History redesign.
- Persistence of graph viewport.
