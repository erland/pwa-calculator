# Konfiguration

Calculator PWA har inga serverhemligheter, API-nycklar eller obligatoriska runtime-variabler.

## Build-konfiguration

PWA-manifest, cachemönster och service-worker-strategi finns i `vite.config.ts`. Ändringar där kräver ny produktion build och förnyad offlineverifiering.

## Lokal användarkonfiguration

Följande sparas i webbläsarens `localStorage` under en versionsmärkt nyckel:

- Enkel/Avancerad,
- DEG/RAD,
- system/ljust/mörkt tema,
- minnesvärde,
- högst 100 historikposter.

Data är lokal för aktuell webbläsarprofil. Privat läge, användarrensning eller webbläsarpolicy kan göra lagringen tillfällig eller otillgänglig. Appen fortsätter då fungera utan persistens.

## Hosting

Hosting ska leverera `dist/` över HTTPS med korrekta MIME-typer. Ingen serverkonfiguration, databas eller persistent volym behövs.
