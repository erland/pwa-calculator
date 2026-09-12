# Development plan – Calculator PWA v1

## 1. Syfte

Denna plan bryter ned implementationen av Calculator PWA v1 i små, säkra och verifierbara utvecklingssteg. Varje DEV-steg ska kunna genomföras separat med kommandot **”Gör nästa steg”** och lämna projektet i ett fungerande eller tydligt verifierbart tillstånd.

Planen utgår från:

- `docs/functional-specification.md`
- `docs/risk-feasibility.md`
- `docs/architecture.md`

## 2. Genomförandeprinciper

För varje steg gäller:

1. Ändra endast det som behövs för stegets scope.
2. Lägg till eller uppdatera tester samtidigt som funktionaliteten införs.
3. Kör relevanta verifieringar innan steget markeras klart.
4. Uppdatera dokumentation och System Builder-state när steget är klart.
5. Leverera en komplett projekt-zip efter varje avslutat steg.
6. Undvik att introducera funktionalitet som hör till senare steg om den inte krävs för att hålla projektet byggbart.

## 3. Planöversikt

| Steg | Namn | Primärt resultat |
|---|---|---|
| DEV-001 | Projektbootstrap och kvalitetsbas | Körbar React/TypeScript/Vite-app med test- och lintbas |
| DEV-002 | Grundläggande expression engine | Säkra grundberäkningar med parser/evaluator och tester |
| DEV-003 | Avancerad matematik och formattering | Vetenskapliga funktioner, DEG/RAD och robust resultatpresentation |
| DEV-004 | Calculator state och lokal persistens | Testbar applikationslogik, historik, minne och inställningar |
| DEV-005 | Enkel-läge UI | Färdig lättanvänd grundminiräknare för mobil och desktop |
| DEV-006 | Avancerat läge UI | Vetenskapliga funktioner, historik och minne i användargränssnittet |
| DEV-007 | Responsivitet, tangentbord och tillgänglighet | Polerat gränssnitt med tema, keyboard och a11y |
| DEV-008 | PWA, installation och offline | Installerbar PWA som fungerar offline efter första laddning |
| DEV-009 | End-to-end, felhantering och härdning | Verifierade huvudflöden och robust edge-case-hantering |
| DEV-010 | Release readiness v1 | Slutlig dokumentation, verifiering och release-kandidat |
| DEV-011 | Release-styrd GitHub Pages-publicering | Automatisk driftsättning vid publicerad GitHub Release |

## 4. Detaljerade utvecklingssteg

### DEV-001 – Projektbootstrap och kvalitetsbas

**Mål:** Skapa den tekniska bas som alla senare steg bygger på.

**Omfattning:**

- Initiera React + TypeScript + Vite.
- Sätt upp projektstruktur enligt arkitekturens lagergränser.
- Installera och konfigurera Vitest och React Testing Library.
- Sätt upp ESLint och grundläggande formatterings-/typkontroll.
- Lägg in scripts för `dev`, `build`, `test`, `lint` och typkontroll.
- Skapa ett minimalt applikationsskal som renderar utan affärslogik.
- Lägg till första smoke-testet.
- Skapa grundläggande CI-workflow som kör install, lint, test och build.

**Ej i detta steg:**

- matematisk funktionalitet,
- färdigt calculator-UI,
- PWA/service worker.

**Verifiering:**

- ren installation lyckas,
- lint passerar,
- tester passerar,
- produktion build lyckas.

**Klart när:** Projektet kan checkas ut/packas upp och verifieras reproducerbart med dokumenterade kommandon.

---

### DEV-002 – Grundläggande expression engine

**Mål:** Implementera en isolerad och säker kärna för grundläggande matematik.

**Omfattning:**

- Tokenisering för tal, decimaler, `+`, `-`, `*`, `/` och parenteser.
- Parser/evaluator med korrekt operatorprioritet och associativitet.
- Stöd för unärt plus/minus.
- Grundläggande felmodell för ogiltig syntax och division med noll.
- Gräns för uttryckslängd enligt arkitekturen.
- Enhetstester för normala fall, prioritet, parenteser och fel.
- Ingen användning av `eval`, `Function` eller dynamisk kodexekvering.

**Ej i detta steg:**

- trigonometriska funktioner,
- procent,
- historik/UI.

**Verifiering:**

- omfattande expression-engine-tester passerar,
- befintlig projektverifiering passerar.

**Klart när:** Grundberäkningarna kan användas från TypeScript-API:t helt utan React/DOM.

---

### DEV-003 – Avancerad matematik och formattering

**Mål:** Färdigställa beräkningsmotorn för v1:s vetenskapliga funktioner.

