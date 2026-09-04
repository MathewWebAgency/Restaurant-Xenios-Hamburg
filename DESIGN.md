# DESIGN.md — Xenios, Hamburg

Die visuellen Festlegungen. Verbindlich für jede Änderung. Die Herleitung steht in
`KONZEPT.md`, die Bildplätze in `BILDER.md`. Alle Zahlen hier sind gemessen, nicht
geschätzt, und jede lässt sich mit den Skripten in `scripts/` nachrechnen.

## Die Welt in einem Absatz

Zwei Orte, und der Weg zwischen ihnen ist die Seite. Draußen die Hamburger Straße im
Novemberdunkel, kalt und blau. Drinnen die gelbe Steinwand, warm und alt. Der Besucher
scrollt von draußen nach drinnen bis an einen Tisch, der noch frei ist. Alles andere
ordnet sich dieser einen Bewegung unter.

## Die fünf Hausgesetze

1. Die Mittelbahn des Heros gehört dem Weg zum Tisch. Text steht links oder rechts
   davon, nie darüber.
2. Der Akzent ist Messing und kommt selten. Ein Akzent, der überall ist, ist keiner.
3. Keine zwei benachbarten Sektionen teilen dasselbe Layout-Skelett.
4. Alles easet, nichts schnappt. Animiert werden nur `transform` und `opacity`.
5. Kein reines Schwarz, kein reines Weiß, kein Terracotta, kein Flaggenblau.

## Farbe

| Token | Wert | Rolle | gemessener Kontrast |
|---|---|---|---|
| `--nacht` | `#141C26` | Hero, Nachtsektionen | Grund |
| `--nacht-tief` | `#0D141C` | Fuß, Schatten | Grund |
| `--stein` | `#E0CBA0` | die große helle Fläche | Grund |
| `--stein-hell` | `#EDDDBB` | Karten, Felder | Grund |
| `--tinte` | `#241E15` | Text auf Stein | 10.40:1 / 12.32:1 |
| `--tinte-weich` | `#4A3F2E` | Sekundärtext auf Stein | 6.47:1 / 7.67:1 |
| `--messing` | `#7A4E0C` | Akzent auf Stein | 4.52:1 / 5.36:1 |
| `--messing-hell` | `#C9A227` | Akzent auf Nacht | 7.09:1 / 7.66:1 |
| `--kalk` | `#F2E9D6` | Text auf Nacht | 14.22:1 / 15.35:1 |
| `--kalk-weich` | `#BDB098` | Sekundärtext auf Nacht | 8.03:1 / 8.67:1 |
| `--linie` | `#C4AC7E` | dekorative Haarlinien | ohne Anforderung |
| `--linie-stark` | `#7D6739` | interaktive Ränder | 3.41:1 / 4.05:1 |

Zwei Werte für dasselbe Messing, weil ein einziger Ton nicht auf Nacht und auf Stein
zugleich bestehen kann. Zwei Werte für interaktive Ränder aus demselben Grund: der
erste Entwurf `#8A7346` fiel mit 2.86:1 durch.

## Typografie

| Rolle | Familie | Griechisch | Einsatz |
|---|---|---|---|
| Display | EB Garamond, variabel | ja | Schlagzeilen, Hero-Bänder, Sektionsköpfe |
| Body | Literata, variabel | ja | Fließtext, Antworten |
| Label | Commissioner, variabel | ja | Preise, Zeiten, Eyebrows, Wochentabelle |

Alle drei unter SIL Open Font License, lokal als woff2, aufgeteilt nach Subset mit
`unicode-range`. Eine deutsche Seite lädt 187 KB Latein, das griechische Subset kommt
nur dazu, wenn griechische Zeichen vorkommen. `latin-ext` ist entfernt, Umlaute und
Eszett liegen im Latein-Subset.

Sieben Größen als Token, Verhältnis 1.333. Laufweite: Display groß `-0.02em`,
Versalien-Label `+0.12em`. Zeilenlänge in `ch` am Textelement selbst, nie am Container.

## Der Hero

Zwei Fassungen derselben Reise, je nach Format.

| | quer | hoch |
|---|---|---|
| Datei | `hero-scrub.mp4` | `hero-scrub-hoch.mp4` |
| Größe | 1600×900, crf 26, 8,2 MB | 540×960, crf 28, 2,6 MB |
| Scrollstrecke | 1000vh | 830vh |
| Textlage | links und rechts der Mittelbahn | unten über die ganze Breite |

