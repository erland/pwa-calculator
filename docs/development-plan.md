# Development plan – Graphing support

## Goal and delivery scope

Add graphing to the existing unified Calculator PWA without introducing a separate calculator mode or making basic calculator use more complex.

Graphing is driven by the expression: an expression containing variable `x` is graphable. The numeric keypad remains the stable calculator anchor. In landscape, the secondary workspace shows either scientific controls or the graph while the calculator remains in place.

This plan supersedes the completed v1 implementation plan. Historical completed steps remain available in Git history and `.system-builder/work-status.yaml`.

## Planning assumptions

- Baseline is `main` at `7061ba865bad3dc104bddfff7f7d3bb3176a4d24`.
- Baseline CI #29 is green.
- Existing arithmetic/scientific behavior must not regress.
- Graphing remains entirely client-side and offline-capable.
- No third-party plotting library is required initially; a small Canvas-based renderer is preferred unless implementation evidence shows otherwise.
- Initial graph scope is one real-valued function of `x` at a time.
- Phone portrait does not render the graph in the initial scope.
- Landscape keeps the numeric keypad in the same location whether graphing is active or not.

## Step overview

| Step | Name | Primary result |
|---|---|---|
| DEV-013 | Variable-aware expression engine | Expressions can be evaluated for a supplied `x` value |
| DEV-014 | Graph sampling domain | Safe point/segment sampling with domain/discontinuity handling |
| DEV-015 | Graph canvas component | Reusable axes/grid/curve renderer with deterministic tests where practical |
| DEV-016 | Responsive graph workspace | Stable landscape calculator + automatic graph surface for expressions using `x` |
| DEV-017 | Graph viewport interaction | Pan, zoom and reset without moving the calculator controls |
| DEV-018 | Graphing acceptance and release readiness | E2E/regression coverage, docs/status sync and release-ready change series |

## Development steps

### DEV-013 – Variable-aware expression engine

#### Objective

Extend the existing expression engine so graph code can evaluate the same expression repeatedly for different `x` values without changing existing numeric-expression behavior.

#### Scope

**Included**
- Add an explicit evaluation-variable context with optional `x`.
- Resolve identifier `x` from that context.
- Keep `pi`, `e` and existing functions unchanged.
- Return a controlled calculator error when an expression references `x` without a supplied value.
- Add unit tests for direct `x`, arithmetic with `x`, functions of `x`, DEG/RAD interaction and missing-variable behavior.

**Not included**
- UI button for `x`.
- Graph sampling.
- Canvas rendering.
- Layout changes.

#### Prerequisites

- Existing CI baseline is green.
- Existing expression engine tests pass on `main`.

#### Implementation

Likely touched areas:
- `src/calculator/engine/types.ts`
- `src/calculator/engine/evaluate.ts`
- `src/calculator/engine/evaluate.test.ts`

#### Verification

- Expression-engine unit tests.
- Existing full unit suite.
- Lint, typecheck and build through CI.

#### Done criteria

- [x] Existing numeric expressions behave unchanged.
- [x] `x` can be evaluated from explicit context.
- [x] Missing `x` context produces a controlled error.
- [x] Required CI is green.

#### Dependencies

None beyond the green baseline.

---

### DEV-014 – Graph sampling domain

#### Objective

Create a pure, testable graph sampler that converts an expression and viewport into drawable curve segments.

#### Scope

**Included**
- Sample a configurable x-range at a density derived from viewport width.
- Evaluate each sample through the expression engine.
- Split segments at domain errors/non-finite results.
- Detect large jumps sufficiently to avoid obvious false lines across asymptotes.
- Return data independent of React/Canvas.
- Unit tests for linear/quadratic/trigonometric curves and discontinuities such as `1/x` and `tan(x)`.

**Not included**
- Canvas rendering.
- Pan/zoom gestures.

#### Verification

- Sampler unit tests including discontinuities/domain errors.
- Existing engine regression suite.
- Full CI.

#### Done criteria

- [x] Sampler returns stable drawable segments for common functions.
- [x] Domain errors do not abort the whole graph.
- [x] Obvious discontinuities are not connected.

#### Dependencies

DEV-013.

---

### DEV-015 – Graph canvas component

#### Objective

Render graph sampler output as a lightweight responsive 2D graph.

#### Scope

**Included**
- Canvas-based graph surface.
- x/y axes and restrained grid.
- Mapping mathematical coordinates to device pixels.
- Curve rendering from sampler segments.
- Device-pixel-ratio aware rendering.
- Accessible text/label describing the currently graphed expression.
- Empty/help state when no graphable expression is active.

