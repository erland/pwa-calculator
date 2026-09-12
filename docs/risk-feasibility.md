# Risk- och genomförbarhetsbedömning – Calculator PWA v1

## 1. Sammanfattning

Projektet bedöms vara **tekniskt genomförbart med låg total risk**. V1 saknar backend, externa integrationer, autentisering och serverlagring, vilket reducerar integrations-, drift- och säkerhetsriskerna väsentligt.

De viktigaste riskerna ligger i stället i:

- korrekt och förutsägbar utvärdering av matematiska uttryck,
- numerisk precision och presentation av flyttal,
- PWA/offline-beteende mellan olika moderna webbläsare,
- lokal persistens när webbläsarlagring är otillgänglig eller rensas,
- att kombinera barnvänlig enkelhet med avancerade funktioner utan att skapa ett överlastat gränssnitt.

Ingen identifierad risk blockerar arkitekturfasen. Ingen separat PoC/spike krävs före arkitektur, men beräkningsmotorn och offlineflödet bör verifieras tidigt i implementationen.

## 2. Feasibility-bedömning

### 2.1 Beräkningsmotor

**Fråga:** Kan v1 stödja operatorprioritet, parenteser, procent, potenser, trigonometriska funktioner, logaritmer och konstanter helt lokalt i webbläsaren?

**Bedömning:** Ja. Funktionaliteten kan implementeras helt klientbaserat. Lösningen bör använda en explicit parser/evaluator eller ett väl avgränsat matematikbibliotek och ska **inte** utvärdera användarens uttryck med generell JavaScript-körning såsom `eval` eller `Function`.

**Konsekvens för arkitektur:** Beräkningslogiken ska isoleras från UI:t och kunna enhetstestas oberoende av rendering.

### 2.2 Numerisk representation

**Fråga:** Är vanlig JavaScript-numerik tillräcklig för en generell vardags-/vetenskaplig miniräknare i v1?

**Bedömning:** Ja, med tydliga begränsningar. IEEE-754 `Number` är tillräckligt för v1:s målgrupp men ger välkända flyttalsfenomen, exempelvis att `0.1 + 0.2` inte representeras exakt binärt.

**Hantering:**

- skilj intern numerisk representation från visningsformat,
- använd konsekvent avrundning/formatering för presentation,
- undvik att lova godtycklig precision,
- testa kända gränsfall,
- dokumentera att v1 är en generell miniräknare och inte ett verktyg för godtycklig precision eller finansiell decimalaritmetik.

En arbitrary-precision-lösning bedöms inte vara motiverad för v1.

### 2.3 PWA och offline

**Fråga:** Kan appens Must-funktionalitet fungera offline efter första lyckade laddningen?

**Bedömning:** Ja. Eftersom all kärnlogik och data är lokal kan applikationsskalet och statiska resurser cachelagras via service worker. Ingen kärnfunktion kräver nätverk.

**Hantering:** Offlinefunktionen ska verifieras explicit i utvecklingsplanen. Uppdateringsstrategin bör undvika att en gammal och ny frontend-version blandas i samma körning.

### 2.4 Installation på olika plattformar

PWA-installation exponeras olika på olika webbläsare och operativsystem. Detta påverkar främst installationsflödet, inte kärnfunktionaliteten.

**Bedömning:** Genomförbart med graceful degradation enligt NFR-008. Appen ska vara fullt användbar i webbläsaren även när explicit installationsprompt saknas.

### 2.5 Lokal persistens

Historik, minne och inställningar kan lagras lokalt. För v1 är datamängden liten.

**Bedömning:** Genomförbart. Lokal lagring kan dock rensas av användaren, webbläsaren eller privata lägen och kan i vissa miljöer vara otillgänglig.

**Hantering:** Appen ska fortsätta fungera som miniräknare även om persistens inte kan användas. Persistensfel får alltså degradera historik/minne/inställningar, inte kärnberäkningen.

## 3. Riskregister

