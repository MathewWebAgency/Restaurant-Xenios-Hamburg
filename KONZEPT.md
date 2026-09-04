# Design-Konzept · Xenios, Hamburg Eimsbüttel

Stand 03.09.2026. Dieses Dokument wird vom Build wörtlich konsumiert. Jede Textzeile
darin geht unverändert auf die Seite. Es gilt, bis eine Änderung freigegeben ist.

---

## 0. Der Betrieb

**Xenios**, Osterstraße 46, 20259 Hamburg Eimsbüttel. Telefon 040 400383,
info@bei-themi.de. Griechisches Restaurant und Mezebar, seit 1981 im selben Haus,
geführt von der Familie Efstathiou. Im Viertel heißt es „bei Themi".

Gelbe Steinwände, griechische Musik, Biergarten unter alten Bäumen, Terrasse mit
Schirmen, ein Clubraum für bis zu 30 Personen. 87 griechische Weine, 20 Sorten Ouzo.
Küche Montag bis Freitag ab 16:30 Uhr, Samstag, Sonntag und feiertags ab 12:00 Uhr,
jeweils bis 22:30 Uhr.

**Was wegfällt:** der Lieferservice und der Rabatt auf Online-Bestellungen von der
alten Seite. Beides kommt an keiner Stelle vor, auch nicht im Alt-Text.

**Bildmaterial:** erzeugt, als Platzhalter, bis echte Fotos des Betriebs vorliegen.
Kennzeichnung im Impressum unter Bildnachweis. Keine erfundenen Gästestimmen, keine
erfundenen Auszeichnungen, keine nachgebauten echten Personen.

---

## 1. Die These in einem Satz

Der Betrieb heißt nach Zeus Xenios, dem Gott, der Gäste beschützt, also verkauft die
Seite keine Stimmung, sondern führt vor, wie jemand empfangen wird: Der Scroll ist die
Ankunft, von der Straße durch die Tür bis an den einen Tisch, der noch frei ist.

---

## 2. Die Kundensprache, recherchiert, geht wörtlich in die Texte

**Gewünschtes Ergebnis:** wie im Urlaub · die Portionen sind riesig · der Ouzo kommt
aufs Haus · man wird sofort begrüßt · seit Jahren dieselbe Familie · endlich mal keine
Touristenküche

**Schmerz:** man weiß nicht, ob man reservieren muss · am Samstag kriegt man keinen
Tisch · die Karte im Netz ist Jahre alt · wo parkt man

**Der Einwand, der abhält:** wirkt wie Massenabfertigung · zu teuer für einen normalen
Abend · lohnt sich das mit Kindern

**Antwort im Layout, nicht im Text:** Die Karte mit echten Preisen steht weit oben,
nicht versteckt. Die Zeiten mit dem markierten heutigen Tag stehen sichtbar. Der eine
Weg zum Tisch ist das Telefon, groß und ohne Umweg. Und die Sektion „Erst das Brot"
führt genau den Empfang vor, den der Vorwurf Massenabfertigung bestreitet.

---

## 3. Die Typografie

Alle drei Schriften tragen echtes Griechisch. Das ist hier keine Kür: Auf der Seite
stehen Ξένιος und φιλοξενία und die griechischen Gerichtnamen. Eine Display-Schrift
ohne Griechisch hätte einen Fremdkörper erzwungen. Geprüft wurde die Abdeckung
tatsächlich, nicht angenommen.

| Rolle | Familie | Einsatz | Warum diese |
|---|---|---|---|
| Display | **EB Garamond** | Schlagzeilen, Hero-Bänder, Sektionsköpfe | Die offene Wiederbelebung der Garamond-Typen. Ihr Griechisch steht in der Linie der Typen, die im 16. Jahrhundert geschnitten wurden, um die griechischen Klassiker zu drucken. Für ein Haus, das nach einem griechischen Gott heißt, ist das das richtige Material und nicht Dekoration. |
| Body | **Literata** | Fließtext, Listen, Antworten | Für langes Lesen am Bildschirm gezeichnet, warm, ruhig, trägt Griechisch. Steht unter der Garamond, ohne mit ihr zu konkurrieren. |
| Label | **Commissioner** | Preise, Uhrzeiten, Eyebrows, Wochentabelle | Von Kostas Bartsokas, einem griechischen Schriftgestalter. Variabel, niedriger Kontrast, in Versalien mit weiter Laufweite. Das dritte Element, das die Seite professionell macht. |

