# Drift

Calculator PWA är en statisk klientapplikation utan backend, databas eller central telemetry.

## Hälsokontroll

Kontrollera att hosting svarar med lyckad HTTP-status för appens basväg (`/pwa-calculator/` på GitHub Pages) och att en grundberäkning fungerar. Manifest och service-worker-filer ska också vara åtkomliga.

## Loggar och felsökning

Hostingens vanliga HTTP-/CDN-loggar visar leveransfel. Klientfel granskas i webbläsarens konsol. Ingen beräkningshistorik skickas till central loggning.

Vanliga problem:

- **Ny version syns inte:** kontrollera cachepolicy för `index.html` och `sw.js`, vänta på uppdateringsprompt och ladda om.
- **Offline fungerar inte:** verifiera HTTPS, lyckad första laddning och aktiv service-worker-kontroll.
- **Historik eller tema försvinner:** kontrollera privat läge, blockerad lagring eller att webbplatsdata har rensats.
- **Installation erbjuds inte:** kontrollera manifest/service worker och plattformens egna PWA-regler; webbappen ska fortfarande fungera normalt.

## Backup och återställning

Det finns ingen central användardata att säkerhetskopiera. Source och releaser bevaras i GitHub. Hostingplattformens versionerade deployment eller den föregående `dist/`-artefakten används för rollback.

## Uppgradering

Publicera en komplett ny build. Appen meddelar användaren när en ny service worker är klar och låter användaren välja kontrollerad omladdning.

För GitHub Pages skapas en GitHub Release. Händelsen `release.published` startar `Deploy GitHub Pages`, som bygger och publicerar `dist/`. Följ körningen under Actions och kontrollera därefter [den publicerade appen](https://erland.github.io/pwa-calculator/). Workflowen kan också köras manuellt med `workflow_dispatch`.

För rollback: publicera om en känd fungerande tagg som en ny release eller kör workflowen manuellt från den fungerande committen/branchen.
