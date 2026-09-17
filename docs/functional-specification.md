# Funktionell specifikation – Calculator PWA v1

## 1. Syfte och mål

Calculator PWA ska vara en lättanvänd miniräknare som fungerar väl både på mobiltelefon, surfplatta och dator. Den ska kunna användas av en nybörjare utan att samtidigt begränsa en van användare som behöver vetenskapliga funktioner.

Produkten ska därför använda ett enda adaptivt gränssnitt i stället för separata användarlägen. Grundläggande räknarfunktioner ska alltid vara direkt tillgängliga, medan vetenskapliga funktioner, minne och historik ska visas eller fällas fram efter tillgängligt skärmutrymme och användarens behov.

Målet för v1 är att användaren ska kunna öppna eller installera appen och utföra beräkningar snabbt, begripligt och utan konto eller nätverksberoende efter första laddningen.

### Framgångskriterier för v1

- En användare kan utföra grundläggande beräkningar utan instruktioner.
- Vetenskapliga funktioner är tillgängliga utan att belasta huvudflödet på små porträttskärmar.
- Appen är praktiskt användbar på smal mobilskärm, i landskap och på större surfplatte-/datorskärmar.
- Appen kan installeras som PWA och användas offline efter att nödvändiga resurser har laddats.
- Vanliga avancerade matematiska funktioner kan utföras utan separat verktyg.

## 2. Scope och prioritering

### Must – v1

- Ett enhetligt responsivt kalkylatorgränssnitt.
- Grundläggande aritmetik: addition, subtraktion, multiplikation och division.
- Decimalinmatning, teckenbyte, radering och nollställning.
- Tydlig visning av aktuell beräkning och resultat.
- Standardmässig matematisk operatorprioritet.
- Vetenskapliga funktioner: parenteser, procent, kvadrat, generell potens, kvadratrot, `sin`, `cos`, `tan`, `log`, `ln`, `π`, `e` och `1/x`.
- Stöd för både grader och radianer för trigonometriska funktioner.
- Lokal beräkningshistorik på begäran.
- Minnesfunktionerna `MC`, `MR`, `M+` och `M−`.
- Fullt relevant tangentbordsstöd på dator.
- Responsivt gränssnitt för mobil, surfplatta och dator.
- Installerbar PWA.
- Offlinefunktion efter första lyckade laddningen av appens resurser.
- Lokal lagring av användarinställningar, historik och minnesvärde.
- Stöd för ljust och mörkt utseende.

### Should – v1

- Appen ska kunna följa enhetens ljusa/mörka tema som standard.
- Historikposter ska kunna återanvändas i en ny beräkning.
- Historiken ska kunna rensas av användaren.
- Resultat som inte ryms naturligt i vanlig decimalnotation ska presenteras begripligt, exempelvis med vetenskaplig notation.
- Vanliga tangentbordsgenvägar som `Enter`, `Backspace`, `Escape`, parenteser och operatorer ska motsvara synliga eller tillgängliga funktioner.
- Små porträttskärmar ska kunna hålla vetenskapliga funktioner hopfällda tills de behövs.

### Could – senare version

- Favoritfunktioner eller anpassningsbart vetenskapligt tangentbord.
- Kopiering/delning av beräkningar på fler sätt än normal systemkopiering.
- Alternativa färgteman.
- Utökade vetenskapliga funktioner.
- Tillgänglighetsinställningar utöver plattformens och webbläsarens standardstöd.

## 3. Aktörer

### A-001 – Användare

Enda primära aktören. Ingen inloggning eller rollmodell finns i v1.

Användaren kan vara allt från nybörjare till van användare av vetenskaplig miniräknare. Gränssnittet ska inte kräva att användaren väljer en erfarenhetsnivå.

## 4. Centrala användningsfall

### UC-001 – Utföra grundläggande beräkning

**Primär aktör:** Användare  
**Mål:** Få fram resultatet av en grundläggande beräkning med så lite visuell komplexitet som möjligt.

Huvudflöde:

1. Användaren öppnar appen.
2. Användaren matar in tal och grundläggande operatorer.
3. Appen visar den aktuella beräkningen tydligt.
4. Användaren väljer `=`.
5. Appen visar resultatet tydligt och gör det möjligt att fortsätta räkna från resultatet.

