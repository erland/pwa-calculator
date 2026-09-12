# Release readiness – 1.0.0-rc.1

## Bedömning

**READY_WITH_WARNINGS**

Samtliga automatiserbara Must-flöden och releasekontroller är gröna. Varningen gäller att den exakta installationsytan och visuella presentationen varierar mellan Safari/iOS, Chromium och andra plattformar och därför bör få en avslutande manuell kontroll på avsedd hosting före märkning som stabil 1.0.0.

## Gates

| Gate | Status | Evidens |
|---|---|---|
| Must-scope | PASS | Funktionell specifikation, implementation och acceptansmatris nedan |
| Lint och typkontroll | PASS | `npm run verify`, GitHub Actions |
| Enhets-/komponenttest | PASS | 39 tester i 5 testfiler |
| E2E desktop och mobil | PASS | Playwright i GitHub Actions |
| PWA-build och offline | PASS | Genererat manifest/service worker samt offline-E2E |
| Dependency security | PASS | `npm audit --audit-level=high`: 0 sårbarheter |
| Paketering | PASS | Statisk `dist/`, reproducerbar via `npm ci && npm run build` |
| Konfiguration/installation/drift | PASS | Aktuella dokument under `docs/` |
| Secrets och dataminimering | PASS | Inga secrets behövs; inga externa dataanrop i kärnflödet |
| Repository hygiene | PASS | Genererade kataloger ignoreras; dependencies är låsta |

## Acceptance criteria

| Kriterium | Status | Primär evidens |
|---|---|---|
| AC-001 Enkel huvudräkning | PASS | Komponenttest och E2E |
| AC-002 Operatorprioritet | PASS | Engine-test och E2E |
| AC-003 Parenteser | PASS | Engine-test |
| AC-004 Procent | PASS | Engine-test |
| AC-005 Trigonometri i grader | PASS | Engine-, komponent- och E2E-test |
| AC-006 Trigonometri i radianer | PASS | Engine-test |
| AC-007 Matematiskt fel | PASS | State-, komponent- och E2E-test |
| AC-008 Historik | PASS | E2E med omladdning |
| AC-009 Minne | PASS | State-, komponent- och E2E-test |
| AC-010 Lägesväxling | PASS | State- och E2E-test |
| AC-011 Tangentbord/decimaltecken | PASS | Engine-, komponent- och E2E-test |
| AC-012 Mobil layout | PASS | Mobil E2E och overflow-kontroll |
| AC-013 Offline | PASS | Service-worker-E2E efter offline-omladdning |
| AC-014 Tema | PASS | Komponent- och E2E-test med omladdning |
| AC-015 PWA-installation | PASS med plattformsvarning | Manifest, ikoner, service worker och offline-E2E |

## Kända begränsningar

- IEEE-754 `Number`, inte godtycklig precision.
- PWA-installationsflödet bestäms av webbläsare och operativsystem.
- Ingen synkronisering mellan enheter eller central backup av lokal historik.
- Ingen grafräkning, symbolisk algebra eller komplex aritmetik i v1.

## Kvar före stabil 1.0.0

- Publicera rc.1 på avsedd HTTPS-hosting.
- Gör en kort manuell visuell/installationskontroll på minst en mobil och en desktop.
- Om inga blockerande avvikelser hittas: märk samma funktionella scope som 1.0.0.
