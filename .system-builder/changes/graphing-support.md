# Graphing support change

## Classification

- Mode: CHANGE
- Change ID: CHG-GRAPHING-SUPPORT
- Blast radius: cross-component
- Baseline: `main` at `7061ba865bad3dc104bddfff7f7d3bb3176a4d24`
- Baseline CI: GitHub Actions CI #29 passed
- Working PR: #5 `feature/graphing-support`

## Goal

Extend the unified calculator with function graphing without making ordinary calculator use more complex.

The calculator keypad remains a stable anchor. Graphing is activated by the mathematical expression rather than by a separate user-selected calculator mode.

## Product decisions

- The variable `x` is exposed through the existing Functions surface and keyboard input.
- An expression containing `x` is considered graphable.
- Graph rendering is a landscape workspace feature in the initial scope.
- Portrait keeps the compact calculator; an expression may contain `x`, but the graph itself is not rendered there.
- In landscape the numeric keypad remains in the same left-side position whether a graph is shown or not.
- Without a graph, the right-side secondary area shows scientific controls.
- With a graph, the right-side secondary area shows the graph by default. Functions can be opened on demand in that secondary area without moving the numeric keypad.
- Expression/result presentation belongs to the calculator column in landscape instead of consuming the full viewport width.
- History remains on demand.
- Graph viewport is transient: default `x/y = -10..10`, pan/zoom supported, reset deterministic, no persistence.

## Delivered scope

### DEV-013 – Variable-aware expression engine

- Explicit evaluation context with `x`.
- Controlled missing-variable errors.
- Existing numeric/scientific semantics retained.

### DEV-014 – Graph sampling domain

- Pure sampling independent of React/Canvas.
- Density bounded by viewport width.
- Domain errors create gaps rather than failing the complete graph.
- Obvious discontinuities/asymptote jumps split segments.

### DEV-015 – Graph Canvas

- Canvas 2D axes, grid and curve rendering.
- DPI/Retina-aware backing store.
- Theme-aware colors and accessible graph description.

### DEV-016 – Responsive graph workspace

- `x` under Functions and keyboard input.
- Portrait remains compact and shows only a landscape hint for graphable expressions.
- Landscape uses stable calculator-left / secondary-workspace-right geometry.
- Graph appears automatically for `x` expressions.
- Functions temporarily replace the graph in the secondary workspace without moving numeric keypad.

### DEV-017 – Viewport interaction

- Pointer drag pans.
- Wheel input zooms around pointer position.
- Pure/testable viewport transformations with bounded spans.
- Reset returns to `-10..10` on both axes.
- Resampling follows viewport changes.
- Touch gestures are confined to graph surface.

### DEV-018 – Acceptance/readiness

- Final documentation sync across README, functional specification, architecture, changelog and release-readiness.
- Automated graph acceptance mapped to AC-015–AC-021.
- Existing calculator/PWA regressions retained.
- Known limitations and manual real-device checklist documented.

## Out of scope

- Multiple simultaneous functions/series.
- Function color customization.
- Intersections, roots, extrema or derivative analysis.
- Function tables.
- Symbolic algebra.
- Complex arithmetic.
- 3D graphing.
- Graph viewport persistence/history.
- A permanent graph surface in phone portrait.

## Verification history

- Baseline CI #29: passed.
- DEV-013 CI #30/#31: passed.
- DEV-014 CI #34/#37: passed.
- DEV-015 CI #41/#44: passed.
- DEV-016 CI #50: passed.
- DEV-017 CI #62 exposed a React lint blocker; repaired within the same step.
- DEV-017 CI #63: `verify`, Pages-build and E2E passed.
- Subsequent documentation/status heads remained subject to full PR CI before completion of DEV-018.

## Risk and residual limitations

The main technical residual risk is numerical sampling around pathological/discontinuous functions. The implementation avoids known domain gaps and obvious large jumps but is not a symbolic math system and cannot guarantee perfect asymptote detection for every expression.

Touch behavior is automated through representative pointer/wheel browser tests, while final physical-device feel, notch/safe-area behavior and platform-specific pinch delivery are best checked manually on representative iPhone/iPad hardware.

No backend, migration, external service or persistence-schema change was introduced.

## Outcome

The graphing architecture remains aligned with the original product constraint: ordinary portrait calculator use stays simple, while landscape turns available width into a graphing workspace only when the expression calls for it. The numeric keypad remains the spatial anchor throughout.
