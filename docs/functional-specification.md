# Funktionell specifikation – Calculator PWA

## 1. Syfte och mål

Calculator PWA ska vara en lättanvänd, responsiv och installerbar miniräknare för mobiltelefon, surfplatta och dator. Grundläggande räkning ska vara omedelbart tillgänglig utan separat calculator mode, samtidigt som vetenskapliga funktioner och grafstöd kan användas när behovet uppstår.

Produkten använder ett enda adaptivt gränssnitt. Skärmyta, orientering och aktuellt uttryck styr hur sekundär funktionalitet presenteras.

### Framgångskriterier

- Grundläggande beräkningar kan utföras utan instruktioner.
- Vetenskapliga funktioner är tillgängliga utan att belasta huvudflödet på små porträttskärmar.
- På 375×812 ryms expanderade Funktioner tillsammans med hela sifferknappsatsen utan sidscroll.
- I landskap ligger sekundärytan till vänster och kalkylatorn stabilt till höger.
- På iPad-klassade landskapsvyer runt 1024×768 ska kalkylator/workspace utnyttja merparten av viewportens höjd utan sidscroll.
- Ett uttryck med variabeln `x` kan visas som graf i landskapsarbetsytan.
- Sifferknappsatsen ligger stabilt kvar när grafen aktiveras eller Funktioner ersätter grafen.
- Ljust/mörkt tema följer systemets färgschema utan användarspecifik temainställning.
- Appen fungerar lokalt utan backend och offline efter första fullständiga laddningen.

## 2. Scope och prioritering

### Must

- Ett enhetligt responsivt kalkylatorgränssnitt utan synlig apptitel/header.
- Grundläggande aritmetik och vetenskapliga funktioner.
- Lokal historik, minne och DEG/RAD.
- Systemstyrt ljust/mörkt tema via `prefers-color-scheme`.
- Responsiv presentation av Funktioner och Historik.
- Safe-area-hantering på telefon i landskap.
- Sekundär graph/scientific-yta till vänster och stabil kalkylator till höger i landskap.
- Kompakt småskärmsporträtt där 375×812 kan visa hela expanderade funktionspanelen plus sifferknappsatsen utan page scroll.
- Variabeln `x` i matematiska uttryck.
- Grafritning av en realvärd funktion av `x` i landskapsläge.
- Automatisk grafpresentation när aktuellt uttryck använder `x`.
- Installerbar PWA och offlinefunktion.

### Should

- Panorering och zoomning av grafen.
- Återställning till en definierad standardviewport.
- Historikposter kan återanvändas.
- Små porträttskärmar håller vetenskapliga funktioner hopfällda tills de behövs.
- Porträtt visar diskret att ett `x`-uttryck kan visas som graf i landskap.

### Could – senare

- Flera samtidiga funktioner/grafserier.
- Funktionsfärger och anpassningsbart tangentbord.
- Funktionsvärdestabell.
- Nollställen, skärningspunkter, extrempunkter och derivataanalys.
- Kopiering/delning av grafer.
- Utökade vetenskapliga funktioner.

## 3. Aktör

### A-001 – Användare

Enda primära aktören. Ingen inloggning, rollmodell eller backend finns.

## 4. Centrala användningsfall

### UC-001 – Utföra grundläggande beräkning

1. Användaren öppnar appen.
2. Användaren matar in tal och grundoperatorer.
3. Appen visar uttrycket och resultatet tydligt.
4. `=` slutför beräkningen.
5. Resultatet kan användas i fortsatt räkning.

### UC-002 – Utföra vetenskaplig beräkning

1. På små porträttskärmar öppnar användaren `Funktioner`; på större ytor kan funktionerna redan vara synliga.
2. Användaren väljer parenteser, trigonometriska/logaritmiska funktioner, potens, rot, konstanter eller andra vetenskapliga funktioner.
3. Grundknappsatsen förblir tillgänglig.
4. På 375×812 ska hela funktionspanelen och hela sifferknappsatsen kunna visas utan vertikal page scroll.
5. Resultatet visas och lagras i historiken.

### UC-003 – Använda historik

1. Användaren öppnar `Historik` på begäran.
2. Tidigare uttryck och resultat visas i omvänd kronologisk ordning.
3. En historikpost kan återanvändas.
4. Historiken kan rensas.

### UC-004 – Använda minne