### UC-002 – Utföra vetenskaplig beräkning

**Primär aktör:** Användare  
**Mål:** Genomföra en beräkning som använder vetenskapliga funktioner eller parenteser.

Huvudflöde:

1. På små porträttskärmar öppnar användaren funktionspanelen; på större eller liggande skärmar kan funktionerna redan vara synliga.
2. Appen behåller grundfunktionerna tillgängliga samtidigt som de vetenskapliga funktionerna används.
3. Användaren bygger ett matematiskt uttryck med tal, operatorer, parenteser och/eller vetenskapliga funktioner.
4. Appen utvärderar uttrycket enligt definierade matematiska regler.
5. Resultatet visas och sparas i historiken när beräkningen slutförts.
6. På små porträttskärmar kan funktionspanelen automatiskt fällas ihop efter vald vetenskaplig funktion så att sifferknappsatsen åter blir primär.

### UC-003 – Använda historik

**Primär aktör:** Användare  
**Mål:** Se eller återanvända tidigare slutförda beräkningar.

Huvudflöde:

1. Användaren öppnar historiken på begäran.
2. Appen visar tidigare uttryck och resultat i omvänd kronologisk ordning.
3. Användaren kan välja en historikpost för att återanvända den i fortsatt beräkning.
4. Användaren kan rensa historiken.

### UC-004 – Använda minne

**Primär aktör:** Användare  
**Mål:** Tillfälligt lagra och återanvända ett numeriskt värde.

Användaren kan lagra, hämta, addera till, subtrahera från och rensa minnesvärdet med `MR`, `M+`, `M−` och `MC` enligt traditionellt miniräknarbeteende.

### UC-005 – Använda appen offline

**Primär aktör:** Användare  
**Mål:** Utföra beräkningar utan nätverksanslutning.

Efter att appens resurser laddats framgångsrikt minst en gång ska kärnfunktionerna för beräkning, historik, minne och inställningar kunna användas utan nätverksanslutning.

## 5. Funktionella krav

### Grundläggande beräkning och adaptivt UI

**FR-001 – Enhetligt kalkylatorgränssnitt [Must]**  
Systemet ska erbjuda ett enda kalkylatorgränssnitt där grundläggande funktioner alltid är direkt tillgängliga och vetenskapliga funktioner kan visas responsivt eller på begäran.

**FR-002 – Responsiv funktionspresentation [Must]**  
På små porträttskärmar ska vetenskapliga funktioner kunna hållas hopfällda. I landskap och på större skärmar ska de kunna visas permanent tillsammans med den vanliga knappsatsen när utrymmet medger det.

**FR-003 – Funktionspanel i smalt porträtt [Must]**  
Användaren ska på smala porträttskärmar kunna öppna och stänga den vetenskapliga funktionspanelen. Val av en vetenskaplig inmatningsfunktion får fälla ihop panelen igen så att sifferknappsatsen blir omedelbart tillgänglig; inställningar som DEG/RAD och minnesoperationer behöver inte göra det.

**FR-004 – Grundoperatorer [Must]**  
Systemet ska stödja addition, subtraktion, multiplikation och division.

**FR-005 – Decimaler [Must]**  
Systemet ska stödja decimaltal och förhindra att ett enskilt tal får mer än ett decimaltecken.

**FR-006 – Teckenbyte [Must]**  
Användaren ska kunna växla tecken på ett aktuellt numeriskt värde mellan positivt och negativt.

**FR-007 – Radera [Must]**  
Användaren ska kunna ta bort senast inmatade redigerbara del av uttrycket utan att behöva nollställa hela beräkningen.

**FR-008 – Nollställ [Must]**  
Användaren ska kunna återställa aktuell beräkning till ett tomt eller initialt tillstånd.

**FR-009 – Resultat och fortsatt räkning [Must]**  
Efter `=` ska systemet visa resultatet tydligt. Resultatet ska kunna användas som utgångspunkt för en efterföljande beräkning.

**FR-010 – Operatorprioritet [Must]**  
Uttryck ska utvärderas enligt normal matematisk operatorprioritet, där parenteser och funktionsanrop utvärderas före multiplikation/division och dessa före addition/subtraktion.

