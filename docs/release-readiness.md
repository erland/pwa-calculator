# Release readiness – Graphing support

## Bedömning

**READY_WITH_DEVICE_CHECK**

Graphing change-serien är automatiskt verifierad och redo att mergeas. Den kvarvarande kontrollen är en rekommenderad manuell real-device-genomgång av touch/pan/zoom och safe-area på representativa iPhone/iPad-enheter. Den kontrollen är inte ett känt kodblockerande fel och automatiserad Playwright-täckning är grön.

## Gates

| Gate | Status | Evidens |
|---|---|---|
| Graphing Must-scope | PASS | Funktionell specifikation AC-015–AC-020 samt DEV-013–DEV-017 |
| Viewportinteraktion | PASS | AC-021, viewport-unit tests och Playwright pan/zoom/reset |
| Lint och typkontroll | PASS | `npm run verify`, CI #63 och efterföljande grön PR-head |
| Enhets-/komponenttest | PASS | Expression engine, sampler, viewport och GraphCanvas-tester |
| E2E desktop och mobil | PASS | Playwright i Chromium desktop/mobile-profiler |
| Responsiv landskapslayout | PASS | Telefon/iPad-landskap, stabil keypad-position och overflow-assertions |
| PWA-build och offline | PASS | Pages-build och befintlig offline-E2E |
| Lokal/offline graphing | PASS | Ingen backend eller extern graph-/math-tjänst; graphing ingår i statisk bundle |
| Persistenskompatibilitet | PASS | Graph viewport kräver ingen schemaändring; legacy `mode` ignoreras fortsatt |
| Dokumentationsdrift | PASS | README, funktionell specifikation, arkitektur, changelog, change record och System Builder-status synkas i DEV-018 |
| Manuell touch/device-kontroll | RECOMMENDED | Checklista nedan; ska inte markeras utförd utan verklig enhetskontroll |

## Graphing acceptance

| Kriterium | Status | Primär evidens |
|---|---|---|
| AC-015 x-utvärdering | PASS | Expression engine unit tests |
| AC-016 Automatisk graf | PASS | Playwright landscape graph activation |
| AC-017 Stabil knappsats | PASS | Playwright jämför keypad-koordinater före/efter graph activation |
| AC-018 Funktioner under graf | PASS | Playwright secondary-workspace-växling utan keypad-flytt |
| AC-019 Porträtt | PASS | Playwright phone portrait: `x` kan matas in, grafyta dold, hint visas |
| AC-020 Diskontinuitet | PASS | Sampler tests för `1/x`, `tan(x)` och domänfel |
| AC-021 Viewportinteraktion | PASS | Unit tests + Playwright pan/zoom/reset |

## Regression

Följande befintliga beteenden ingår fortsatt i den gröna regressionssviten:

- grundläggande aritmetik och operatorprioritet,
- vetenskapliga funktioner och DEG/RAD,
- historik och reload-persistens,
- minne,
- tema och reload-persistens,
- tangentbordsinmatning,
- felåterhämtning,
- telefonporträtt,
- telefon- och surfplattelandskap,
- PWA-manifest/service worker och offlinekörning.

## Kända begränsningar

- JavaScript `Number`/IEEE-754 används; ingen godtycklig precision.
- En realvärd funktion av `x` visas åt gången.
- Grafen använder numerisk sampling. Domänfel och uppenbara hopp segmenteras, men symbolisk identifiering av alla asymptoter garanteras inte.
- Full grafyta är i initial scope en landskapsfunktion; telefonporträtt visar uttrycket och en diskret landskapsindikering.
- Grafviewporten är temporär och persisteras inte mellan sessioner.
- Flera samtidiga grafer, tabeller, nollställen, skärningspunkter, extrempunkter, derivator, symbolisk algebra och komplexa tal ligger utanför scope.
- Touch-/wheel-detaljer kan variera mellan browser/OS även om pointer- och wheel-flöden verifieras automatiskt.

## Manuell real-device-checklista

Före eller strax efter merge rekommenderas följande på faktisk hårdvara:

- [ ] iPhone porträtt: vanlig kalkylator ryms utan oönskad scroll; `x` under Funktioner ger endast diskret grafhint.
- [ ] iPhone landskap: `x^2-4` visar grafen; sifferknappsatsen ligger kvar; safe-area/notch respekteras.
- [ ] iPhone landskap: dra grafen med finger och verifiera att sidan inte panoreras i stället.
- [ ] iPhone/iPad landskap: pinch/zoom där browsern levererar motsvarande pointer/wheel-input; verifiera användbar känsla.
- [ ] iPad landskap: graf + kalkylator utnyttjar bredden utan page overflow.
- [ ] Ljust/mörkt tema: grid, axlar och kurva är läsbara.
- [ ] Återställ graf: viewport återgår till standard utan att kalkylatorkolumnen flyttar sig.

## Merge/release

DEV-018 kräver ingen ny backend, migration eller deploymentskonfiguration. När sista PR-headen har full grön CI och dokumentations-/statussynken är committad är graphing change-serien merge-ready. En separat versions-/releaseändring kan göras efter merge enligt projektets normala releaseflöde.