**Omfattning:**

- Potenser och kvadrat.
- Kvadratrot.
- Procent enligt definierad v1-semantik.
- `sin`, `cos`, `tan`.
- `log`, `ln`.
- `1/x`.
- Konstanterna `π` och `e`.
- DEG/RAD-stöd.
- Domänfel för exempelvis negativa rötter och ogiltiga logaritmer.
- Numeric Formatter för avrundning, `-0`, mycket stora/små tal och vetenskaplig notation.
- Tester för numeriska gränsfall och kända regressionsfall.

**Verifiering:**

- expression-engine- och formatteringstester passerar,
- representativa vetenskapliga uttryck verifieras mot kända resultat,
- full lint/test/build passerar.

**Klart när:** Hela matematikscope för v1 finns som testbar domänfunktionalitet.

---

### DEV-004 – Calculator state och lokal persistens

**Mål:** Implementera applikationslogiken mellan UI och expression engine.

**Omfattning:**

- State-modell för aktuellt uttryck, resultat och fel.
- Flöden för inmatning, `=`, backspace och clear.
- Växling Enkel/Avancerad.
- DEG/RAD-state.
- Minnesfunktioner `MC`, `MR`, `M+`, `M-`.
- Historik för avancerat läge, max 100 poster.
- Persistence Adapter för settings, memory och history i `localStorage`.
- Defensiv hantering av blockerad/korrupt lagring.
- Schema/version för persistenta data.
- Enhetstester för state-transitions och persistens.

**Verifiering:**

- state- och storage-tester passerar,
- beräkning fungerar även när storage simuleras som otillgänglig,
- full lint/test/build passerar.

**Klart när:** UI kan drivas via en stabil application-state-API utan att känna till matematik- eller storage-detaljer.

---

### DEV-005 – Enkel-läge UI

**Mål:** Leverera den första kompletta användbara miniräknaren.

**Omfattning:**

- Display för uttryck och resultat.
- Stora tydliga knappar för `0–9`, decimal, `+`, `−`, `×`, `÷`, `=`, backspace och clear.
- Tydlig Enkel/Avancerad-växling, där avancerade funktioner inte syns i Enkel-läge.
- Mobil-först-layout med användbara tryckytor.
- Desktop-layout utan att tappa enkelheten.
- Grundläggande visuella tillstånd för aktiv knapp, fel och resultat.
- Komponenttester för centrala användarflöden.

**Verifiering:**

- UC-001 kan genomföras helt i UI:t,
- Enkel-läget fungerar på smal och bred viewport,
- full lint/test/build passerar.

**Klart när:** En användare kan använda appen som traditionell miniräknare utan avancerade kontroller i vägen.

---

### DEV-006 – Avancerat läge UI

**Mål:** Exponera hela v1:s vetenskapliga funktionalitet utan att försämra Enkel-läget.

**Omfattning:**

- Knappar/kontroller för parenteser, procent, potens, kvadratrot, trigonometriska funktioner, logaritmer, `π`, `e`, `1/x` och `±`.
- DEG/RAD-kontroll.
- Minnesfunktioner och minnesindikering.
- Historikpanel med återanvändning av tidigare resultat/uttryck enligt specifikationen.
- Rensa historik.
- Anpassad layout för mobil respektive större skärm.
- Tester för centrala avancerade flöden.

**Verifiering:**

- UC-002, UC-003 och UC-004 kan genomföras i UI:t,
- enkel/avancerad växling bevarar definierad state,
- full lint/test/build passerar.

**Klart när:** Samtliga v1-funktioner är åtkomliga genom användargränssnittet.

---

### DEV-007 – Responsivitet, tangentbord och tillgänglighet

**Mål:** Göra appen bekväm och robust på både mobil och desktop.

**Omfattning:**

- Fullt definierat tangentbordsstöd för relevanta siffror/operatorer och Enter/Backspace/Escape.
- Fokusindikering och logisk tabbordning.
- Semantiska namn/ARIA där native-semantik inte räcker.
- Kontroll av kontrast och text-/touch-target-storlek.
- Ljust, mörkt och systemstyrt tema.
- Persistens av temaval.
- Responsiv finjustering för små mobilskärmar och bred desktop.
- Respekt för relevanta användarpreferenser, exempelvis reducerad animation om animation används.

**Verifiering:**

- huvudsakliga flöden fungerar utan mus,
- tillgänglighetstestning av centrala komponenter passerar,
- visuell/manual kontroll i representativa viewport-storlekar,
- full lint/test/build passerar.