### Vetenskapliga funktioner

**FR-011 – Parenteser [Must]**  
Systemet ska stödja parenteser för att uttryckligen styra beräkningsordningen.

**FR-012 – Procent [Must]**  
Systemet ska stödja procent på ett konsekvent och förutsägbart sätt. Minst följande beteenden ska stödjas: ett fristående `x%` motsvarar `x / 100`, och procent ska kunna användas som operand i sammansatta uttryck, exempelvis så att `50 × 10%` ger `5`.

**FR-013 – Potenser [Must]**  
Systemet ska stödja både kvadrering (`x²`) och generell potens (`xʸ`).

**FR-014 – Kvadratrot [Must]**  
Systemet ska stödja kvadratrot för giltiga reella värden.

**FR-015 – Trigonometri [Must]**  
Systemet ska stödja `sin`, `cos` och `tan`.

**FR-016 – Vinkelmått [Must]**  
Användaren ska kunna välja mellan grader (`DEG`) och radianer (`RAD`). Valet ska vara tydligt och sparas lokalt.

**FR-017 – Logaritmer [Must]**  
Systemet ska stödja tiologaritm (`log`) och naturlig logaritm (`ln`) för giltiga värden.

**FR-018 – Konstanter [Must]**  
Systemet ska erbjuda konstanterna `π` och `e`.

**FR-019 – Invers [Must]**  
Systemet ska erbjuda `1/x` för giltiga värden skilda från noll.

### Historik och minne

**FR-020 – Historik [Must]**  
Slutförda beräkningar ska kunna visas som historik med både uttryck och resultat. Historiken ska öppnas på begäran och ska inte behöva ta permanent layoututrymme.

**FR-021 – Historikpersistens [Must]**  
Historiken ska sparas lokalt så att den kan finnas kvar efter att appen stängts och öppnats igen.

**FR-022 – Återanvänd historik [Should]**  
Användaren ska kunna återanvända en tidigare beräkning eller dess resultat som utgångspunkt för en ny beräkning.

**FR-023 – Rensa historik [Should]**  
Användaren ska kunna rensa all lokalt sparad historik.

**FR-024 – Minnesfunktioner [Must]**  
Systemet ska stödja `MC`, `MR`, `M+` och `M−` med traditionellt miniräknarbeteende.

**FR-025 – Minnespersistens [Must]**  
Aktuellt minnesvärde ska sparas lokalt mellan användningstillfällen tills användaren rensar det.

### Inmatning och presentation

**FR-026 – Pek-/musinmatning [Must]**  
Alla centrala funktioner ska kunna användas med pekskärm och mus.

**FR-027 – Tangentbordsinmatning [Must]**  
På enheter med fysiskt tangentbord ska användaren kunna mata in siffror, grundoperatorer, decimaltecken, parenteser och aktivera resultat/radering med naturliga tangenter.

**FR-028 – Decimaltecken från tangentbord [Must]**  
Både punkt och komma ska accepteras som decimalinmatning från tangentbordet. Appen ska normalisera inmatningen och visa decimaler konsekvent.

**FR-029 – Tema [Must]**  
Systemet ska erbjuda ett ljust och ett mörkt utseende. Användarens explicita val ska sparas lokalt.

**FR-030 – Safe area i landskap [Must]**  
På enheter med skärmutskärning eller rundade hörn ska landskapslayouten respektera plattformens safe-area-insets så att centrala kontroller inte placeras under kamera/notch eller utanför säker pekyta.

### PWA och offline

**FR-031 – Installerbar PWA [Must]**  
Appen ska uppfylla relevanta krav för att kunna installeras som en PWA i moderna webbläsare som stödjer installation.

**FR-032 – Offline [Must]**  
Efter en första lyckad laddning av nödvändiga resurser ska appens beräkningsfunktioner fungera utan nätverksanslutning.

**FR-033 – Lokal data utan konto [Must]**  
Historik, minne och användarinställningar ska hanteras lokalt på användarens enhet och får inte kräva användarkonto eller serverkontakt.

## 6. Affärs- och beräkningsregler

**BR-001 – Grundflödet ska vara avskalat**  
Vetenskapliga funktioner, historik och minneskontroller ska inte belasta huvudgränssnittet på små porträttskärmar när de inte används. Anpassningen ska ske responsivt och utan att användaren behöver välja ett särskilt läge.

