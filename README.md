# Miniräknaren

En responsiv och installerbar PWA som kombinerar traditionell vardagsräkning, vetenskapliga funktioner och grafritning i ett enda adaptivt gränssnitt.

**Publicerad app:** [https://erland.github.io/pwa-calculator/](https://erland.github.io/pwa-calculator/)

Grundläggande siffer- och operatorfunktioner är alltid direkt tillgängliga. Vetenskapliga funktioner, DEG/RAD, minne och historik visas eller fälls fram utifrån tillgängligt skärmutrymme: på små porträttskärmar hålls de sekundära funktionerna undan tills de behövs, medan landskap och större skärmar kan visa mer samtidigt. Kalkylatorytan har ingen permanent titel/header eller temaväljare; färgschemat följer systemet. På 375×812 ryms hela expanderade Funktioner-panelen tillsammans med hela sifferknappsatsen utan page scroll.

Grafstöd aktiveras av uttrycket i stället för av ett separat grafläge. Variabeln `x` finns under **Funktioner** och kan även matas in från tangentbordet. På telefon i porträtt förblir kalkylatorn kompakt; ett `x`-uttryck visar en diskret indikation om att grafen finns i landskap. I landskap ligger graf/vetenskapliga funktioner i vänster sekundäryta medan kalkylatorn och sifferknappsatsen ligger stabilt till höger. När vetenskapliga funktioner visas bottenjusteras deras knappsats mot sifferknappsatsen.

Grafen kan panoreras genom drag, zoomas med browserns hjul-/pekinteraktion och återställas till standardområdet `-10..10` på båda axlarna. Grafprovtagning, rendering och övrig matematik sker lokalt utan backend.

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

## Publicering på GitHub Pages

När en GitHub Release publiceras startar `Publish release to GitHub Pages` en separat `Deploy GitHub Pages`-körning från `main`. Deploymenten körs från `main` för att uppfylla Pages-miljöns skyddsregel, bygger appen med basvägen `/pwa-calculator/` och publicerar resultatet. `Deploy GitHub Pages` kan även startas manuellt från fliken Actions.

Repositoryts Pages-källa ska vara **GitHub Actions**. Den publicerade appen finns på [https://erland.github.io/pwa-calculator/](https://erland.github.io/pwa-calculator/).

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

Vinkelenhet, minne och de 100 senaste slutförda beräkningarna lagras versionsmärkt i `localStorage`. Tema följer systemets färgschema och sparas inte som användarinställning. Grafens aktuella viewport och pågående uttryck är temporära och persisteras inte. Äldre lagringsdata som innehåller tidigare fält som `theme` eller `mode` accepteras defensivt och dessa fält ignoreras. Korrupt eller blockerad lagring återställs defensivt och får inte hindra kärnberäkningen.

## Kända begränsningar

- JavaScript `Number` använder IEEE-754 och ger inte godtycklig precision eller exakt finansiell decimalaritmetik.
- Grafstödet visar en realvärd funktion av `x` åt gången; flera samtidiga kurvor, symbolisk algebra, komplexa tal och grafanalys som nollställen/skärningspunkter/derivator ingår inte.
- Grafen bygger på numerisk sampling. Domänfel och uppenbara diskontinuiteter segmenteras, men alla matematiska asymptoter kan inte garanteras bli symboliskt identifierade.
- Den fulla grafytan visas i landskap, inte permanent i telefonporträtt.
- Grafens viewport sparas inte mellan sessioner.
- Appens ljust/mörkt-tema följer systeminställningen och kan inte väljas separat i appen.
- PWA-installationens meny och funktion varierar mellan webbläsare och operativsystem. Webbappen fungerar även utan en särskild installationsknapp.
- PWA och service worker kräver HTTPS i produktion; `localhost` är undantaget för utveckling.

## Dokumentation

- [Funktionell specifikation](docs/functional-specification.md)
- [Arkitektur](docs/architecture.md)
- [Utvecklingsplan](docs/development-plan.md)
- [Konfiguration](docs/configuration.md)
- [Installation](docs/installation.md)
- [Drift](docs/operations.md)
- [Release readiness](docs/release-readiness.md)
- [Ändringslogg](CHANGELOG.md)