Beide 16 Sekunden, Keyframe alle 8 Bilder. Das Handy bekam anfangs gar keine
Bewegung, weil es unter den Static-Hero fiel. Das war der auffälligste Mangel der
ersten Fassung: Auf dem Gerät, auf dem die meisten Gäste die Seite öffnen, fehlte
genau das, was die Seite ausmacht.

Fünf Bänder, jedes mit einem eigenen Auftritt, der echot, was der Film in dem Moment tut.

| Band | Bereich | Auftritt |
|---|---|---|
| 1 | 0.00 bis 0.14 | Annäherung aus der Tiefe, beim Laden einmalig gesetzt |
| 2 | 0.17 bis 0.34 | weich zu scharf, echot die Schwelle |
| 3 | 0.38 bis 0.56 | Zeichen fahren seitlich ein, echot die durchziehende Wand |
| 4 | 0.60 bis 0.78 | Wortsprung mit Überschwingen |
| 5 | 0.82 bis 1.00 | Wörter steigen auf, dann Subline, dann Knopf |

**Der Schlusstext steht oben, nicht unten.** Das Schlussbild liefert den gedeckten
Tisch mittig-tief, und der Tisch ist das Beweisstück. Text darunter würde ihn
verdecken. Das Bild hat hier das Layout korrigiert.

### Der Flick-Test, gemessen

Radschritte von 120, 240 und 360 Pixeln, wie ein echter Leser scrollt. Gefordert sind
fünf bis sechs Flicks bei normalem Tempo und kein überspringbares Band bei 360.

| Band | quer, 120px | hoch, 120px |
|---|---|---|
| 1 | 8 | 6 |
| 2 | 10 | 7 |
| 3 | 10 | 7 |
| 4 | 10 | 7 |
| 5 | 14 | 10 |

Im Hochformat stand die Strecke zuerst auf 640vh, und Band 1 blieb dort nur vier
Flicks lesbar. Behoben wurde das mit mehr Strecke, 830vh, **nicht** mit kürzeren
Rampen. Rampen zu stauchen löst ein zu kurzes Band nie, es macht den Auftritt nur
hektisch.

### Die Wärme am Anfang

Der Einstieg war zu kalt. Gemessen an den Kanalmittelwerten lag Rot am ersten Bild
sieben Punkte unter Blau, während schon zwei Sekunden später Rot neunzehn Punkte
darüber liegt. Die Kälte saß also genau im ersten Eindruck und nirgends sonst.

Korrigiert wird deshalb zeitabhängig, nicht global: Rot mal 1,14 plus 7, Blau mal
0,91, und diese Korrektur läuft über 2,6 Sekunden linear auf null aus. Ab Sekunde
drei ist das Bild messbar identisch mit dem Original, der Übergang ist unsichtbar.

| Zeit | vorher (Rot minus Blau) | nachher |
|---|---|---|
| 0,2 s | −7,0 | +12,3 |
| 1,0 s | −8,0 | +5,7 |
| 3,0 s | +37,3 | +37,3 |
| 14,0 s | +83,2 | +83,1 |

Stärker wollte ich nicht: Bei doppelter Korrektur verliert die Fassade ihr Blau und
der Himmel kippt ins Grünliche. Die Nacht soll Nacht bleiben, nur soll das warme
Licht aus der Tür auf die Straße übergreifen statt dagegen anzukämpfen.

### Die Lesbarkeit, gemessen an der zusammengesetzten Seite

Die Schrift wird unsichtbar geschaltet, die Seite fotografiert, und im Kasten der
Schrift der hellste Pixel gesucht. Damit sind alle Scrim-Ebenen exakt so gemessen,
wie der Besucher sie sieht. Die Methode ist streng: mit der Schrift verschwindet auch
ihr Schatten, der in Wahrheit noch hilft.

| Band | schlimmster Pixel | quer | hoch, schwächster Schirm |
|---|---|---|---|
| 1 | rgb(92,90,89) | 5.68:1 | |
| 2 | rgb(95,90,94) | 5.59:1 | |
| 3 | rgb(96,91,87) | 5.56:1 | |
| 4 | rgb(84,75,58) | 7.12:1 | |
| 5 | rgb(106,96,91) | 5.06:1 | 3.99:1 bei 375×667 |

