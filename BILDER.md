# BILDER.md — Xenios, Hamburg

Alles Bild- und Videomaterial dieser Seite ist über **Kie.ai** erzeugt und steht als
Platzhalter, bis Fotos des Betriebs vorliegen. Diese Datei sagt, was wo liegt, mit
welchem Auftrag es entstanden ist und wie es später gegen echte Fotos getauscht wird.

Kie.ai löscht seine Ergebnisse nach etwa 14 Tagen. Die Rohdateien in `roh/` sind
die einzige Sicherung und gehören nicht auf den Server.

## Der Tausch gegen echte Fotos

Gleiche Dateinamen, gleiche Seitenverhältnisse, fertig. Am Layout ändert sich nichts.

| Datei | Verhältnis | Größe im Web | Motiv |
|---|---|---|---|
| `assets/video/hero-scrub.mp4` | 16:9 | 1600 breit, 8,1 MB | die Kamerafahrt von der Straße an den Tisch |
| `assets/video/hero-poster.jpg` | 16:9 | erstes Bild der Fahrt | die Straße mit der offenen Tür |
| `assets/video/hero-scrub-hoch.mp4` | hoch, 540×960 | 2,6 MB | dieselbe Fahrt fürs Handy, eigener Ausschnitt |
| `assets/video/hero-hoch-poster.jpg` | hoch, 540×960 | 70 KB | Standbild dazu |
| `assets/video/hero-hoch.jpg` | hoch, 1000×1780 | 131 KB | Hintergrund des Static-Hero bei reduzierter Bewegung |
| `assets/bilder/brot.jpg` | 4:5 | 1000 breit | Brotkorb auf weißer Decke |
| `assets/bilder/oel.jpg` | 4:5 | 1000 breit | Oliven und Olivenöl |
| `assets/bilder/ouzo.jpg` | 4:5 | 1000 breit | Ouzo und Nachtisch am Ende des Abends |
| `assets/bilder/clubraum.jpg` | 16:9 | 1920 breit | der lange Tisch im hinteren Raum |

Das letzte Bild der Fahrt liegt als `roh/hero-ending.jpg` bereit, wird auf der Seite
aber nirgends gebraucht und deshalb nicht ausgeliefert.

Nach dem Tausch sind drei Stellen anzupassen: der Abschnitt Bildnachweis im
Impressum, das Kolophon im Fuß der Startseite, und dieser Satz hier.

## Die Kamerafahrt

Zwei Segmente zu je 8 Sekunden, gekettet. Der Endframe von Segment 1 wurde in voller
PNG-Qualität gezogen, zu Kie hochgeladen und als Startbild für Segment 2 übergeben.
**Nie aus einem Review-JPG ketten**, das backt die Kompression in jedes Folgesegment.

| Schritt | Modell | Credits | Ergebnis |
|---|---|---|---|
| Startframe, Versuch 1 | nano-banana-2, 2K, 16:9 | 12 | Eckhaus frontal, verworfen: symmetrisch, Tür zu |
| Startframe, Versuch 2 | nano-banana-2, 2K, 16:9 | 12 | **genommen**, Tür offen, Kamera seitlich |
| Segment 1, Versuch 1 | veo3_fast | 60 | verworfen: Innenraum war eine nordische Weinbar |
| Segment 1, Versuch 2 | veo3_fast | 60 | **genommen**, Raum als griechische Taverne beschrieben |
| Segment 1 in HD | Veo 1080p | 5 | 1920×1080 |
| Segment 2, Versuch 1 | veo3_fast | 60 | verworfen: Sackgasse an der Weinwand, nahes Gesicht |
| Segment 2, Versuch 2 | veo3_fast | 60 | **genommen**, Drehung und Ruhe am gedeckten Tisch |
| Segment 2 in HD | Veo 1080p | 5 | 1920×1080 |
| vier Sektionsbilder | nano-banana-2, 2K | 48 | Brot, Öl, Ouzo, Clubraum |

### Was zweimal gelaufen ist und warum

**Der Innenraum.** Der erste Versuch für Segment 1 beschrieb nur die Straße. Das
Modell hat den Raum dahinter frei erfunden und eine weiß gestrichene, nordische
Weinbar geliefert. Xenios hat aber gelbe Steinwände, und dieser Satz steht wörtlich
auf der Seite. Ein Bild, das ihm widerspricht, macht den Text zur Lüge. Seitdem steht
der Raum in jedem Auftrag ausgeschrieben: warmer gelber Kalkstein mit sichtbarem
Alter, dunkles Holz, Terrakottaboden, niedriges warmes Glühlicht, Kupfer und Wein im
Regal, und ausdrücklich nicht weiß gestrichen und nicht skandinavisch.

**Die Sackgasse.** Segment 1 endet mit Blick auf die Weinwand. Der erste Versuch für
Segment 2 sagte weiter geradeaus, und genau das kam: eine Fahrt in die Wand, die
dreißig Zentimeter davor endet. Der Fehler lag im Plan, nicht im Modell. Der zweite
Versuch gibt die Drehung vor.

### Verbindlich in jedem Auftrag

- `no text, no lettering, no logos, no labels, no signage, no watermarks`
- `documentary photography, natural light, real wear, slight asymmetry, imperfect`
- Menschen bleiben fern, weich und in Bewegung. Nahe Gesichter sind die Stelle, an der
  erzeugte Bilder auffliegen.
