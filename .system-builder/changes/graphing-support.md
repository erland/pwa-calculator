# Graphing support change

## Classification

- Mode: CHANGE
- Change ID: CHG-GRAPHING-SUPPORT
- Blast radius: cross-component
- Baseline: `main` at `7061ba865bad3dc104bddfff7f7d3bb3176a4d24`
- Baseline CI: GitHub Actions CI #29 passed

## Goal

Extend the unified calculator with function graphing without making ordinary calculator use more complex.

The calculator keypad remains a stable anchor. Graphing is activated by the mathematical expression rather than by a separate user-selected calculator mode.

## Product decisions

- The variable `x` is exposed through the existing Functions surface.
- An expression containing `x` is considered graphable.
- Graph rendering is a landscape workspace feature in the initial scope.
- Portrait keeps the compact calculator; an expression may contain `x`, but the graph itself is not rendered there.
- In landscape the numeric keypad remains in the same left-side position whether a graph is shown or not.
- Without a graph, the right-side secondary area may show scientific controls.
- With a graph, the right-side secondary area shows the graph by default. Functions can be opened on demand over/in that secondary area without moving the numeric keypad.
- Expression/result presentation belongs to the calculator column in landscape instead of consuming the full viewport width.
- History remains on demand.

## Initial graph scope

### Must

- Evaluate expressions with variable `x`.
- Plot one real-valued expression at a time.
- Render axes/grid and a continuous curve where the expression is defined.
- Avoid drawing false connecting lines across domain errors/discontinuities.
- Show graph automatically in landscape when the current expression uses `x`.
- Keep the existing calculator usable and spatially stable while graphing.
- Preserve safe-area handling on phone landscape.
- Work offline with no backend or external graph service.

### Should

- Pan and zoom the graph viewport.
- Provide a simple reset-to-default viewport action.
- Preserve current expression while rotating between portrait and landscape.

### Out of scope for this change series

- Multiple simultaneous functions/series.
- Function color customization.
- Intersections, roots, extrema or derivative analysis.
- Function tables.
- Symbolic algebra.
- 3D graphing.
- Graph persistence/history beyond the existing expression/history model.
- A full graph surface in phone portrait.

## Impact analysis

- Expression engine: add explicit variable evaluation context.
- Calculator state/UI: allow `x` input without creating a separate calculator mode.
- Graph domain: add sampling and discontinuity handling.
- UI/layout: introduce a stable two-column landscape workspace with calculator left and secondary graph/functions surface right.
- Tests: add engine unit tests, graph sampler/component tests and landscape E2E regression tests.
- Persistence: no schema change required in the first scope; ordinary expression state remains transient.
- PWA/deployment: no infrastructure change expected; graphing remains client-only and offline-capable.

## Risk notes

The highest technical risk is graph sampling around discontinuities and domain errors, not variable parsing. The plan therefore introduces variable evaluation first, then a separately testable sampler before canvas/UI integration.
