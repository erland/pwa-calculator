# Ändringslogg

Alla betydande förändringar dokumenteras här.

## Ej släppt – compact responsive layout

### Ändrat

- Apptitel/header och temaväljare är borttagna från kalkylatorytan.
- Ljust/mörkt tema följer nu systemets `prefers-color-scheme`; nya persistensposter lagrar inte längre `theme`.
- Legacy localStorage med tidigare `theme`- och `mode`-fält accepteras fortsatt och dessa fält ignoreras utan att DEG/RAD, minne eller historik tappas.
- I landskap ligger graph/scientific-sekundärytan till vänster och den stabila kalkylatorn/sifferknappsatsen till höger.
- Scientific-knappsatsen bottenjusteras mot sifferknappsatsen i landskap.
- Små porträttvyer använder kompakt spacing och fem scientific-kolumner; på 375×812 ryms fullt expanderade Funktioner tillsammans med hela sifferknappsatsen utan page scroll.

### Verifierat

- Telefonlandskap 844×390: vänster/höger-ordning, stabil keypad-position, graph/functions-växling och no-overflow.
- iPad-landskap 1024×768: samma spatiala modell och bottom alignment.
- Porträtt 375×812: hela scientific-panelen och hela numeric keypad synliga utan vertikal sidscroll.
- Systemtema växlar med browserns färgschemapreferens och temapreferens skrivs inte till localStorage.
- Befintliga calculator-, graph-, history-, memory-, persistence-, PWA- och offline-regressioner är gröna.

## Ej släppt – grafstöd

### Tillagt

- Variabeln `x` i expression engine med explicit evalueringskontext.
- Numerisk grafprovtagning med segmentering vid domänfel och uppenbara diskontinuiteter.
- Canvas-baserad graf med grid, axlar, tema- och Retina/DPI-stöd.
- Automatisk grafpresentation i landskap när uttrycket använder `x`.
- Stabil landskapslayout där sifferknappsatsen ligger kvar när sekundärytan växlar mellan vetenskapliga funktioner och graf.
- Diskret porträttindikering för `x`-uttryck utan permanent grafyta.
- Panorering genom drag, zoom runt pekarposition och återställning till standardviewport `-10..10`.
- Enhets-, komponent- och Playwright-täckning för expression engine, sampling, graf-rendering, responsiv layout och viewportinteraktion.

### Kända begränsningar

- En realvärd funktion av `x` visas åt gången.
- Grafen använder numerisk sampling och garanterar inte symbolisk identifiering av alla asymptoter.
- Full grafyta visas i initial scope i landskap, inte permanent i telefonporträtt.
- Grafviewporten persisteras inte mellan sessioner.
- Flera kurvor, funktionsvärdestabeller och analytiska funktioner som nollställen/skärningspunkter/derivator ingår inte.

## 1.0.0-rc.1 – 2026-09-12

### Tillagt

- Enkel och Avancerad miniräknare i responsiv React-layout.
- Explicit parser/evaluator för grundläggande och vetenskaplig matematik.
- DEG/RAD, historik, minne samt systemstyrt/ljust/mörkt tema.
- Tangentbordsstöd och tillgänglig semantik.
- Versionsmärkt lokal persistens med defensiv fallback.
- Installerbar PWA med app-shell-cache och kontrollerad uppdateringsprompt.
- Enhets-, komponent-, tillgänglighets- och Playwright E2E-tester.
- GitHub Actions för full verifiering i desktop- och mobilprofil.
- Release-styrd publicering till GitHub Pages med repository-korrekt basväg.
- Release-publiceringen dispatchar Pages-jobbet från `main` så att miljöns taggskydd respekteras.

### Kända begränsningar

- Numeriken bygger på JavaScript `Number` och är inte avsedd för godtycklig precision.
- Installationsytan för PWA varierar mellan plattformar.