**Klart när:** UI:t uppfyller v1:s UX- och tillgänglighetsmål på både touch- och tangentbordsenheter.

---

### DEV-008 – PWA, installation och offline

**Mål:** Göra applikationen installerbar och offlinekapabel.

**Omfattning:**

- Konfigurera `vite-plugin-pwa`/Workbox.
- Web App Manifest med namn, ikoner och displayinställningar.
- Precache av app shell och nödvändiga statiska resurser.
- Kontrollerad update-prompt/reload-strategi.
- Offline-start efter första lyckade onlinebesöket.
- UI-hantering för tillgänglig ny version om det behövs.
- Dokumenterade lokala instruktioner för att verifiera PWA-installation/offline.

**Verifiering:**

- produktion build genererar manifest/service worker,
- installerbarhetskrav kontrolleras,
- appen startar och räknar utan nätverk efter initial laddning,
- full lint/test/build passerar.

**Klart när:** UC-005 är verifierat i en verklig webbläsarkontext.

---

### DEV-009 – End-to-end, felhantering och härdning

**Mål:** Verifiera helheten och minska regressionsrisk inför release.

**Omfattning:**

- Sätt upp Playwright.
- E2E för grundberäkning, avancerad beräkning, mode switch, historik, minne och tangentbord.
- E2E/offline-kontroll där miljön medger det.
- Regressionstester för fel- och edge cases från specifikationen.
- Säkerställ att orimligt/ogiltigt input inte kraschar appen.
- Kontrollera persistens efter reload.
- Granska bundle/dependencies och ta bort oanvända delar.

**Verifiering:**

- unit/component/E2E passerar,
- lint och build passerar,
- inga kända blockerande v1-fel kvarstår.

**Klart när:** De viktigaste acceptance criteria i funktionella specifikationen är automatiskt eller dokumenterat manuellt verifierade.

---

### DEV-010 – Release readiness v1

**Mål:** Göra projektet redo som v1-releasekandidat.

**Omfattning:**

- Slutlig genomgång mot samtliga Must-krav och acceptance criteria.
- Uppdatera README med installation, utveckling, test, build och PWA-verifiering.
- Dokumentera kända begränsningar för JavaScript `Number` och PWA-installation på olika plattformar.
- Säkerställ versionsinformation och release notes/changelog.
- Kör komplett verifieringssvit från ren installation.
- Kontrollera att ingen utvecklings-/debugfunktion ligger kvar i produktion.

**Verifiering:**

- ren install + lint + test + build + E2E passerar,
- v1-checklista är komplett,
- inga blockerare återstår.

**Klart när:** Projektet kan märkas som release candidate för v1 och distribueras till statisk HTTPS-hosting.

---

### DEV-011 – Release-styrd GitHub Pages-publicering

**Mål:** Publicera den färdiga PWA:n automatiskt när en GitHub Release publiceras.

**Omfattning:**

- GitHub Actions-workflow för `release.published` och manuell reservstart.
- Pages-behörigheter, artefaktuppladdning och deployment environment.
- Produktionsbygge med repository-korrekt basväg `/pwa-calculator/`.
- Publik Pages-länk och publiceringsinstruktioner i README och driftdokumentation.

**Verifiering:**

- vanlig verifieringssvit passerar,
- separat Pages-build genereras med korrekt basväg,
- workflow-YAML valideras,
- GitHub Actions på slutlig commit passerar.

**Klart när:** En publicerad GitHub Release startar ett reproducerbart Pages-deployment och den förväntade adressen är dokumenterad.

## 5. Beroenden mellan steg

```text
DEV-001
  -> DEV-002
      -> DEV-003
          -> DEV-004
              -> DEV-005
                  -> DEV-006
                      -> DEV-007
                          -> DEV-008
                              -> DEV-009
                                  -> DEV-010
                                      -> DEV-011
```

Ordningen är avsiktlig: matematik och state byggs och verifieras innan UI:t blir komplext, medan PWA-lagret läggs på först när den vanliga webbapplikationen är stabil.

## 6. Definition of Done per DEV-steg

Ett steg får markeras `completed` först när:

- stegets accepterade scope är implementerat,
- relevanta tester finns och passerar,
- befintliga tester fortfarande passerar,
- lint/typecheck/build passerar när de finns tillgängliga,
- dokumentation/state är uppdaterad,
- inga nya blockerare lämnas odokumenterade,
- en komplett uppdaterad projekt-zip kan levereras.

## 7. Exekveringsstatus

Aktuell och maskinläsbar exekveringsstatus finns i `.system-builder/work-status.yaml`. Planen behålls som definition av stegens scope, beroenden, verifiering och klart-kriterier.
