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

- Höhe 1000vh, zwei Segmente zu je 8 Sekunden, insgesamt 16 Sekunden Material.
- Video 1600 Pixel breit, crf 26, Keyframe alle 8 Bilder, 8,1 MB.
- Fünf Bänder, jedes mit eigenem Auftritt, der echot, was der Film gerade tut.

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

Radschritte von 120, 240 und 360 Pixeln, wie ein echter Leser scrollt.

| Band | 120px | 240px | 360px |
|---|---|---|---|
| 1 | 8 Flicks voll lesbar | 4 | 3 |
| 2 | 10 | 5 | 3 |
| 3 | 10 | 5 | 4 |
| 4 | 10 | 5 | 4 |
| 5 | 14 | 7 | 4 |

Gefordert sind fünf bis sechs Flicks bei normalem Tempo und kein überspringbares Band
bei 360. Beides erfüllt.

### Die Lesbarkeit, gemessen an der zusammengesetzten Seite

Die Schrift wird unsichtbar geschaltet, die Seite fotografiert, und im Kasten der
Schrift der hellste Pixel gesucht. Damit sind alle Scrim-Ebenen exakt so gemessen,
wie der Besucher sie sieht. Die Methode ist streng: mit der Schrift verschwindet auch
ihr Schatten, der in Wahrheit noch hilft.

| Band | schlimmster Pixel | Kontrast |
|---|---|---|
| 1 | rgb(118,109,99) | 4.21:1 |
| 2 | rgb(118,113,107) | 4.01:1 |
| 3 | rgb(122,113,104) | 3.96:1 |
| 4 | rgb(101,91,66) | 5.56:1 |
| 5 | rgb(108,81,56) | 6.06:1 |

Boden 3.5:1. Alle bestehen.

**Was dabei gelernt wurde und hier festgehalten gehört:** Der erste Entwurf fiel mit
1.0 bis 1.75 durch, und die naheliegende Antwort wäre gewesen, den Scrim dunkler zu
machen. Nachgerechnet brauchte der schlimmste Pixel aber nur 0.52 Deckung, und der
Verlauf hatte in der Spitze schon 0.66. Das Problem war nicht die Tiefe, sondern die
Größe: Der Verlauf war zu klein und saß außermittig, ein Glanzlicht lag daneben und
schlug durch die Schrift. Wer hier nur die Deckkraft hochdreht, tötet das Bild und
löst nichts.

## Bewegung

- Zwei Kurven als Token, überall dieselben: `--ease-aus` für Erscheinen,
  `--ease-beid` für Bewegen.
- UI-Übergänge 140 bis 200 Millisekunden, gestaltete Momente bis 420.
- Ein lebendes Element pro Sektion auf Flüsterniveau, alles mit negativer Verzögerung,
  damit beim ersten Anstrich niemand einen Sprung sieht.
- Alles pausiert bei verstecktem Tab, und zwar über eine Regel, die jedes Element und
  jedes Pseudoelement direkt trifft, weil `animation-play-state` nicht vererbt.
- `prefers-reduced-motion` wird in beide Richtungen befolgt.

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
