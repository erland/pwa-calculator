# Installation och distribution

## Lokal installation

```bash
npm ci
npm run verify
```

För full E2E-verifiering:

```bash
npx playwright install chromium
npm run test:e2e
```

## Skapa leverans

```bash
npm run build
```

Det kompletta statiska resultatet ligger i `dist/`. Katalogen ska distribueras atomiskt som en enhet.

## Krav på hosting

- HTTPS i produktion.
- Statiska filer och korrekta MIME-typer.
- `index.html`, manifest, ikoner, `sw.js`, Workbox och hashade assets ska publiceras tillsammans.
- Ingen aggressiv mellanliggande cache av `index.html` eller `sw.js` som förhindrar versionsupptäckt.

## Verifiera distributionen

1. Öppna webbappen och genomför en grundberäkning.
2. Kontrollera i webbläsarens Application/Storage-vy att manifest och service worker är aktiva.
3. Ladda om offline och verifiera `7 × 8 = 56`.
4. Verifiera att tema och historik finns kvar efter omladdning.
5. Kontrollera installationsmöjligheten på en plattform som exponerar PWA-installation.

## Rollback

Återpublicera föregående kompletta `dist/` atomiskt. Blanda inte filer från två versioner. Den versionsmärkta lokala datamodellen i rc.1 kräver ingen servermigration.