| ID | Kategori | Risk / antagande | Sannolikhet | Konsekvens | Nivå | Hantering | Status |
|---|---|---|---|---|---|---|---|
| RISK-001 | Technical | Fel i parser/evaluator ger felaktig operatorprioritet eller fel resultat | medium | high | high | Isolera beräkningsmotor, undvik `eval`, enhetstesta uttryck och AC-fall | mitigated |
| RISK-002 | Technical / Data | Flyttalsrepresentation ger oväntade decimalresultat | high | medium | high | Central resultatformatterare, definierad avrundning och tester för kända flyttalsfall | mitigated |
| RISK-003 | UX | Avancerade funktioner gör appen svår för yngre användare | medium | medium | medium | Strikt separation Enkel/Avancerad; BR-001 behandlas som designregel | mitigated |
| RISK-004 | Operations / PWA | Offlinecache eller uppdatering fungerar inkonsekvent mellan webbläsare | medium | medium | medium | Standardiserad service worker/PWA-plugin, explicit offline- och update-test | mitigated |
| RISK-005 | Platform | PWA-installation ser olika ut eller saknar explicit prompt på vissa plattformar | high | low | medium | Graceful degradation; installation är plattformsberoende men webbappen förblir fullt användbar | accepted |
| RISK-006 | Data | Lokal historik/minne försvinner eller storage är otillgänglig | medium | low | low/medium | Felisolering och fallback till sessionsfunktion utan persistens; ingen kärnfunktion blockeras | mitigated |
| RISK-007 | Accessibility | Tät knappmatris blir svår med tangentbord/skärmläsare eller små pekytor | medium | medium | medium | Semantiska kontroller, fokusordning, labels, tangentbords- och mobiltester | mitigated |
| RISK-008 | Technical | Trigonometri/DEG-RAD/procent får inkonsekventa semantiker | medium | medium | medium | Central domänlogik och explicita tester mot FR-012, FR-015, FR-016 och AC-004–006 | mitigated |
| RISK-009 | Security | Uttrycksutvärdering via generell JavaScript-exekvering skapar kodinjektionsrisk | low om designregeln följs | high | medium | Arkitekturregel: ingen `eval`/`Function`; endast tokeniserad/parserstyrd matematik | mitigated |
| RISK-010 | Dependency | Ett externt matematikbibliotek kan öka bundle-storlek eller medföra licens-/supply-chain-risk | medium | low | low/medium | Välj liten, aktiv och kompatibelt licensierad dependency eller implementera begränsad egen evaluator; lås versioner | mitigated |

## 4. Säkerhet och integritet

Säkerhetsytan är liten eftersom v1 saknar backend, autentisering, filer och externa API:er.

Följande ska ändå gälla:

- ingen dynamisk kodexekvering av användarens matematiska uttryck,
- inga beräkningsuttryck skickas till externa tjänster,
- inga hemligheter eller API-nycklar behövs i frontend,
- tredjepartsberoenden hålls få och versionslåsta,
- data i historik betraktas som lokal användardata och stannar på enheten som standard.

## 5. Prestanda och skala

V1 har mycket liten beräknings- och datavolym. Normal uttrycksutvärdering ska kunna ske synkront och omedelbart på moderna mobiler och datorer.

Ingen särskild skalningsarkitektur krävs. Historiken bör ändå ges en rimlig maxgräns för att undvika obegränsad lokal tillväxt; exakt gräns kan bestämmas i arkitektur/implementation.

## 6. Webbläsar- och plattformsstrategi

Målet är moderna mobil- och desktopwebbläsare. Kärnfunktionaliteten ska bygga på stabila webbstandarder.

Arkitekturen ska skilja mellan:

- **kärnfunktion:** beräkning, UI och lokal användning,
- **progressive enhancement:** installation som PWA och plattformsspecifika installationsytor.

Det innebär att brist på installationsstöd aldrig ska göra miniräknaren oanvändbar.

## 7. Behövs spike eller PoC?

**Beslut: nej, inte före arkitektur.**

Ingen central teknisk fråga är tillräckligt osäker för att motivera ett separat spike-steg nu. Däremot ska utvecklingsplanen lägga tidig verifiering på:

1. parser/evaluator med operatorprioritet och avancerade funktioner,
2. numerisk formattering och definierade gränsfall,
3. PWA-installation/service worker/offline-start,
4. responsiv enkel/avancerad layout på mobil och desktop.

Om ett valt tredjepartsbibliotek senare visar sig inte stödja önskad syntax eller bundle-/licenskrav ska planen revideras innan beroendet cementeras.

## 8. Arkitekturkonsekvenser

Följande constraints bör tas vidare till `docs/architecture.md`:

1. Klientbaserad PWA utan backend eller databas.
2. Separat, testbar beräkningsdomän från UI-komponenterna.
3. Ingen `eval` eller motsvarande generell kodexekvering.
4. Central hantering av parsing, matematiska fel, DEG/RAD och procentsemantik.
5. Central resultatformatterare för numerisk konsekvens och läsbar visning.
6. Lokal persistens bakom ett litet storage-lager med robust fallback.
7. Service worker/app-shell-cache för offline, med kontrollerad uppdateringsstrategi.
8. Responsivt UI där Enkel-läget inte renderar avancerad kontrolltäthet.
9. Få och välmotiverade dependencies.

## 9. Blockerare

**Inga blockerare identifierade.**

Projektet kan gå vidare till arkitektur och teknikval.

## 10. Nästa rekommenderade steg

**CRT-003 – Arkitektur och teknikval**

Steget bör låsa minsta lämpliga frontendarkitektur, ramverk/buildverktyg, strategi för matematikmotor, lokal lagring, PWA/service worker, testnivåer och paketering.