**BR-002 – Reell taldomän i v1**  
V1 arbetar med reella tal. Operationer som kräver komplexa tal ligger utanför scope.

**BR-003 – Division med noll**  
Division med noll ska inte ge ett normalt numeriskt resultat utan ett begripligt feltillstånd som användaren kan återhämta sig från.

**BR-004 – Ogiltig funktionsdomän**  
Exempelvis `√` av negativt tal och `log`/`ln` av icke-positivt tal ska ge ett begripligt feltillstånd i v1.

**BR-005 – Fel får inte låsa appen**  
Efter ett matematiskt fel ska användaren kunna korrigera eller starta en ny beräkning utan att behöva ladda om appen.

**BR-006 – Lokal integritet**  
Beräkningshistorik och minnesvärde ska som standard stanna på enheten och inte skickas till någon extern tjänst.

## 7. Informationsbehov

Systemet behöver endast hantera lokal information:

- aktuell beräkning/uttryck,
- aktuellt resultat eller feltillstånd,
- valt vinkelmått (DEG/RAD),
- valt tema,
- minnesvärde,
- historikposter bestående av uttryck och resultat.

Äldre lagringsdata kan innehålla det tidigare fältet `mode`; sådana data ska kunna läsas defensivt och fältet ignoreras.

Ingen användarprofil eller personinformation behövs för v1.

## 8. Integrationer

V1 har inga externa verksamhetsintegrationer eller backendberoenden.

PWA-funktionaliteten använder webbläsarens/plattformens standardfunktioner för installation, lokal lagring och offlineanvändning. Dessa är plattformsförmågor snarare än externa verksamhetssystem.

## 9. Behörighet och autentisering

Ingen autentisering eller behörighetsmodell ingår i v1. All funktionalitet är tillgänglig lokalt för den person som använder appen på enheten.

## 10. Fel- och undantagsfall

Systemet ska hantera minst följande utan krasch eller låst användarflöde:

- division med noll,
- obalanserade eller ogiltiga parenteser,
- ofullständigt uttryck när `=` aktiveras,
- ogiltig matematisk domän,
- tal/resultat utanför rimlig representerbar storlek,
- tangentbordsinmatning som inte motsvarar tillåten funktion,
- saknad eller otillgänglig lokal historiklagring.

Fel ska beskrivas kort och begripligt. Appen ska inte visa interna tekniska felmeddelanden för normala matematiska användarfel.

## 11. Icke-funktionella krav

**NFR-001 – Responsivitet [Must]**  
Appens huvudfunktioner ska vara fullt användbara på typisk mobilskärm i porträtt och landskap samt på större dator-/surfplatteskärm utan horisontell sidscrollning för kärnflödet. Telefonlandskap och verifierade surfplattelandskap ska inte kräva vertikal sidscrollning för själva kalkylatorns huvudflöde.

**NFR-002 – Pekytor [Must]**  
Centrala kontroller ska ha tillräckligt stora och separerade tryckytor för bekväm mobilanvändning.

**NFR-003 – Läsbarhet [Must]**  
Aktuellt uttryck, resultat, inställningar och fel ska vara tydligt läsbara och ha tillräcklig kontrast i både ljust och mörkt tema.

**NFR-004 – Tillgänglig grundstruktur [Must]**  
Interaktiva kontroller ska kunna identifieras av hjälpmedel, ha begriplig namnsättning och kunna användas via tangentbord där plattformen medger det.

**NFR-005 – Snabb interaktion [Must]**  
Normal knapptryckning och enkel beräkning ska upplevas som omedelbar på en modern mobil eller dator och får inte bero på nätverksanrop.

**NFR-006 – Offlineoberoende [Must]**  
Efter initial cache/laddning ska nätverksbortfall inte hindra kärnberäkningar eller åtkomst till redan lokalt lagrade inställningar och historik.

**NFR-007 – Lokal-first och dataminimering [Must]**  
V1 ska inte kräva insamling eller överföring av personuppgifter eller beräkningsinnehåll för att fungera.