- Keine spiegelnden Böden, kein wabernder Nebel, keine Lens Flares, keine perfekt
  symmetrische Komposition.
- Freie Fläche nie als Dunkelheit oder Leere beschreiben. Wer das tut, bekommt
  schwarze Balken gemalt. Die Szene wird als eine durchgehende Welt von Rand zu Rand
  beschrieben, mit der ruhigen Zone als Teil davon.

## Die Verarbeitung

Kostet keine Credits, läuft mit ffmpeg. Beide Fassungen entstehen in je einem
Durchgang aus denselben HD-Quellen, damit keine Generationsverluste entstehen und die
Wärmekorrektur in beiden identisch sitzt.

**Die Wärmekorrektur am Anfang.** Der Einstieg war zu kalt gemessen, Rot lag am
ersten Bild sieben Punkte unter Blau. Korrigiert wird zeitabhängig über `geq`, die
Korrektur läuft über 2,6 Sekunden auf null aus:

```
geq=r='clip(r(X,Y)*(1+0.14*max(0,(2.6-T)/2.6))+7*max(0,(2.6-T)/2.6),0,255)'
   :g='clip(g(X,Y)*(1+0.05*max(0,(2.6-T)/2.6))+3*max(0,(2.6-T)/2.6),0,255)'
   :b='clip(b(X,Y)*(1-0.09*max(0,(2.6-T)/2.6)),0,255)'
```

**Der Ausschnitt fürs Hochformat.** `crop=608:1080:744:0` aus der 1920er Quelle, dann
auf 540×960. Die Position 744 ist gewählt, nicht geraten: Bei 547 stand die Tür am
Anfang zu weit rechts, bei 680 verlor der Schluss den Brotkorb. Der Wert dazwischen
hält beides im Bild.

```bash
# Die zwei Rohsegmente in EINEM Durchgang zusammenfuegen und genau einmal
# kodieren. Ein einziger Durchgang heisst: die Naht kann gar nicht erst
# auseinanderlaufen, weil es nichts anzugleichen gibt.
ffmpeg -i roh/seg1b-1080.mp4 -i roh/seg2b-1080.mp4 \
  -filter_complex "[0:v][1:v]concat=n=2:v=1:a=0[c];[c]scale=1600:-2[v]" -map "[v]" \
  -c:v libx264 -crf 26 -preset slow -g 8 -keyint_min 8 \
  -pix_fmt yuv420p -movflags +faststart -an assets/video/hero-scrub.mp4

# Standbild und Endbild
ffmpeg -i assets/video/hero-scrub.mp4 -frames:v 1 -q:v 3 assets/video/hero-poster.jpg
ffmpeg -sseof -0.1 -i assets/video/hero-scrub.mp4 -update 1 -frames:v 1 -q:v 3 \
  assets/video/hero-ending.jpg
```

`-g 8` ist der Wert, der über weiches oder ruckelndes Scrubbing entscheidet: Der
Browser kann nur auf Keyframes genau springen. `-an` wirft den Ton weg, den Veo
mitliefert und den eine Scroll-Fahrt nie braucht.

**Warum crf 26 bei 1600 und nicht mehr Qualität.** Gemessen wurde eine Reihe:

| Einstellung | Größe |
|---|---|
| crf 22, 1920 breit | 18,1 MB |
| crf 24, 1920 breit | 14,3 MB |
| crf 26, 1920 breit | 11,3 MB |
| crf 24, 1600 breit | 10,4 MB |
| **crf 26, 1600 breit** | **8,1 MB** |

Danach wurde geprüft, ob die ruhigen Verläufe Stufen ziehen, denn glatte Verläufe
brechen zuerst, während belebte Textur Artefakte versteckt. In drei ruhigen Flächen
(warme Wand am Lampenlicht, Steinwand hinter dem Tisch, dunkle Holzfläche) hat die
kodierte Fassung genauso viele Helligkeitsstufen wie die Quelle. Kein Verlust, also
ist der Wert tragbar.

## Wenn neu erzeugt wird

Der Zugang läuft über den Kie.ai-Konnektor. Der Schlüssel liegt beim Konnektor, nicht
im Projekt. Ablauf für Bilder:

```
POST /api/v1/jobs/createTask   {model:"nano-banana-2", input:{prompt, aspect_ratio, resolution:"2K", output_format:"jpg"}}
GET  /api/v1/jobs/recordInfo?taskId=…   bis state auf success steht
```

Für Video ist der Weg ein anderer, flache Felder ohne verschachteltes `input`:

```
POST /api/v1/veo/generate      {model:"veo3_fast", aspect_ratio:"16:9", imageUrls:[…], prompt}
GET  /api/v1/veo/record-info?taskId=…   successFlag 1 heisst fertig, 2 und 3 Fehler
GET  /api/v1/veo/get-1080p-video?taskId=…   liefert eine neue taskId, kostet 5 Credits
```

`resultUrls` ist bei Veo ein JSON-String und muss erst geparst werden. Die taskId wird
sofort nach dem Absenden weggeschrieben, denn abgerechnet wird beim Absenden, nicht
beim Abfragen. Eine verlorene taskId ist bezahltes Nichts. Alle Aufträge stehen in
`roh/tasks/tasks.log`.
