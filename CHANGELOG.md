# Ändringslogg

Alla betydande förändringar dokumenteras här.

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

### Kända begränsningar

- Numeriken bygger på JavaScript `Number` och är inte avsedd för godtycklig precision.
- Installationsytan för PWA varierar mellan plattformar.
