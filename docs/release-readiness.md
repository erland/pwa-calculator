# Release readiness – Compact responsive layout

## Bedömning

**READY_WITH_DEVICE_CHECK**

Compact-responsive change-serien är automatiskt verifierad genom DEV-019–DEV-021 och avslutas i DEV-022 med full PR-head-verifiering. Kvarvarande kontroll är en rekommenderad manuell real-device-genomgång på representativ iPhone/iPad för faktisk safe-area/touchkänsla. Den är inte ett känt kodblockerande fel.

## Gates

| Gate | Status | Evidens |
|---|---|---|
| Header/theme removal | PASS | DEV-019 + component/E2E |
| System theme | PASS | `prefers-color-scheme`-E2E och ingen `theme` i ny persistens |
| Legacy persistence | PASS | legacy `theme`/`mode` accepteras och ignoreras med angleMode/memory/history bevarade |
| Reversed landscape | PASS | DEV-020 Playwright 844×390 och 1024×768 |
| Stable numeric keypad | PASS | koordinatassertions genom graph/functions-växling |
| Scientific bottom alignment | PASS | lower-edge geometry assertions; initial offset reparerad i DEV-020 |
| Compact portrait 375×812 | PASS | DEV-021 Playwright med fullt expanderade Funktioner och komplett numeric keypad utan page scroll |
| Graph regression | PASS | graph activation, pan/zoom/reset och portrait hint ingår i E2E |
| Calculator regression | PASS | arithmetic, science, DEG/RAD, history, memory och error recovery |
| PWA/offline | PASS | Pages-build + service-worker/offline E2E |
| Dokumentationsdrift | PASS | README, spec, architecture, changelog, readiness, change record och status synkas i DEV-022 |
| Manuell touch/device-kontroll | RECOMMENDED | Checklista nedan; inte markerad utförd utan verklig enhetskontroll |

## Compact responsive acceptance

| Kriterium | Status | Primär evidens |
|---|---|---|
| Ingen header/temaväljare | PASS | DOM/E2E |
| Systemtema utan persistens | PASS | media-emulation + localStorage assertion |
| Legacy theme/mode migration | PASS | persistence unit tests |
| Secondary workspace vänster | PASS | phone/iPad geometry assertions |
| Calculator/numeric keypad höger och stabil | PASS | före/efter graph/functions coordinate assertions |
| Scientific keypad bottom-aligned | PASS | phone/iPad lower-edge assertions |
| 375×812 expanded Functions fit | PASS | dedicated portrait E2E |
| x auto-collapse + portrait hint | PASS | portrait E2E |
| No page overflow | PASS | portrait/landscape document geometry assertions |

## Regression

Följande beteenden ingår fortsatt i den gröna regressionssviten:

- grundläggande aritmetik och operatorprioritet,
- vetenskapliga funktioner och DEG/RAD,
- historik och reload-persistens,
- minne,
- systemtema,
- tangentbordsinmatning inklusive `x`,
- felåterhämtning,
- telefonporträtt,
- telefon- och surfplattelandskap,
- graph activation och graph viewport interaction,
- PWA-manifest/service worker och offlinekörning.

## Kända begränsningar

- JavaScript `Number`/IEEE-754 används; ingen godtycklig precision.
- En realvärd funktion av `x` visas åt gången.
- Grafen använder numerisk sampling och garanterar inte symbolisk identifiering av alla asymptoter.
- Full grafyta är en landskapsfunktion; telefonporträtt visar uttrycket och en diskret landskapsindikering.
- Grafviewporten persisteras inte mellan sessioner.
- Appens tema kan inte väljas oberoende av systemets färgschema.
- Touch-/wheel-/safe-area-detaljer kan variera mellan browser/OS även om automatiserad geometri och pointer/wheel-flöden är verifierade.

## Manuell real-device-checklista

Före eller strax efter merge rekommenderas följande på faktisk hårdvara:

- [ ] iPhone 13 mini porträtt: öppna Funktioner och verifiera att hela funktionspanelen + hela sifferknappsatsen ryms utan oönskad page scroll.
- [ ] iPhone porträtt: välj `x`; Funktioner fälls ihop och endast diskret grafhint visas.
- [ ] iPhone landskap: secondary graph/scientific-yta ligger vänster, calculator/numeric keypad höger och notch/safe-area respekteras.
- [ ] iPhone landskap: dra/zooma grafen och verifiera att sidan inte panoreras i stället.
- [ ] iPad landskap: samma vänster/höger-modell och bottom alignment känns visuellt balanserad.
- [ ] Ljust/mörkt systemtema: kalkylator, scientific-kontroller, grid, axlar och kurva är läsbara.
- [ ] Historik/minne/DEG-RAD: verifiera normal användning efter uppgradering från tidigare sparad appdata.

## Merge/release

DEV-022 kräver ingen backend, migration eller deploymentskonfiguration. När sista PR-headen har full grön CI och System Builder-statusen markerar DEV-022 samt `CHG-COMPACT-RESPONSIVE-LAYOUT` completed är PR #6 merge-ready. En separat versions-/releaseändring kan göras efter merge enligt projektets normala releaseflöde.
