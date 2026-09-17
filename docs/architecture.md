# Arkitektur – Calculator PWA

## 1. Arkitekturmål

Arkitekturen ska prioritera:

1. korrekt och testbar matematik,
2. ett enkelt grundflöde utan separata calculator modes,
3. stabil responsiv layout där grundknappsatsen inte flyttar sig när sekundär funktionalitet ändras,
4. helt lokal/offlinekapabel funktion utan backend,
5. liten dependency- och drift-yta,
6. tydliga domängränser mellan beräkning, grafprovtagning, viewportinteraktion och rendering.

## 2. Systemkontext

Calculator PWA är en klientbaserad React/TypeScript-applikation som levereras statiskt och kör all matematik, grafprovtagning, rendering, viewportinteraktion och persistens lokalt i webbläsaren.

```mermaid
flowchart LR
    User[Användare] --> UI[React UI]
    UI --> State[Calculator State]
    State --> Engine[Expression Engine]
    UI --> Graph[Graph Workspace]
    Graph --> Viewport[Graph Viewport]
    Graph --> Sampler[Graph Sampler]
    Sampler --> Engine
    Graph --> Canvas[Graph Canvas]
    UI --> Storage[(localStorage)]
    Browser[Service Worker / PWA] --> UI
```

Det finns ingen backend, autentisering, serverdatabas eller extern graph service.

## 3. Huvudkomponenter

### 3.1 Application Shell / React UI

Ansvarar för:

- expression/result display,
- grundknappsats,
- `Funktioner` och `Historik`,
- DEG/RAD, minne och tema,
- responsiv presentation,
- safe-area-hantering,
- orienterings-/viewportberoende graph workspace,
- tillgänglig semantik och input/fokus.

UI:t implementerar inte matematiska regler eller grafprovtagning.

### 3.2 Calculator State

Ansvarar för:

- aktuellt uttryck,
- numeriskt resultat/fel,
- redigering, clear/backspace och `=`,
- DEG/RAD,
- minne,
- historik,
- tema/persistenskoordination.

Graph presentation härleds från aktuellt uttryck och viewport och lagras inte som ett separat calculator mode. `x` behandlas som början på ett nytt uttryck efter en slutförd numerisk beräkning.

### 3.3 Expression Engine

Ansvarar för säker parser/evaluator för:

- tal och operatorer,
- parenteser och unära operatorer,
- procent/potenser,
- `sin`, `cos`, `tan`, `log`, `ln`, `sqrt`, invers och kvadrat,
- `π` och `e`,
- DEG/RAD,
- variabeln `x` via explicit evaluation context,
- kontrollerade syntax-, domän-, divisions- och resultatfel.

Motorn får inte använda `eval`, `Function` eller dynamisk kodexekvering.

Domän-API:

```text
evaluateExpression(expression, angleMode, variables?) -> number
variables = { x?: number }
```

Uttryck utan variabler behåller befintlig semantik. Om `x` refereras utan explicit värde ger direct evaluation ett kontrollerat fel.

### 3.4 Numeric Formatter

Ansvarar för presentation av numeriska resultat, avrundning, `-0`, mycket stora/små tal och vetenskaplig notation. Grafdomänen använder råa `number`-värden och ska inte formatera varje sample via UI-formattering.

### 3.5 Graph Sampler

Graph Sampler är ett rent domänlager mellan expression engine och rendering.

Ansvar:

- ta emot uttryck, angle mode och matematisk viewport,
- generera representativa x-samples med begränsad densitet,
- utvärdera uttrycket genom Expression Engine med `{ x }`,
- behandla domän-/resultatfel som avbrott i kurvan,
- dela output i drawable segments,
- undvika uppenbara falska förbindelser över asymptoter/diskontinuiteter,
- vara oberoende av React, DOM och Canvas.

Exempel på output:

```text
GraphSampleResult
  segments[]
    points[] { x, y }
```

Sampler-strategin kan bytas utan att UI/Canvas behöver känna till parserdetaljer.

### 3.6 Graph Viewport

Viewportlagret är ren matematik och ansvarar för:

- standardviewport `x/y = -10..10`,
- översättning av drag i pixlar till matematisk panorering,
- zoom runt en normaliserad pekarposition,
- min/max-gränser för viewportens spann,
- kontroll av om viewporten är i standardläge.

