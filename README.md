# Miniräknaren

En responsiv och installerbar PWA med två tydliga nivåer:

- **Enkel** för traditionell vardagsräkning.
- **Avancerad** för parenteser, procent, potens, kvadratrot, trigonometri, logaritmer, konstanter, minne och historik.

Appen är helt lokal, saknar backend och kan användas offline efter den första fullständiga laddningen. Matematiska uttryck tolkas av en explicit parser utan `eval` eller dynamisk kodexekvering.

## Förutsättningar

- Node.js 22.12 eller senare
- npm 11 eller kompatibel npm-version
- Chromium för Playwrights E2E-tester

## Utveckling

```bash
npm ci
npm run dev
```

Vite visar den lokala utvecklingsadressen i terminalen.

## Verifiering

Kör lint, typkontroll, enhets-/komponenttester och produktionsbygge:

```bash
npm run verify
```

Installera Playwrights Chromium en gång och kör E2E:

```bash
npx playwright install chromium
npm run test:e2e
```

På Linux kan webbläsarens systemberoenden installeras med:

```bash
npx playwright install --with-deps chromium
```

GitHub Actions kör båda verifieringsnivåerna automatiskt för push till `main` och pull requests.

## Produktion och PWA

```bash
npm run build
npm run preview
```

Produktionsfilerna skapas i `dist/`. Distribuera hela katalogen till statisk hosting med HTTPS. Manifest och service worker genereras av `vite-plugin-pwa`.

För att kontrollera offlinefunktionen:

1. öppna preview-versionen online,
2. vänta tills service workern är registrerad,
3. ladda om sidan så att den kontrolleras av service workern,
4. växla webbläsaren till offline och ladda om,
5. verifiera exempelvis `7 × 8 = 56` samt sparade inställningar.

## Lokal data

Läge, tema, vinkelenhet, minne och de 100 senaste avancerade beräkningarna lagras versionsmärkt i `localStorage`. Korrupt eller blockerad lagring återställs defensivt och får inte hindra kärnberäkningen.

## Kända begränsningar

- JavaScript `Number` använder IEEE-754 och ger inte godtycklig precision eller exakt finansiell decimalaritmetik.
- Resultat avrundas för tydlig visning och mycket stora eller små tal visas i vetenskaplig notation.
- PWA-installationens meny och funktion varierar mellan webbläsare och operativsystem. Webbappen fungerar även utan en särskild installationsknapp.
- PWA och service worker kräver HTTPS i produktion; `localhost` är undantaget för utveckling.
- V1 omfattar inte grafer, symbolisk algebra, komplexa tal, enhetskonvertering eller molnsynkronisering.

## Dokumentation

- [Funktionell specifikation](docs/functional-specification.md)
- [Arkitektur](docs/architecture.md)
- [Utvecklingsplan](docs/development-plan.md)
- [Konfiguration](docs/configuration.md)
- [Installation](docs/installation.md)
- [Drift](docs/operations.md)
- [Release readiness](docs/release-readiness.md)
- [Ändringslogg](CHANGELOG.md)