Alle drei unter SIL Open Font License, lokal als woff2 im Projekt, `font-display: swap`,
Preload für EB Garamond im Kopf. Kein fremder CDN-Aufruf.

**Handwerk an der Schrift, verbindlich:**
- Type-Scale mit Verhältnis 1.333, sieben Stufen als Token in `:root`. Keine freien
  Zwischengrößen. Die großen Schlagzeilen skalieren fluid mit `clamp()`.
- Laufweite: Display groß bei `-0.02em`, Versalien-Labels bei `+0.12em`.
- Zeilenhöhe: Schlagzeilen 1.05 bis 1.12, Fließtext 1.6.
- Zeilenlänge auf 62 bis 70 Zeichen begrenzt, in `ch` am Textelement selbst, nie am
  Container, weil `ch` sonst in der falschen Schrift gemessen wird.
- Echte Schnitte, kein Fake-Bold, kein Fake-Italic.
- Deutsche Anführungszeichen unten und oben, `hyphens: auto` mit `lang="de"`.
- Griechische Wörter bekommen `lang="el"`, damit Silbentrennung und Vorlesen stimmen.

---

## 4. Die Farbe

Die Palette kommt aus zwei echten Orten, und diese Zweiteilung ist die These:
**draußen die Hamburger Straße im Novemberdunkel, drinnen die gelbe Steinwand.**
Die Seite wechselt zwischen beiden, weil das Überschreiten der Schwelle das Thema ist.

| Token | Wert | Rolle | Kontrast, gerechnet |
|---|---|---|---|
| `--nacht` | `#141C26` | die Straße, der Hero, die Nachtsektionen | Grund |
| `--nacht-tief` | `#0D141C` | Schatten darin, Fuß | Grund |
| `--stein` | `#E0CBA0` | die gelbe Steinwand, die große Fläche drinnen | Grund |
| `--stein-hell` | `#EDDDBB` | Karten, Formularfelder, aufgehellte Zonen | Grund |
| `--tinte` | `#241E15` | Text und Linien auf Stein | 10.40:1 auf Stein, 12.32:1 auf hell |
| `--messing` | `#7A4E0C` | der Akzent auf Stein, selten | 4.52:1 auf Stein, 5.36:1 auf hell |
| `--messing-hell` | `#C9A227` | derselbe Akzent auf Nacht | 7.09:1 auf Nacht, 7.66:1 auf tief |
| `--kalk` | `#F2E9D6` | Text auf Nacht | 14.22:1 auf Nacht, 15.35:1 auf tief |

Der Akzent braucht zwei Werte, weil ein einziges Messing nicht auf beiden Gründen
bestehen kann. Der erste Entwurf mit `#8A6414` fiel auf dem Steinton mit 3.38:1 durch,
das ist gerechnet und nachgebessert, nicht geschätzt. Alle neun Paarungen bestehen
jetzt.

**Kein reines Schwarz, kein reines Weiß, kein Terracotta.** Die Werte oben sind der
Startpunkt und werden nach der Videofreigabe aus dem Material nachgezogen, damit Seite
und Film eine Welt sind. Alle Paarungen werden gegen WCAG AA gerechnet und die Zahlen
in `DESIGN.md` festgehalten.