Boden 3.5:1. Alle bestehen, quer wie hoch, über 375×667, 375×812 und 430×932.

Der Static-Hero, also der Zustand ohne Video, wurde eigens gemessen: 6.42:1 bis
12.65:1 über sechs Formate von 375×667 bis 1024×1366. Er saß anfangs oben im Bild und
lag damit auf einem Tablet mitten im Türlicht, gemessene 1.22:1. Jetzt steht er auf
allen Schirmen unten, wo das nasse Pflaster die ruhige Zone bildet, und hat einen
eigenen Scrim, der am Textkasten hängt statt an der Bildhöhe.

**Zwei Dinge, die hier gelernt wurden und festgehalten gehören.**

Erstens: Der erste Entwurf fiel mit 1.0 bis 1.75 durch, und die naheliegende Antwort
wäre gewesen, den Scrim dunkler zu machen. Nachgerechnet brauchte der schlimmste
Pixel aber nur 0.52 Deckung, und der Verlauf hatte in der Spitze schon 0.66. Das
Problem war nicht die Tiefe, sondern die Größe. Wer hier nur die Deckkraft hochdreht,
tötet das Bild und löst nichts.

Zweitens, und das war der eigentliche Fehler: Die Scrims hingen als Ellipse am
Textkasten. **Eine begrenzte Form hat immer eine Kante**, und die las sich als
dunkler Kasten hinter der Schrift, besonders am Schluss. Egal wie weich der Verlauf
ist, seine Grenze bleibt sichtbar, sobald sie im Bild liegt.

Die Lösung ist nicht weicher, sondern anders: Die Scrims liegen jetzt als eigene
Ebenen auf der Bühne und laufen **vom Bildrand nach innen** aus. Ein Verlauf, dessen
dunkles Ende außerhalb des Bildes liegt, kann keine Kante zeigen. Die Mittelbahn
bleibt trotzdem hell, weil die seitlichen Verläufe vorher auslaufen.

## Bewegung

- Zwei Kurven als Token, überall dieselben: `--ease-aus` für Erscheinen,
  `--ease-beid` für Bewegen.
- UI-Übergänge 140 bis 200 Millisekunden, gestaltete Momente bis 420.
- Ein lebendes Element pro Sektion auf Flüsterniveau, alles mit negativer Verzögerung,
  damit beim ersten Anstrich niemand einen Sprung sieht.
- Alles pausiert bei verstecktem Tab, und zwar über eine Regel, die jedes Element und
  jedes Pseudoelement direkt trifft, weil `animation-play-state` nicht vererbt.
- `prefers-reduced-motion` wird in beide Richtungen befolgt.

## Der Ruf, also der Call to Action

Kein Knopf. Ein gefülltes Rechteck mit Versalien darauf ist die Form, die auf jeder
beliebigen Seite steht, und genau daran erkennt man Baukasten. In einer Welt aus
Stein, Messing und einer Garamond wird die Nummer gesetzt: eine kleine Messingzeile
darüber, die Nummer in der Display-Schrift, ein Haarstrich aus Messing darunter, der
beim Zeigen wächst. Die Fläche ist mit 69 Pixeln Höhe von selbst weit über dem
Mindestziel für grobe Zeiger.

## Der Mitmach-Moment

Das Gedeck. Halten baut Fortschritt auf, Loslassen fährt ihn weich zurück, nie mit
einem Sprung. Vier Stufen: Teller, Messer, Glas, Brotkorb. Ist gedeckt, geht die
Reservierung daneben an. Bei reduzierter Bewegung steht der Endzustand sofort da.
Tastatur bedient ihn genauso, Leertaste und Enter halten.

## Was ausdrücklich nicht vorkommt

Kein GSAP. Der Plan sah es vor, gebraucht wurde es nirgends, und 114 KB ungenutzte
Bibliothek auszuliefern wäre schlechter als die Abweichung. Alles läuft in Vanilla.

Kein Lieferservice, an keiner Stelle, auch nicht im Alt-Text. Vor jeder Abnahme läuft
die Suche darüber.

Kein Inline-JavaScript. Die `.htaccess` setzt `script-src 'self'`, ein Skript in der
Seite läuft lokal und wird live blockiert. Das fällt erst nach dem Deploy auf, deshalb
liegt jede Zeile in einer Datei unter `js/`.