**Not included**
- Multiple curves.
- Analytical features such as roots/intersections.
- Gesture interaction.

#### Verification

- Component tests for state/labels and deterministic coordinate/render behavior.
- Focused browser/E2E smoke test for the rendered graph surface when the component is integrated in DEV-016.
- Full CI.

#### Done criteria

- [x] A supplied graph model renders without layout overflow.
- [x] Axes and curve use theme-aware colors suitable for light and dark themes.
- [x] Rendering remains client-only/offline-compatible.

#### Dependencies

DEV-014.

---

### DEV-016 – Responsive graph workspace

#### Objective

Integrate graphing into the calculator with the agreed stable landscape interaction model.

#### Scope

**Included**
- Add `x` to the Functions surface.
- Detect expressions that reference `x`.
- Portrait: keep the compact calculator; allow `x` expression input and provide a subtle indication that the graph is available in landscape.
- Landscape: use a stable left calculator column containing expression/result, numeric keypad and `Funktioner`/`Historik` actions.
- Keep the numeric keypad at the same location whether graphing is active or not.
- Landscape without `x`: secondary area presents scientific controls.
- Landscape with `x`: secondary area presents the graph by default.
- While graphing, `Funktioner` opens scientific controls in/over the secondary area without moving the calculator column.
- Preserve existing safe-area behavior.

**Not included**
- Pan/zoom.
- Multiple functions.

#### Verification

- Component/UI tests for `x` and responsive states.
- Playwright portrait regression.
- Playwright phone landscape and iPad/desktop landscape layout checks.
- Focused browser smoke test that the integrated Canvas graph renders.
- Assert keypad position is stable before/after graph activation.
- Full CI.

#### Done criteria

- [x] Basic calculator UX is unchanged in portrait until graph functionality is intentionally used.
- [x] `x` activates graph presentation automatically in landscape.
- [x] Numeric keypad does not move when graph presentation changes.
- [x] Existing Function/History behavior remains available.

#### Dependencies

DEV-015.

---

### DEV-017 – Graph viewport interaction

#### Objective

Make the graph practically explorable while preserving the stable calculator layout.

#### Scope

**Included**
- Drag/pan in graph area.
- Wheel and/or pinch zoom as supported by the browser input model.
- Reset viewport control.
- Reasonable default viewport, initially around `x = -10..10` with matching readable y-scale.
- Re-sampling after viewport changes.
- Keep gestures confined to graph area so calculator controls remain predictable.

**Not included**
- Persistent graph viewport between sessions.
- Trace/cursor analytics.

#### Verification

- Unit tests for viewport transforms.
- Browser tests for reset and representative pan/zoom interactions.
- Manual acceptance on touch device remains recommended.
- Full CI.

#### Done criteria

- [x] User can inspect different graph regions without affecting calculator input controls.
- [x] Reset returns to deterministic default viewport.
- [x] No page-scroll/safe-area regression in landscape.

#### Dependencies

DEV-016.

---

### DEV-018 – Graphing acceptance and release readiness

#### Objective

Close the change series with regression coverage, documentation and releasable current state.

#### Scope

- E2E happy paths for `x`, graph activation, Functions overlay and orientation-specific behavior.
- Regression coverage for ordinary numeric/scientific calculations, history, memory, themes, offline and PWA build.
- Update README, functional specification and architecture to final implemented graph behavior.
- Update `.system-builder/work-status.yaml` and change record.
- Document known graph limitations and manual real-device checks.

#### Verification

- Full CI: lint, typecheck, unit/component, build/pages build and E2E.
- Manual acceptance checklist for iPhone-sized portrait/landscape and iPad/desktop landscape.
- No unresolved blockers.

#### Done criteria

- [x] All Must graphing acceptance behavior is implemented and verified.
- [x] Existing calculator acceptance remains green.
- [x] Canonical docs describe the implemented current state.
- [x] Change series is ready to merge/release.

#### Dependencies

DEV-017.

## Cross-cutting verification

Every graphing step must preserve:

- safe parsing without `eval`/`Function`,
- existing numeric-expression semantics,
- offline/client-only operation,
- local-only user data,
- phone landscape safe-area handling,
- stable basic keypad usability,
- light/dark theme compatibility.

## Plan-change rules

If DEV-014 demonstrates that reliable discontinuity handling requires a different sampling/rendering approach, update this plan before UI integration. Do not hide sampling uncertainty inside the Canvas component.

If a third-party graph library becomes necessary, record the dependency/size/security trade-off before introducing it.