**NFR-008 – Plattformstolerans [Must]**  
Appen ska fungera i aktuella moderna webbläsare på mobil och desktop. Funktioner som installation får degradera på ett begripligt sätt om plattformen inte erbjuder PWA-installation på samma sätt.

**NFR-009 – Numerisk konsekvens [Must]**  
Samma giltiga uttryck och inställningar ska ge samma resultat inom de begränsningar som gäller för den valda numeriska representationen.

## 12. Acceptance criteria för v1

**AC-001 – Grundläggande huvudräkning**  
När användaren matar in `12 + 7 =`, ska appen visa `19` utan att användaren först behöver välja ett läge eller öppna vetenskapliga funktioner.

**AC-002 – Operatorprioritet**  
När användaren beräknar `2 + 3 × 4`, ska resultatet vara `14`.

**AC-003 – Parenteser**  
`(2 + 3) × 4` ska ge `20` när parentesfunktionen används.

**AC-004 – Procent**  
`50 × 10%` ska ge `5`, och `10%` som fristående värde motsvara `0,1` i visningsformat med decimal-komma.

**AC-005 – Trigonometri i grader**  
Med `DEG` aktivt ska `sin(30)` ge ett resultat motsvarande `0,5` inom rimlig numerisk precision.

**AC-006 – Trigonometri i radianer**  
Med `RAD` aktivt ska `sin(π / 2)` ge ett resultat motsvarande `1` inom rimlig numerisk precision.

**AC-007 – Matematiskt fel**  
`1 ÷ 0` ska ge ett begripligt feltillstånd och appen ska därefter kunna användas för en ny giltig beräkning utan omladdning.

**AC-008 – Historik**  
Efter minst två slutförda beräkningar ska dessa kunna återfinnas i lokal historik efter att appen stängts och öppnats igen, så länge användaren inte rensat lagringen.

**AC-009 – Minne**  
Ett värde som lagts till minnet med `M+` ska kunna återläsas med `MR`; `MC` ska rensa minnet.

**AC-010 – Responsiv funktionspanel**  
På en smal porträttskärm ska den vetenskapliga funktionspanelen kunna vara stängd medan sifferknappsatsen är tillgänglig. Efter val av en vetenskaplig funktion ska panelen kunna fällas ihop igen utan att den pågående beräkningen förloras.

**AC-011 – Tangentbord**  
På dator ska `12.5+2,5` kunna matas in med tangentbord på ett konsekvent sätt så att båda decimaltecknen accepteras i respektive tal och beräkningen kan slutföras med `Enter`.

**AC-012 – Mobil layout**  
På typisk mobilbredd ska siffror, grundoperatorer och `=` kunna användas utan horisontell sidscrollning. I landskap ska kontroller hållas inom safe area och den verifierade telefonlayouten ska rymmas utan sidscrollning.

**AC-013 – Offline**  
Efter att appen laddats online minst en gång ska användaren, vid efterföljande start utan nätverksanslutning, kunna utföra `7 × 8 = 56` och använda lokalt sparade inställningar.

**AC-014 – Tema**  
Användaren ska kunna välja ljust eller mörkt tema och valet ska kvarstå vid nästa öppning på samma enhet.

**AC-015 – PWA-installation**  
På en plattform som stödjer PWA-installation ska appen kunna installeras och startas som fristående appyta enligt plattformens normala PWA-beteende.

## 13. Out of scope för v1

Följande ingår inte i första versionen:

- pedagogiska visualiseringar, spel eller undervisningsläge,
- grafräknare och funktionsplottning,
- symbolisk algebra eller ekvationslösning,
- komplexa tal,
- matriser och vektorer,
- programmerarläge för binär/hexadecimal aritmetik,
- enhets- eller valutakonvertering,
- molnsynkronisering,
- användarkonton,
- delad historik mellan enheter,
- backend eller serverlagring,
- annonser, betalning eller abonnemang.

## 14. Öppna frågor

Det finns inga blockerande funktionella frågor för v1.

Följande detaljer kan utvecklas vidare utan att ändra v1:s funktionella mål:

- exakt visuell placering av vetenskapliga tangenter på framtida skärmstorlekar,
- vald numerisk/evalueringsstrategi om scope senare utökas,
- framtida ytterligare vetenskapliga funktioner,
- eventuella nya tillgänglighetsanpassningar.