Viewporten är temporär och persisteras inte i initial scope.

### 3.7 Graph Canvas

Graph Canvas ansvarar för visning och browserinteraktion:

- matematisk koordinat → pixelkoordinat,
- axlar och grid,
- rendering av segment,
- device pixel ratio,
- tema,
- pointer-drag för panorering,
- hjulzoom runt pekarens position,
- reset-kontroll,
- confinement av touchgest till graph surface via `touch-action`.

Canvas evaluerar inte uttryck och avgör inte matematiska diskontinuiteter. Interaktionen skickar viewportförändringar till applikationslagret, vilket provar om grafen och renderar om den.

### 3.8 Persistence Adapter

`localStorage` kapslas bakom befintlig adapter och lagrar:

- tema,
- DEG/RAD,
- minne,
- max 100 historikposter.

Grafstödet kräver ingen schemaändring. Aktuellt uttryck, graph samples och viewport är session-/UI-state och persisteras inte.

Legacy-data som innehåller äldre mode-fält ska fortsatt kunna läsas defensivt och ignoreras.

### 3.9 PWA / Service Worker

`vite-plugin-pwa`/Workbox levererar app shell och resurser offline. Grafstöd kräver inga nya nätverksanrop och ingår därför i samma statiska/offlinekapabla bundle.

## 4. Responsiv workspace-arkitektur

### Porträtt

- Grundknappsats är primär.
- Vetenskapliga funktioner visas via `Funktioner` på små skärmar.
- `x` kan matas in via funktionsytan eller tangentbordet.
- Ingen permanent graph surface i initial scope.
- Ett grafbart uttryck visar diskret att grafen finns i landskap.

### Landskap

Layouten består av två stabila områden:

```text
┌────────────────────┬────────────────────────┐
│ Calculator column  │ Secondary workspace    │
│ display/result     │ functions OR graph     │
│ actions            │                        │
│ numeric keypad     │                        │
└────────────────────┴────────────────────────┘
```

Calculator column behåller samma geometri när secondary workspace växlar innehåll.

Utan `x` visar secondary workspace vetenskapliga funktioner permanent.

Med `x` visas grafen som standard. `Funktioner` ersätter då grafen tillfälligt i secondary workspace utan att flytta numeric keypad. Historik förblir on demand som overlay/drawer.

Denna geometri verifieras i Playwright genom att sifferknappsatsens position jämförs före och efter grafaktivering samt när funktionspanelen öppnas ovanpå grafytan.

## 5. Dataflöden

### 5.1 Numerisk beräkning

```text
Input
→ Calculator State
→ Expression Engine
→ Numeric Formatter
→ State/history
→ UI
```

### 5.2 Graf

```text
Expression containing x
→ graphable-expression detection
→ Graph Sampler(viewport, expression, angleMode)
→ Expression Engine(expression, angleMode, {x}) repeated
→ curve segments
→ Graph Canvas
```

Enskilda evaluation errors under sampling blir segmentavbrott och inte ett globalt calculator error.

### 5.3 Viewportinteraktion

```text
pointer drag / wheel
→ Graph Canvas interaction
→ pure viewport transform
→ application viewport state
→ Graph Sampler
→ Graph Canvas repaint
```

Graph gestures är begränsade till graph surface och förändrar inte calculator controls. Reset återgår deterministiskt till standardviewporten.

## 6. Data och ägarskap

Persistenta objekt:

- settings: `angleMode`, `theme`,
- memory,
- history.

Temporära graph-objekt:

- current graphable expression,
- mathematical viewport,
- sampled segments.

Expression engine äger matematiksemantik. Graph Sampler äger sampling/discontinuity-policy. Viewportlagret äger koordinattransformation för pan/zoom. Canvas äger pixelrendering och browsergesttolkning. UI äger layout/presentation.

## 7. Felmodell

Direkt kalkylatorutvärdering visar kontrollerade fel för syntax, division med noll, domän, saknad variabel och icke-visningsbart resultat.

Graph Sampler behandlar motsvarande fel för enskilda `x`-värden som lokala sampling gaps när det är matematiskt rimligt.

