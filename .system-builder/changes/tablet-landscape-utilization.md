# Tablet landscape vertical utilization

## Classification

- Mode: CHANGE
- Change ID: CHG-TABLET-LANDSCAPE-UTILIZATION
- Blast radius: responsive CSS + layout geometry tests/documentation
- Baseline: `main` at `a406a22c8dc79bdc741f45acb2b4410c21e22aed`
- Baseline CI: main CI #115 passed; release/Pages deployment on the same commit passed

## Goal

Use the available vertical screen space substantially better on iPad-class landscape viewports, especially approximately 1024×768 CSS pixels, without changing the already accepted iPhone portrait/landscape behavior or graph/calculator semantics.

## Problem statement

The existing shorter-tablet landscape rule deliberately compacts display and key heights to avoid overflow, but the calculator card remains content-height. On iPad Pro 9.7 landscape this leaves a large unused area below the calculator.

## Product decisions

- Keep the existing left secondary workspace / right calculator arrangement.
- Preserve the stable numeric-keypad position when graph/functions switch.
- Preserve bottom alignment of scientific and numeric keypads.
- Let tablet-landscape layouts stretch vertically into the available viewport instead of remaining content-height.
- Prefer distributing extra height into the workspace/keypad rows rather than uniformly scaling typography.
- Keep phone-landscape rules (`max-height: 600px`) unchanged.
- Keep compact phone portrait rules unchanged.
- Use viewport/orientation media queries only; no device detection.

## Acceptance focus

- 1024×768 landscape uses at least about 90% of the available viewport height for the calculator card/workspace, excluding small outer margins.
- Numeric keypad remains fully visible and gains useful vertical room rather than leaving a large blank area below the card.
- Scientific keypad remains bottom-aligned with the numeric keypad.
- Graph workspace stretches with the card and remains usable.
- Switching between scientific controls and graph does not move the numeric keypad.
- No horizontal or vertical page overflow.
- Existing phone portrait 375×812 and phone landscape 844×390 behavior remains unchanged.

## Out of scope

- Changes to calculator mathematics, graph sampling or viewport interaction.
- New device-specific JavaScript.
- Changes to phone portrait/landscape spacing.
- Redesign of button semantics or navigation.


## DEV-023 implementation result

- Tablet-landscape app/workspace/calculator-card now stretch against `100dvh` within the existing 761–1100 × 601–820 scope.
- Numeric keypad uses five equal flexible rows to consume available vertical space.
- Scientific controls retain their lower-edge alignment with the numeric keypad.
- Graph workspace inherits the stretched calculator-card geometry.
- No phone-specific media query was changed.
- CI #118 passed full verify, Pages build and Playwright E2E; 1024×768 uses at least 90% of viewport height with no page overflow, while 844×390 and 375×812 regressions remain green.

Next: DEV-024 final acceptance and documentation sync.