**Die Abweichung, laut gesagt:** Ein warmer heller Grund mit einer Serife liegt nah am
Creme-Look, den der 10k-Skill als KI-Griff sperrt. Ich weiche bewusst ab und verdiene
es so: Der Ton ist kein Creme, sondern ein gesättigter Ocker aus der echten Wand des
Betriebs. Der Akzent ist Messing, ausdrücklich nicht Terracotta. Und die Seite ist gar
kein einzelnes helles Feld, sondern wechselt zwischen Nacht und Stein, weil das der
Weg von draußen nach drinnen ist. Der Bruch mit dem Klischee ist strukturell, nicht nur
farblich.

**Anti-Referenzen:** kein Blau-Weiß der griechischen Flagge, keine Mäander-Bordüre,
keine Säulen als Deko, kein Fast-Schwarz mit Bernstein, keine austauschbaren
Icon-Dreispalter, keine gleich abgerundeten Karten mit gleichem Schatten.

---

## 5. Das Signature-Element: der gedeckte Platz

Im Gastrecht bleibt ein Gedeck für den unerwarteten Gast frei. Das ist das eine
Element, das man sich merkt, und es läuft durch die ganze Seite: ein Platz, der leer
bleibt, bis der Besucher ihn selbst eindeckt.

Der Mitmach-Moment sitzt kurz vor dem Call to Action. Der Besucher hält gedrückt,
und während er hält, setzen sich Messer, Glas und Brotkorb an ihre Stellen. Lässt er
zu früh los, fährt der Fortschritt weich zurück, nie mit einem Sprung. Ist gedeckt,
geht die Reservierungszeile daneben an. Bei `prefers-reduced-motion` steht der
Endzustand sofort da, ohne Halten.

Der Test aus dem Skill: Nimmt man das Element weg, ändert sich die Seite spürbar?
Ja, es trägt den Call to Action.

---

## 6. Die Band-Map des Heros

Drei Segmente, etwa 18 Sekunden, rund 1000vh Scrollstrecke. Die Bereiche sind
Startpunkte und werden vom Flick-Test bestätigt oder verschoben.

| Band | Bereich | Was der Film tut | Text, wörtlich | Auftritt |
|---|---|---|---|---|
| 1 | 0.00 bis 0.14 | Osterstraße, nasser Asphalt, das warme Rechteck der Tür wird größer | Eyebrow `ΞΕΝΙΟΣ`, Zeile **„Der Gott, der Gäste beschützt."** | Approach-from-depth, die Zeile wächst leicht auf die Kamera zu. Beim Laden einmalig gesetzt, danach scrollgetrieben |
| 2 | 0.17 bis 0.34 | Die Kamera geht durch die Schwelle, Licht wechselt von kalt zu warm, Beschlag auf der Linse | **„Nach ihm ist dieses Haus benannt."** | Blur-to-sharp, zwei Kopien, die weiche blendet aus, während die scharfe kommt. Echot das Scharfwerden nach der Tür |
| 3 | 0.38 bis 0.56 | Durch den Raum, an besetzten Tischen vorbei, gelbe Steinwand zieht seitlich durch | **„Seit 1981. Dieselbe Familie, derselbe Raum."** | Grid-Snap, die Zeichen fahren in Leserichtung seitlich ein, im selben Takt wie die Wand |
| 4 | 0.60 bis 0.78 | Tiefer im Raum, Dampf, Bewegung am Rand, Gläser | **„Erst das Brot. Dann der Name."** Kleinzeile: „So hält man es hier seit dreitausend Jahren." | Word-Punch mit Überschwingen auf „Brot" und „Name", die Kleinzeile kommt versetzt nach |
| 5 | 0.82 bis 1.00 | Ankunft am gedeckten Tisch, die Fahrt kommt zur Ruhe | Schlagzeile **„Ihr Platz steht bereit."** Subline „Osterstraße 46, Eimsbüttel. Küche bis 22:30 Uhr." CTA **„Tisch reservieren: 040 400383"** | Word-by-word-Rise in drei Ankünften: Schlagzeile, dann Subline, dann CTA-Zeile |

Band 1 lässt die Einblend-Rampe weg, Band 5 die Ausblend-Rampe, damit die Reise
gesetzt beginnt und gesetzt endet.