Användaren kan använda `MC`, `MR`, `M+` och `M−` med traditionellt miniräknarbeteende.

### UC-005 – Använda appen offline

Efter första lyckade laddningen ska kärnfunktionerna fungera utan nätverksanslutning.

### UC-006 – Rita en funktion

1. Användaren väljer `x` via funktionsytan och bygger exempelvis `x^2 - 4` eller `sin(x)`.
2. I porträtt förblir den vanliga kalkylatorn primär och uttrycket bevaras.
3. I landskap identifierar appen uttrycket som grafbart och visar grafen automatiskt i den sekundära vänsterytan.
4. Kalkylatorn och sifferknappsatsen ligger kvar i högerkolumnen.
5. Användaren kan fortsätta redigera uttrycket medan grafen uppdateras.
6. `Funktioner` kan ersätta grafen i den sekundära ytan utan att flytta sifferknappsatsen.

## 5. Funktionella krav

### Grundläggande beräkning och adaptivt UI

**FR-001 – Enhetligt kalkylatorgränssnitt [Must]**  
Systemet ska erbjuda ett enda kalkylatorgränssnitt där grundfunktioner alltid är direkt tillgängliga.

**FR-002 – Responsiv funktionspresentation [Must]**  
Vetenskapliga funktioner ska kunna visas responsivt eller på begäran utifrån tillgänglig skärmyta och aktiv sekundär funktion.

**FR-003 – Funktionspanel i smalt porträtt [Must]**  
På smala porträttskärmar ska användaren kunna öppna och stänga funktionspanelen. Val av en vetenskaplig inmatningsfunktion får automatiskt fälla ihop panelen; DEG/RAD och minnesoperationer behöver inte göra det.

**FR-004 – Grundoperatorer [Must]**  
Addition, subtraktion, multiplikation och division ska stödjas.

**FR-005 – Decimaler [Must]**  
Decimaltal ska stödjas och ett enskilt tal får inte innehålla mer än ett decimaltecken.

**FR-006 – Teckenbyte [Must]**  
Aktuellt numeriskt uttryck ska kunna växlas mellan positivt och negativt.

**FR-007 – Radera [Must]**  
Senast inmatade redigerbara del ska kunna tas bort utan full nollställning.

**FR-008 – Nollställ [Must]**  
Aktuell beräkning ska kunna återställas till initialt tillstånd.

**FR-009 – Resultat och fortsatt räkning [Must]**  
Efter `=` ska resultatet visas tydligt och kunna användas som utgångspunkt för nästa beräkning.

**FR-010 – Operatorprioritet [Must]**  
Uttryck ska följa normal matematisk operatorprioritet och definierad associativitet.

### Vetenskapliga funktioner

**FR-011 – Parenteser [Must]**  
Parenteser ska stödjas.

**FR-012 – Procent [Must]**  
`x%` ska motsvara `x / 100` och procent ska kunna ingå i sammansatta uttryck.

**FR-013 – Potenser [Must]**  
Kvadrering och generell potens ska stödjas.

**FR-014 – Kvadratrot [Must]**  
Kvadratrot ska stödjas för giltiga reella värden.

**FR-015 – Trigonometri [Must]**  
`sin`, `cos` och `tan` ska stödjas.

**FR-016 – Vinkelmått [Must]**  
Användaren ska kunna välja DEG eller RAD; valet ska sparas lokalt.

**FR-017 – Logaritmer [Must]**  
`log` och `ln` ska stödjas för giltiga värden.

**FR-018 – Konstanter [Must]**  
`π` och `e` ska finnas tillgängliga.

**FR-019 – Invers [Must]**  
`1/x`-operation ska stödjas för värden skilda från noll.

### Historik och minne

**FR-020 – Historik [Must]**  
Slutförda numeriska beräkningar ska kunna visas med uttryck och resultat. Historiken ska öppnas på begäran och inte kräva permanent layoututrymme.

**FR-021 – Historikpersistens [Must]**  
Historiken ska sparas lokalt mellan användningstillfällen.

**FR-022 – Återanvänd historik [Should]**  
En tidigare historikpost ska kunna återanvändas som utgångspunkt för ny beräkning.

**FR-023 – Rensa historik [Should]**  
Historiken ska kunna rensas.

**FR-024 – Minnesfunktioner [Must]**  
`MC`, `MR`, `M+` och `M−` ska stödjas.