Ett programmerings-/systemfel får inte döljas som en matematisk diskontinuitet.

## 8. Säkerhetsarkitektur

- inga externa graph-/math-API:er,
- ingen dynamisk kodexekvering,
- inputgräns kvarstår,
- inga secrets,
- lokal beräkningsdata,
- dependencies låses i lockfil,
- Canvas renderar endast intern numerisk data och text som redan är UI-kontrollerad.

## 9. Prestanda

Graphing introducerar upprepad expression evaluation. Därför gäller:

- sampling density är begränsad/proportionerlig till viewport,
- viewportens spann är begränsat för att undvika patologiska zoomlägen,
- DOM-element per graph sample undviks; Canvas används,
- omprovtagning sker efter viewportförändring,
- Web Worker införs inte initialt men kan övervägas om mätning på verklig mobil hårdvara visar UI-blockering.

## 10. Deployment och drift

Deploymentmodellen förändras inte:

```text
Source → Vite build → statiska filer → GitHub Pages/HTTPS → PWA cache
```

Graphing kräver ingen serverkonfiguration, migration eller ny extern tjänst.

## 11. Teknikval

- TypeScript
- React
- Vite
- egen explicit expression parser/evaluator
- HTML Canvas 2D för graph rendering
- localStorage bakom adapter
- vite-plugin-pwa/Workbox
- Vitest + React Testing Library + Playwright

Ett externt plottingbibliotek ska endast införas om den interna Canvas-lösningen inte ger tillräcklig korrekthet eller underhållbarhet. Ett sådant byte kräver ny dependency-/bundle-/security-bedömning.

## 12. Arkitekturbeslut

- ARCH-001: klientbaserad statisk PWA utan backend.
- ARCH-002: React + TypeScript + Vite.
- ARCH-003: egen explicit parser/evaluator utan dynamisk kodexekvering.
- ARCH-004: JavaScript `Number` + central formattering.
- ARCH-005: localStorage bakom adapter, historik max 100 poster.
- ARCH-006: vite-plugin-pwa/Workbox.
- ARCH-007: Vitest + RTL + Playwright.
- ARCH-008: graphing använder samma Expression Engine med explicit variable context.
- ARCH-009: Graph Sampler är ett separat rent domänlager mellan evaluator och renderer.
- ARCH-010: Canvas 2D är renderer för initial graphing-scope.
- ARCH-011: graph presentation är expression-/viewport-driven och inte ett separat calculator mode.
- ARCH-012: landscape calculator column är spatialt stabil; secondary workspace byter mellan functions och graph.
- ARCH-013: graph viewport-transformationer är rena domänfunktioner; pointer/wheel events stannar i Canvas/UI-lagret.
- ARCH-014: graph viewport är temporär och återställs deterministiskt, inte persisterad.

## 13. Viktiga trade-offs

### Graph endast i initial landskapsyta

Det håller phone portrait enkelt och ger grafen meningsfull yta. Nackdelen är att användaren behöver rotera en smal telefon för att se grafen. Uttrycket och `x`-input fungerar dock fortfarande i porträtt så rotationen förlorar inte arbetet.

### Canvas kontra SVG/plotting library

Canvas ger liten dependency-yta och lämpar sig för många sampled points. Det ger mindre native DOM-semantik, vilket kompenseras med tillgängliga kontroller/labels utanför canvas.

### Sampling kontra symbolisk analys

Initial version provar funktionen numeriskt i stället för att analysera den symboliskt. Det håller scope rimligt men kräver försiktig discontinuity-policy och betyder att perfekt identifiering av alla asymptoter inte garanteras.

### Temporär viewport kontra persistens

Viewporten återställs när grafsessionen lämnas och sparas inte mellan sessioner. Det minskar state-/migrationsytan och ger ett förutsägbart startläge, på bekostnad av att användaren inte kan återuppta en tidigare pan/zoom-position.

## 14. Öppna arkitekturfrågor

Inga blockerande arkitekturfrågor återstår för den initiala graphing-serien. Verklig touchkänsla och prestanda på olika mobila enheter ska fortsatt följas upp som manuell acceptans och kan motivera framtida optimering utan att ändra nuvarande domängränser.