**Die Textbahnen:** Die Mittelbahn gehört dem Weg zum Tisch und bleibt frei. Die Texte
stehen links und rechts davon, deshalb der zweiseitige Scrim, zwei Ellipsen auf den
Spalten, die Mitte bleibt hell. Band 5 bekommt stattdessen die einzelne obere Ellipse,
weil die Spalten dort zusammenlaufen.

---

## 7. Der Static-Hero-Textblock

Für Handys und für `prefers-reduced-motion`. Steht auf dem Endframe, ohne Reise
dahinter, und ist ein entworfenes Layout, keine Entschuldigung.

- Eyebrow: `ΞΕΝΙΟΣ`
- Schlagzeile: **„Der Gott, der Gäste beschützt. Nach ihm ist dieses Haus benannt."**
- Subline: „Griechische Küche an der Osterstraße, seit 1981 dieselbe Familie."
- CTA: **„Tisch reservieren: 040 400383"**

---

## 8. Die Seite unter dem Hero

Jede Sektion ist ein Schritt des Empfangs. Keine zwei Nachbarn teilen dasselbe
Layout-Skelett.

### 8.1 Der Settle
Läuft direkt aus Band 5 heraus, auf dem Endframe.

### 8.2 Osterstraße 46
Kopf: **„Ein Haus, eine Familie, ein Raum."**
Text: „1981 hat die Familie Efstathiou hier aufgemacht. Seitdem hat sich die Adresse
nicht geändert. Die gelben Steinwände sind dieselben, die Musik ist dieselbe, und wer
öfter kommt, wird beim Namen begrüßt. Im Viertel sagt niemand Xenios. Man sagt, wir
gehen zu Themi."
Zahlenzeile in Commissioner: `SEIT 1981` · `EINE ADRESSE` · `EINE FAMILIE`

### 8.3 Erst das Brot
Kopf: **„Was kommt, bevor Sie etwas sagen."**
Text: „Brot, Olivenöl, Oliven. Das steht auf dem Tisch, bevor die Karte kommt. Nicht
als Gruß aus der Küche, sondern weil es so gehört. Am Ende steht ein Ouzo da, den
niemand aufgeschrieben hat."
Drei gleichwertige Bildplätze, je einer für Brot, Öl, Oliven. Alle drei bekommen ein
Bild, weil eine Lücke sofort als Loch gelesen wird.

### 8.4 Die Karte
Kopf: **„Die Karte, mit Preisen."**
Zeile darunter: „Vollständig und aktuell. Mesedes zuerst, weil hier geteilt wird."
Die echten Gerichte und Preise, gesetzt als ein einziges, identisch wiederholtes
Bauteil. Mesedes kalt und warm, Salate, Fleisch nach Tier getrennt, Fisch, die
gemischten Teller, Beilagen, Nachtisch. Preise in Commissioner, tabellarische Ziffern.

### 8.5 Der lange Tisch
Kopf: **„Wenn Sie mehr werden."**
Text: „Der Clubraum fasst dreißig Personen. Im Sommer sitzt man draußen, im Biergarten
unter den alten Bäumen oder auf der Terrasse unter den Schirmen. Sagen Sie einfach am
Telefon, wie viele Sie sind und was der Anlass ist."
Zahlenzeile: `BIS 30 PERSONEN` · `BIERGARTEN` · `TERRASSE`

### 8.6 Der Keller
Kopf: **„87 Weine. 20 Sorten Ouzo."**
Text: „Alle aus Griechenland. Wer nicht weiß, was passt, sagt es, dann kommt jemand an
den Tisch und fragt, was Sie essen."
Das ist ein echter Beleg und trägt eine eigene Sektion, weil die Zahl für sich spricht.

### 8.7 Die Zeiten
Kopf: **„Wann die Küche an ist."**
Wochentabelle, der heutige Tag ist markiert. Montag bis Freitag ab 16:30 Uhr, Samstag,
Sonntag und feiertags ab 12:00 Uhr, jeweils bis 22:30 Uhr.
Zeile darunter: „An Wochenenden lohnt sich der Anruf vorher."
Das beantwortet den Schmerz „am Samstag kriegt man keinen Tisch", ohne ihn zu wiederholen.