**FR-025 – Minnespersistens [Must]**  
Minnesvärdet ska sparas lokalt tills användaren rensar det.

### Inmatning och presentation

**FR-026 – Pek-/musinmatning [Must]**  
Centrala funktioner ska kunna användas med pekskärm och mus.

**FR-027 – Tangentbordsinmatning [Must]**  
Siffror, operatorer, decimaltecken, parenteser och centrala redigeringskommandon ska kunna användas från fysiskt tangentbord.

**FR-028 – Decimaltecken från tangentbord [Must]**  
Både punkt och komma ska accepteras som decimaltecken och normaliseras konsekvent.

**FR-029 – Systemtema [Must]**  
Ljust och mörkt tema ska stödjas och följa browserns/operativsystemets `prefers-color-scheme`. Ingen användarstyrd temaväljare eller temapersistens ska krävas.

**FR-030 – Safe area i landskap [Must]**  
Landskapslayouten ska respektera plattformens safe-area-insets.

**FR-031 – Headerfri kalkylatoryta [Must]**  
Kalkylatorgränssnittet ska inte reservera permanent skärmyta för apptitel eller temaväljare.

**FR-032 – Kompakt 375×812-porträtt [Must]**  
Vid 375×812 CSS-pixlar ska hela expanderade funktionspanelen och hela grundknappsatsen kunna visas utan vertikal sidscrollning.

**FR-033 – Tablet-landscape höjdanvändning [Must]**  
På iPad-klassade landskapsvyer inom tablet-scope ska kalkylator/workspace sträckas vertikalt så att minst cirka 90 % av viewportens höjd används på 1024×768, utan att numeric/scientific alignment eller graph/functions-stabilitet bryts.

### PWA och offline

**FR-034 – Installerbar PWA [Must]**  
Appen ska kunna installeras som PWA där plattformen stödjer det.

**FR-035 – Offline [Must]**  
Kärnfunktionerna ska fungera offline efter första fullständiga laddningen.

**FR-036 – Lokal data utan konto [Must]**  
Historik, minne och vinkelenhet ska hanteras lokalt utan konto eller serverkontakt.

### Grafstöd

**FR-037 – Variabeln x [Must]**  
Expression engine ska kunna utvärdera identifieraren `x` när ett explicit realvärde för `x` tillhandahålls. Vanliga uttryck utan `x` ska behålla befintlig semantik.

**FR-038 – Grafbart uttryck [Must]**  
Ett aktuellt uttryck som refererar till `x` ska betraktas som grafbart. `x` ska finnas tillgänglig från funktionsytan, inte behöva ligga permanent på grundknappsatsen.

**FR-039 – Graf i landskap [Must]**  
Grafytan ska renderas i landskapets sekundäryta till vänster. Telefonporträtt ska inte behöva avsätta permanent grafyta.

**FR-040 – Automatisk grafpresentation [Must]**  
När ett grafbart uttryck är aktivt i landskap ska grafytan visas automatiskt utan separat graflägesväljare.

**FR-041 – Stabil kalkylatorkolumn [Must]**  
Kalkylatorns display, actions och sifferknappsats ska ligga stabilt i högerkolumnen oavsett om vänsterytan visar vetenskapliga funktioner eller graf.

**FR-042 – Sekundär landskapsyta [Must]**  
I landskap utan aktiv graf ska vänsterytan visa vetenskapliga funktioner. När grafen är aktiv ska grafen vara standardinnehåll där och `Funktioner` kunna ersätta grafen utan att flytta grundknappsatsen.

**FR-043 – Bottenlinje för scientific [Must]**  
När vetenskapliga funktioner visas i landskap ska scientific-knappsatsens nederkant vara visuellt bottenjusterad mot sifferknappsatsen.

**FR-044 – Grafprovtagning [Must]**  
Grafmotorn ska kunna prova uttrycket över ett synligt x-intervall och hantera enskilda domänfel utan att hela grafen fallerar.

**FR-045 – Diskontinuiteter [Must]**  
Grafen får inte medvetet förbinda kurvsegment över kända/identifierade domänfel eller uppenbara diskontinuiteter såsom asymptoter.

**FR-046 – Grafviewport [Should]**  
Användaren bör kunna panorera och zooma grafens viewport samt återställa den till ett definierat standardläge.

