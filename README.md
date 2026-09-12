# Calculator PWA

En lättanvänd, installerbar miniräknare som fungerar på både mobil och dator och erbjuder två tydliga nivåer: **Enkel** och **Avancerad**.

Projektet är under implementation. Canonical produktkrav finns i `docs/functional-specification.md`, arkitekturen i `docs/architecture.md`, utvecklingsplanen i `docs/development-plan.md` och aktuell arbetsstatus i `.system-builder/work-status.yaml`.

## Aktuell status

- CREATE-planering: klar
- DEV-001–DEV-007: implementerade och verifierade
- DEV-008: implementation och PWA-build klara; verklig browser/offline-verifiering blockerad i aktuell arbetsmiljö
- DEV-009–DEV-010: återstår
- Nästa säkra åtgärd: återuppta DEV-008 i en miljö där Chromium kan köras

## Låst arkitekturbas för v1

- TypeScript
- React + Vite
- Klientbaserad PWA utan backend/databas
- Egen explicit expression parser/evaluator, utan `eval`
- JavaScript `Number` med central resultatformatterare
- `localStorage` bakom adapter för inställningar, minne och historik
- `vite-plugin-pwa`/Workbox för manifest, service worker och offline-cache
- Vitest + React Testing Library + Playwright för verifiering

## Lokal verifiering

```bash
npm ci
npm run verify
npx playwright install chromium
npm run test:e2e
```

De tre första verifieringsnivåerna (`lint`, `typecheck`, enhets-/komponenttest) och produktionens PWA-build är gröna. E2E kräver en lokalt tillgänglig Playwright Chromium-installation.
