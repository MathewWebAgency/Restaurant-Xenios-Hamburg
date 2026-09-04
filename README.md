# Xenios, Hamburg

Website für das griechische Restaurant Xenios, Osterstraße 46, Hamburg Eimsbüttel.
Statisches HTML, CSS und Vanilla JavaScript. Kein Framework, kein Build-Schritt,
kein npm im Auslieferungsstand.

## Was hier drin liegt

```
index.html         die ganze Seite
impressum.html     mit Bildnachweis für das erzeugte Material
datenschutz.html
404.html
css/tokens.css     Farbe, Schrift, Raum, Bewegung. Wer hier etwas ändert,
                   ändert die ganze Seite
css/fonts.css      die Schriften, lokal, pro Subset mit unicode-range
css/style.css      die Gestaltung
js/vor-anstrich.js läuft vor dem ersten Anstrich
js/hero.js         die scroll-gesteuerte Kamerafahrt
js/main.js         Sektionen, Wochentabelle, das Gedeck, das Formular
assets/            Schriften, Bilder, Video
scripts/           die Prüfwerkzeuge, gehören nicht auf den Server
roh/               Rohmaterial und Prüfbilder, gehören nicht auf den Server
KONZEPT.md         die Herleitung. Jede Textzeile steht wörtlich so auf der Seite
DESIGN.md          die verbindlichen visuellen Festlegungen mit den Messwerten
BILDER.md          welcher Auftrag welches Bild erzeugt hat, für den Fototausch
```

## Ansehen

```bash
python3 -m http.server 4331 --bind 127.0.0.1
```

Dann `http://127.0.0.1:4331/` im **echten Browser** öffnen. Die eingebaute Vorschau
der Entwicklungsumgebung kommt mit Scroll-Video-Seiten nicht klar: Sie stellt das
Zeichnen ein, sobald sie nicht sichtbar ist, dann steht `requestAnimationFrame`
still und CSS-Übergänge frieren mitten drin ein. Das sieht nach einem kaputten
Hero aus und ist keiner.

Ein Doppelklick auf `index.html` zeigt absichtlich den Standbild-Hero: Browser
sperren `fetch` auf `file://`, also greift der geplante Rückfall. Das ist ein
kostenloser Test dieses Zustands, aber nicht die volle Vorschau.

## Prüfen

Beide Skripte fahren das installierte Chrome headless über das DevTools-Protokoll.
Sie brauchen keine Pakete, Node ab Version 22 bringt WebSocket mit.

```bash
# Chrome starten
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --remote-debugging-port=9222 \
  --user-data-dir=/tmp/xenios-chrome --hide-scrollbars about:blank &

node scripts/pruefen.mjs      # 34 Prüfungen: Auftritte, Gates, Gedeck, Konsole
node scripts/lesbarkeit.mjs   # Kontrast jedes Hero-Bandes gegen den hellsten Pixel
```

`pruefen.mjs` deckt die vier Dinge ab, die nur ein echter Browser kann: echte
Touch-Emulation für `pointer: coarse`, das Umschalten von reduzierter Bewegung
mitten in der Sitzung, das Blockieren der Video-URL, und einen echten Mausdruck
mit Pause für den Halte-Moment.

## Was beim Livegang zu tun ist

1. `og:url` und `og:image` an der als `<!-- DEPLOY STEP -->` markierten Stelle in
   `index.html` mit der echten Adresse ersetzen, dazu die drei `PLATZHALTER_URL`
   in `sitemap.xml`. **Mit dem Editor, nicht mit einem Shell-Einzeiler**, sonst
   werden die Umlaute zerschossen.
2. `noindex, nofollow` aus allen vier HTML-Dateien entfernen und `robots.txt` von
   `Disallow: /` auf `Allow: /` stellen. Das steht bewusst auf zu, solange
   erzeugtes Bildmaterial statt echter Fotos auf der Seite ist.
3. Die offenen Angaben im Impressum ergänzen, sie sind dort markiert.
4. Den **Inhalt** des Ordners zippen, nicht den Ordner. `roh/` und `scripts/`
   bleiben draußen.
5. Nach dem Deploy selbst prüfen: 200 über HTTPS, das Video liefert wirklich aus,
   Konsole sauber, Scrubbing läuft live.

## Gemessene Zahlen

| | |
|---|---|
| Seite ohne Video, Desktop | 526 KB |
| Seite ohne Video, Handy | 361 KB |
| Video quer, strömt hinter dem Ladering nach | 8,17 MB |
| Video hoch, fürs Handy | 2,26 MB |
| DOM fertig | 54 ms |
| Schriften, die eine deutsche Seite lädt | 187 KB Latein, 108 KB Griechisch dazu |
| schwächster Textkontrast im Hero | 3,96:1 gegen den hellsten Pixel |
| Selbsttest | 35 von 35 |

## Die Regeln, die man beim Ändern kennen muss

**Kein Inline-JavaScript.** Die `.htaccess` setzt `script-src 'self'`. Ein Skript
direkt in der Seite läuft lokal und wird live blockiert. Das fällt erst nach dem
Deploy auf, und dort nur in der Konsole.

**Es gibt drei Hero-Zustände, und ihre Bedingungen stehen zeichengenau gleich in
`style.css` und in `hero.js`.** Weicht eine ab, lädt die eine Seite Dateien, die die
andere versteckt.

1. Quer und breit: die 8,2-MB-Fahrt, Text links und rechts der Mittelbahn.
2. Hochkant bis 1024px: die 2,6-MB-Fahrt, Text unten über die ganze Breite.
3. Reduzierte Bewegung oder quer gehaltenes Handy ohne Höhe: gar kein Video,
   stattdessen der Static-Hero auf einem Standbild.

Alles hängt an Change-Listenern. Dreht jemand das Gerät, wird die passende Fassung
still getauscht, statt eine Querformat-Fahrt hochkant zu beschneiden.

**Nur `transform` und `opacity` animieren.** Und nie eine dynamische Eigenschaft
auf ein Element setzen, das gleichzeitig eine Auftrittsanimation mit `forwards`
trägt, deren Endwert gewinnt sonst für immer.

**Kein Lieferservice**, an keiner Stelle, auch nicht im Alt-Text.