**FR-047 – En funktion åt gången [Must]**  
Initial grafversion ska visa högst ett aktuellt uttryck som funktion av `x`.

## 6. Affärs- och beräkningsregler

**BR-001 – Grundflödet ska vara avskalat**  
Vetenskapliga funktioner, historik och grafstöd får inte göra vanlig porträttanvändning onödigt komplex.

**BR-002 – Reell taldomän**  
Systemet arbetar med reella tal. Komplexa resultat ligger utanför scope.

**BR-003 – Division med noll**  
Division med noll ska ge ett kontrollerat feltillstånd, inte ett normalt numeriskt resultat.

**BR-004 – Ogiltig funktionsdomän**  
Ogiltiga reella domäner, exempelvis `sqrt(-1)` eller `log(0)`, ska ge kontrollerat fel vid direkt beräkning och bryta grafsegment vid provtagning.

**BR-005 – Fel får inte låsa appen**  
Efter fel ska användaren kunna korrigera eller börja om utan omladdning.

**BR-006 – Lokal integritet**  
Uttryck, historik och minne ska som standard stanna på enheten.

**BR-007 – Uttrycket styr grafpresentationen**  
Grafpresentation ska härledas från att uttrycket använder `x`, inte från en separat användarvald calculator mode.

**BR-008 – Stabil inmatningsyta**  
Aktivering av grafen eller växling till Funktioner får inte flytta den centrala sifferknappsatsen i landskap.

**BR-009 – Systemtema är presentation, inte app-state**  
Färgschema ska härledas från systeminställningen. Legacy-lagring med `theme` får läsas defensivt men fältet ska ignoreras.

## 7. Informationsbehov

Systemet hanterar endast lokal information:

- aktuellt uttryck,
- aktuellt numeriskt resultat/feltillstånd,
- DEG/RAD,
- minnesvärde,
- historikposter,
- grafens temporära viewport och provtagningsresultat.

Grafens viewport behöver inte persisteras mellan sessioner. Legacy-lagring kan innehålla äldre `theme`- och `mode`-fält; de accepteras och ignoreras utan att förlora övriga giltiga data.

## 8. Integrationer

Inga externa verksamhetsintegrationer eller backendberoenden finns. PWA, localStorage, Canvas, media queries och browser-input är plattformsfunktioner.

## 9. Behörighet och autentisering

Ingen autentisering eller behörighetsmodell ingår.

## 10. Fel- och undantagsfall

Systemet ska hantera utan krasch:

- division med noll,
- ogiltiga/ofullständiga uttryck,
- obalanserade parenteser,
- ogiltig matematisk domän,
- saknat värde för `x` vid direkt utvärdering,
- enskilda ogiltiga grafprover,
- diskontinuiteter/asymptoter,
- blockerad/korrupt localStorage,
- legacy-lagring med tidigare `theme`/`mode`,
- tangentbordsinmatning som inte stöds.

## 11. Icke-funktionella krav

**NFR-001 – Responsivitet [Must]**  
Kärnfunktionerna ska vara användbara utan horisontell sidscrollning i representativa mobil-, surfplatte- och desktopvyer. 375×812 ska dessutom klara fullt expanderade Funktioner utan vertikal page scroll.

**NFR-002 – Pekytor [Must]**  
Centrala kontroller ska ha tillräckligt stora och separerade tryckytor även i kompakt porträtt.

**NFR-003 – Läsbarhet [Must]**  
Uttryck, resultat, aktiva inställningar, grafaxlar och fel ska vara begripliga i systemets ljusa och mörka färgschema.

**NFR-004 – Tillgänglig grundstruktur [Must]**  
Interaktiva kontroller ska ha begriplig semantik och kunna användas via tangentbord där plattformen medger det. Grafytan ska ha ett textalternativ/namn som identifierar uttrycket.

**NFR-005 – Snabb interaktion [Must]**  
Normal kalkylatorinteraktion ska upplevas omedelbar och får inte bero på nätverk.

**NFR-006 – Offlineoberoende [Must]**  
Grafberäkning och rendering ska vara lokal och fungera offline tillsammans med övriga kärnfunktioner.

**NFR-007 – Lokal-first och dataminimering [Must]**  
Ingen persondata eller beräkningsdata behöver skickas externt.