### 8.8 Ihr Platz
Der Mitmach-Moment aus Abschnitt 5, danach der Call to Action.
Kopf: **„Es ist noch gedeckt."**
CTA groß: **„040 400383"**, darunter „Montag bis Sonntag, zu den Küchenzeiten."
Formular als zweiter Weg, drei Felder: Name, Personen, Wunschzeit, plus ein freies Feld.
Buttontext: **„Anfrage schicken"**
Erfolgszustand: **„Ihr Mailprogramm ist offen. Schicken Sie die Nachricht ab, wir
melden uns."**

**Der Weg der Anfrage, ehrlich gesagt:** Es gibt kein Backend. Das Formular baut eine
`mailto`-Nachricht an info@bei-themi.de und öffnet das Mailprogramm des Besuchers. Der
Erfolgstext sagt genau das. Der verlässliche Weg bleibt das Telefon, und deshalb steht
es größer.

### 8.9 Fuß
Adresse, Telefon, Mail, die drei Kanäle (Instagram @xenios_hamburg, Facebook,
Tripadvisor), Impressum, Datenschutz. Kolophon mit dem Hinweis auf das erzeugte
Bildmaterial.

---

## 9. Der Vektorplan

Von Hand gezeichnetes SVG, kein Icon-Set.

- **Die Linie der Ankunft:** eine dünne Messinglinie, die sich am linken Rand durch die
  ganze Seite zieht und sich beim Scrollen selbst zeichnet. Sie hat an jeder Sektion
  einen Knoten, das ist die Wegstrecke von der Tür bis zum Tisch.
- **Das Gedeck:** die Umrisse von Teller, Messer, Glas und Brotkorb als Strichzeichnung
  für den Mitmach-Moment.
- **Die Wochenmarke:** ein einzelner Messingstrich unter dem heutigen Tag.
- **Der Grund:** eine feste Hintergrundebene mit sehr feinem Korn und einem langsamen
  Wärmeverlauf über 90 Sekunden, damit die Seite ein Ort ist und keine gestapelten
  Kästen.

Alles davon respektiert `prefers-reduced-motion`: Endzustände sichtbar, Antriebe aus.

---

## 10. Die Engineering-Liste

Damit der Build nichts halb erinnert. Vollständig in `scrub-pipeline.md`:

Blob-Fetch mit Ladering und Wachhund · über die Zeitdifferenz normalisierter Lerp ·
gegatete Seeks mit Rücksetzung im Fehlerfall · DOM-Schreiben nur bei Änderung ·
Bandtakt in Scrollstrecke plus Flick-Test bei 120, 240 und 360 Pixeln · vierschichtige
Lesbarkeit plus Worst-Frame-Prüfung bei mindestens 3,5 zu 1 · die fünf
Static-Hero-Bedingungen zeichengleich in CSS und JS und live an Change-Listener ·
vollständig ohne Video · nur `transform` und `opacity` · kein Inline-JavaScript wegen
`script-src 'self'` · Qualitätsboden mit Landmarks, Skip-Link, `:focus-visible`,
44px-Zielen bei grobem Zeiger.

---

## 11. Das Textgatter

Jede Zeile oben geht wörtlich auf die Seite. Vor der Abnahme läuft die Suche über die
fertige Datei: null Gedankenstriche, null Treffer auf ganzheitlich, nahtlos, innovativ,
maßgeschneidert, Lösungen, zukunftssicher, Mehrwert, Ihr starker Partner, Kompetenz aus
einer Hand. Dazu die leiseren Muster und der Lieferservice-Durchgang.

Bewusst gesetzt und bleibt: der Dreiklang „Ein Haus, eine Familie, ein Raum", der
Zweischlag „Erst das Brot. Dann der Name.", und die Zahlenzeilen in Versalien. Das ist
Handwerk für diese Marke, kein Drift.