**NFR-008 – Plattformstolerans [Must]**  
Appen ska fungera i aktuella moderna webbläsare; PWA-installation och touchgestdetaljer får degradera proportionerligt efter plattformsstöd.

**NFR-009 – Numerisk konsekvens [Must]**  
Samma uttryck, vinkelmått och `x`-värde ska ge samma resultat inom JavaScript `Number`-begränsningar.

**NFR-010 – Grafprestanda [Must]**  
Grafprovtagning och omritning ska vara begränsad så att interaktiviteten förblir användbar på modern mobil hårdvara och inte blockerar UI:t orimligt länge.

## 12. Acceptance criteria

**AC-001** `12 + 7 =` visar `19` utan att vetenskapliga kontroller behöver vara öppna.

**AC-002** `2 + 3 × 4` ger `14`.

**AC-003** `(2 + 3) × 4` ger `20`.

**AC-004** `50 × 10%` ger `5`.

**AC-005** Med DEG ger `sin(30)` cirka `0,5`.

**AC-006** Med RAD ger `sin(π / 2)` cirka `1`.

**AC-007** `1 ÷ 0` ger begripligt fel och appen kan användas direkt därefter.

**AC-008** Slutförda beräkningar återfinns i lokal historik efter reload om lagringen finns kvar.

**AC-009** `M+`, `MR` och `MC` fungerar enligt definierat minnesbeteende.

**AC-010** Både punkt och komma accepteras som decimalinmatning från tangentbord.

**AC-011** På typisk mobilbredd kan siffror/operatorer användas utan horisontell sidscrollning.

**AC-012** Appen kan efter initial online-laddning utföra `7 × 8 = 56` offline.

**AC-013 – Systemtema** Ljust/mörkt tema följer browserns emulerade/systemets `prefers-color-scheme`; ingen temaväljare visas och `theme` skrivs inte i ny persistens.

**AC-014** På stödjande plattform kan appen installeras som PWA.

**AC-015 – x-utvärdering** Expression engine ger `7` för `x + 2` när `x = 5` och ger ett kontrollerat fel om `x` saknar explicit värde vid direkt utvärdering.

**AC-016 – Automatisk graf** I landskap ska ett uttryck som `x^2 - 4` automatiskt visa grafen utan separat graflägesknapp.

**AC-017 – Stabil knappsats** Sifferknappsatsens position i landskap ska inte ändras när användaren går från vetenskapliga funktioner till graf eller tillbaka.

**AC-018 – Funktioner under graf** När grafen visas ska `Funktioner` kunna öppna vetenskapliga kontroller i vänsterytan utan att flytta kalkylatorn.

**AC-019 – Porträtt** På telefon i porträtt ska ett `x`-uttryck kunna redigeras utan permanent grafyta; en diskret landskapsindikering visas.

**AC-020 – Diskontinuitet** Grafen för exempelvis `1/x` får inte rita en sammanhängande kurva genom den ogiltiga punkten vid `x = 0`.

**AC-021 – Viewportinteraktion [Should]** Grafen kan panorera/zooma och återställas utan att kalkylatorns inmatningskontroller flyttas.

**AC-022 – Reversed landscape** På 844×390 och 1024×768 ligger graph/scientific-yta till vänster och kalkylator/sifferknappsats till höger utan page overflow.

**AC-023 – Scientific-baslinje** I landskap ligger scientific-knappsatsens nederkant inom normal pixelavrundning från sifferknappsatsens nederkant.

**AC-024 – Kompakt porträtt** På 375×812 kan Funktioner öppnas fullt så att hela scientific-panelen och hela sifferknappsatsen är synliga utan vertikal page scroll.

## 13. Out of scope

- pedagogiska visualiseringar/spel,
- flera samtidiga grafserier,
- symbolisk algebra/ekvationslösning,
- komplexa tal,
- matriser/vektorer,
- programmerarläge,
- enhets-/valutakonvertering,
- grafanalys såsom skärningspunkter/extrema/derivator,
- 3D-grafer,
- molnsynkronisering,
- användarkonton,
- backend/serverlagring,
- användarvalda/custom themes,
- annonser/betalning/abonnemang.

## 14. Öppna frågor

Inga blockerande produktfrågor återstår för compact-responsive-serien. Verklig safe-area- och touchkänsla på iPhone/iPad kvarstår som rekommenderad manuell device-acceptans, inte som ett känt kodblockerande fel.
