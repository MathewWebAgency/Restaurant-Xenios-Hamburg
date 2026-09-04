/* Der Selbsttest. Faehrt das echte Chrome headless und prueft die Dinge,
   die eine eingebaute Vorschau nicht pruefen kann: Touch, Reduced Motion
   mitten in der Sitzung, geblockte URLs, echter Mausdruck mit Pause.

   Aufruf:  node scripts/pruefen.mjs [url]
*/

import { verbinden } from './chrome.mjs';
import { mkdir } from 'node:fs/promises';

const URL_BASIS = process.argv[2] || 'http://127.0.0.1:4331/';
const AUS = 'roh/pruefung';

const gut = [], schlecht = [];
function pruefe(name, bedingung, detail = '') {
  (bedingung ? gut : schlecht).push(name + (detail ? '  ' + detail : ''));
  console.log(`${bedingung ? '  ok  ' : '  XX  '} ${name}${detail ? '   ' + detail : ''}`);
}

const c = await verbinden();
await mkdir(AUS, { recursive: true });
// Immer gegen den frischen Stand pruefen, nie gegen den Cache.
await c.senden('Network.enable');
await c.senden('Network.setCacheDisabled', { cacheDisabled: true });
await c.senden('Network.clearBrowserCache');

// Konsolenfehler mitschneiden, aber die 404 der noch fehlenden Videodatei
// nicht als Fehler zaehlen: der Zustand ohne Video ist ein geplanter Zustand.
const konsole = [];
await c.senden('Log.enable');
await c.senden('Runtime.enable');
c.auf(d => {
  if (d.method === 'Log.entryAdded' && d.params.entry.level === 'error') {
    konsole.push(d.params.entry.text + ' ' + (d.params.entry.url || ''));
  }
  if (d.method === 'Runtime.exceptionThrown') {
    konsole.push('EXCEPTION ' + d.params.exceptionDetails.text);
  }
});

console.log('\n=== 1. Desktop 1440x900 ===');
await c.groesse(1440, 900, false);
await c.gehe(URL_BASIS);
await c.bild(`${AUS}/01-hero-desktop.jpg`);

const start = await c.js(`
  const b = document.getElementById('buehne');
  const band1 = document.querySelector('.band');
  return {
    titel: document.title,
    h1: !!document.querySelector('h1'),
    main: !!document.getElementById('main'),
    sprung: !!document.querySelector('.sprungmarke'),
    heroHoehe: document.getElementById('hero').offsetHeight,
    band1Opacity: getComputedStyle(band1).opacity,
    band1K: getComputedStyle(band1).getPropertyValue('--k').trim(),
    filmAus: b.classList.contains('film-aus'),
    schriftDisplay: getComputedStyle(document.querySelector('.band__zeile')).fontFamily
  };
`);
pruefe('Titel gesetzt', !!start.titel);
pruefe('h1, main und Sprungmarke vorhanden', start.h1 && start.main && start.sprung);
pruefe('Band 1 steht beim Laden gesetzt da', parseFloat(start.band1Opacity) > 0.9,
       `opacity ${start.band1Opacity}, --k ${start.band1K}`);
pruefe('Display-Schrift ist EB Garamond', /EB Garamond/.test(start.schriftDisplay));

console.log('\n=== 2. Kein Querschieben ===');
const quer = await c.js(`
  const w = document.documentElement;
  return { scrollW: w.scrollWidth, clientW: w.clientWidth,
           bodyScrollW: document.body.scrollWidth };
`);
pruefe('Seite laesst sich nicht seitwaerts schieben',
       quer.scrollW <= quer.clientW + 1,
       `scrollWidth ${quer.scrollW} vs ${quer.clientW}`);

console.log('\n=== 3. Auftritte spielen wirklich ===');
// Jede Sektion einmal anfahren, sonst prueft der Test nur, was zufaellig
// gerade im Bild steht.
const auftritte = await c.js(`
  const out = [];
  const ziele = ['haus','brot','karte','keller','tisch','zeiten','platz'];
  for (const id of ziele) {
    document.getElementById(id).scrollIntoView({behavior:'instant', block:'center'});
    await new Promise(r=>setTimeout(r,700));
  }
  await new Promise(r=>setTimeout(r,900));
  document.querySelectorAll('.auftritt').forEach(el => {
    out.push({ n: el.className.split(' ')[0],
               in: el.classList.contains('in'),
               op: getComputedStyle(el.firstElementChild).opacity });
  });
  return out;
`);
auftritte.forEach(a => pruefe(`Auftritt ${a.n} durchgelaufen`,
  a.in && parseFloat(a.op) > 0.98, `opacity ${a.op}`));

console.log('\n=== 4. Staffelverzoegerung wird zurueckgenommen ===');
await c.js(`await new Promise(r=>setTimeout(r,900));`);
const stagger = await c.js(`
  const g = document.querySelector('.dreier');
  if (!g) return { ok: true, grund: 'keine Gruppe sichtbar' };
  const dritt = g.children[2];
  return { fertig: g.classList.contains('fertig'),
           delay: getComputedStyle(dritt).transitionDelay };
`);
// transition-delay liefert einen Wert je Eigenschaft, hier also "0s, 0s".
// Geprueft wird deshalb, dass KEINER der Werte ungleich null ist.
const delays = (stagger.delay || '0s').split(',').map(v => parseFloat(v));
pruefe('Dritte Karte hat keine Restverzoegerung mehr',
       stagger.ok || delays.every(v => v === 0), `transition-delay ${stagger.delay}`);

console.log('\n=== 5. Der Mitmach-Moment, echter Mausdruck mit Pause ===');
await c.js(`document.getElementById('platz').scrollIntoView({behavior:'instant'});
            await new Promise(r=>setTimeout(r,500));`);
const knopfBox = await c.js(`
  const k = document.getElementById('gedeck-knopf');
  const r = k.getBoundingClientRect();
  return { x: Math.round(r.left + r.width/2), y: Math.round(r.top + r.height/2) };
`);
await c.maus('mousePressed', knopfBox.x, knopfBox.y);
await c.js(`await new Promise(r=>setTimeout(r,700));`);
const halb = await c.js(`return { f: getComputedStyle(document.getElementById('gedeck-knopf')).getPropertyValue('--f').trim(),
                                  stufe: document.getElementById('gedeck').getAttribute('data-stufe') };`);
pruefe('Halten baut Fortschritt auf', parseFloat(halb.f) > 0.2 && parseFloat(halb.f) < 0.95,
       `--f ${halb.f}, Stufe ${halb.stufe}`);

await c.maus('mouseReleased', knopfBox.x, knopfBox.y);
await c.js(`await new Promise(r=>setTimeout(r,260));`);
const zurueck = await c.js(`return getComputedStyle(document.getElementById('gedeck-knopf')).getPropertyValue('--f').trim();`);
pruefe('Loslassen faehrt weich zurueck statt zu springen',
       parseFloat(zurueck) < parseFloat(halb.f) && parseFloat(zurueck) > 0,
       `von ${halb.f} auf ${zurueck}`);

await c.maus('mousePressed', knopfBox.x, knopfBox.y);
await c.js(`await new Promise(r=>setTimeout(r,2400));`);
await c.maus('mouseReleased', knopfBox.x, knopfBox.y);
const fertig = await c.js(`
  return { gedeckt: document.getElementById('gedeck').hasAttribute('data-fertig'),
           rechtsAn: document.querySelector('.platz__rechts').classList.contains('an'),
           label: document.querySelector('.gedeck__label').textContent };
`);
pruefe('Durchhalten deckt den Platz und schaltet die Reservierung frei',
       fertig.gedeckt && fertig.rechtsAn, `Label "${fertig.label}"`);
await c.bild(`${AUS}/02-gedeck-fertig.jpg`);

console.log('\n=== 6. Der heutige Tag ist markiert ===');
const heute = await c.js(`
  const z = document.querySelector('.woche tr[data-heute]');
  return z ? { tag: z.querySelector('th').textContent.trim(),
               marke: getComputedStyle(z.querySelector('th'), '::before').width } : null;
`);
pruefe('Heutiger Tag markiert', !!heute, heute ? heute.tag : 'keine Zeile markiert');

console.log('\n=== 7. Handy 375x812 mit echter Touch-Emulation ===');
// Das Handy bekommt die Fahrt jetzt auch, aber als eigene schmale Datei.
// Geprueft wird deshalb: laeuft sie, und wird die schwere Querformat-Datei
// wirklich nicht mit geholt.
const handyGeholt = [];
c.auf(d => {
  if (d.method === 'Network.requestWillBeSent') handyGeholt.push(d.params.request.url.split('/').pop());
});
await c.senden('Network.enable');
await c.groesse(375, 812, true);
await c.gehe(URL_BASIS);
const handy = await c.js(`
  for (let i=0;i<70;i++){
    const b=document.getElementById('buehne');
    if (b.classList.contains('film-bereit')||b.classList.contains('film-aus')) break;
    await new Promise(r=>setTimeout(r,400));
  }
  const f = document.getElementById('film');
  return {
    ruheheroSichtbar: getComputedStyle(document.getElementById('ruhehero')).display !== 'none',
    baenderDa: getComputedStyle(document.getElementById('baender')).display !== 'none',
    heroHoehe: document.getElementById('hero').offsetHeight,
    coarse: matchMedia('(pointer: coarse)').matches,
    videoSrc: !!f.getAttribute('src'),
    laufzeit: f.duration,
    quer: document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1
  };
`);
pruefe('Touch-Emulation greift wirklich', handy.coarse);
pruefe('Handy bekommt die Fahrt statt eines Standbildes',
       handy.baenderDa && !handy.ruheheroSichtbar && handy.videoSrc,
       `Laufzeit ${handy.laufzeit}s`);
pruefe('Handy holt die schmale Fassung, nicht die schwere',
       handyGeholt.includes('hero-scrub-hoch.mp4') && !handyGeholt.includes('hero-scrub.mp4'),
       handyGeholt.filter(u => /mp4/.test(u)).join(', ') || 'keine');

const handyScrub = await c.js(`
  const h=document.getElementById('hero'), f=document.getElementById('film');
  const s=h.offsetHeight-innerHeight; const out=[];
  for (const p of [0.2,0.6]) {
    window.scrollTo({top:Math.round(s*p),behavior:'instant'});
    await new Promise(r=>setTimeout(r,1000));
    const echt = Math.min(1,Math.max(0,-h.getBoundingClientRect().top/s));
    out.push(Math.abs(f.currentTime - echt*f.duration));
  }
  return out;
`);
pruefe('Scrubbing laeuft auch im Hochformat',
       handyScrub.every(a => a < 0.35),
       'groesste Abweichung ' + Math.max(...handyScrub).toFixed(2) + 's');
pruefe('Kein Querschieben auf dem Handy', handy.quer);
await c.bild(`${AUS}/03-handy.jpg`);

console.log('\n=== 8. Reduzierte Bewegung, in beide Richtungen ===');
await c.groesse(1440, 900, false);

// Der wichtige Fall zuerst: die Seite wird BEREITS mit reduzierter Bewegung
// geoeffnet. Dann darf das Video gar nicht erst angefragt werden. Wer erst
// laedt und dann umschaltet, hat es laengst geholt, das sagt nichts aus.
await c.medien([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
const gefragt = [];
c.auf(d => {
  if (d.method === 'Network.requestWillBeSent') gefragt.push(d.params.request.url);
});
await c.senden('Network.enable');
await c.gehe(URL_BASIS);
await c.js(`await new Promise(r=>setTimeout(r,1500));`);
const medienAnfragen = gefragt.filter(u => /hero-scrub.*\.mp4|hero-poster\.jpg|hero-hoch-poster\.jpg/.test(u));
pruefe('Mit Reduced Motion geladen: keine Videoanfrage im Netz',
       medienAnfragen.length === 0,
       medienAnfragen.length ? medienAnfragen.join(' ') : 'null Anfragen');
const rm = await c.js(`
  return {
    ruheheroSichtbar: getComputedStyle(document.getElementById('ruhehero')).display !== 'none',
    videoSrc: document.getElementById('film').getAttribute('src'),
    gedeckFertig: document.getElementById('gedeck').hasAttribute('data-fertig'),
    wegVoll: getComputedStyle(document.getElementById('weg-linie')).strokeDashoffset,
    auftritteAlleAn: [...document.querySelectorAll('.auftritt')].every(e => e.classList.contains('in'))
  };
`);
pruefe('Reduced Motion zeigt den Static-Hero', rm.ruheheroSichtbar);
pruefe('Reduced Motion setzt keine Videoquelle', !rm.videoSrc);
pruefe('Reduced Motion zeigt weiterhin den Static-Hero statt der Fahrt', rm.ruheheroSichtbar);
pruefe('Gedeck steht bei Reduced Motion fertig da', rm.gedeckFertig);
pruefe('Alle Auftritte stehen im Endzustand', rm.auftritteAlleAn);
await c.bild(`${AUS}/04-reduced-motion.jpg`);

// Und wieder zurueck: das Umschalten mitten in der Sitzung ist die
// eigentliche Pruefung. Wer nur den Hero neu scharf schaltet und den Rest
// festgenagelt laesst, hat es halb repariert.
await c.medien([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
await c.js(`await new Promise(r=>setTimeout(r,800));`);
const zurueckRM = await c.js(`
  return {
    baenderDa: getComputedStyle(document.getElementById('baender')).display !== 'none',
    gedeckGeloest: !document.getElementById('gedeck').hasAttribute('data-fertig')
  };
`);
pruefe('Zurueckschalten schaltet die Baender wieder scharf', zurueckRM.baenderDa);
pruefe('Zurueckschalten loest auch das Gedeck wieder', zurueckRM.gedeckGeloest);

console.log('\n=== 9. Seite ohne Video ===');
await c.gehe(URL_BASIS);
await c.blocken(['*hero-scrub.mp4', '*hero-poster.jpg']);
await c.gehe(URL_BASIS);
await c.js(`await new Promise(r=>setTimeout(r,1200));`);
const ohne = await c.js(`
  const b = document.getElementById('buehne');
  return { filmAus: b.classList.contains('film-aus'),
           winkDa: getComputedStyle(document.getElementById('wink')).opacity,
           ringWeg: getComputedStyle(document.getElementById('ring')).opacity,
           band1: getComputedStyle(document.querySelector('.band')).opacity };
`);
pruefe('Ohne Video faellt die Seite sauber auf den Scrollhinweis zurueck',
       ohne.filmAus, `Wink ${ohne.winkDa}, Ring ${ohne.ringWeg}`);
pruefe('Die Baender tragen auch ohne Video', parseFloat(ohne.band1) > 0.9);
await c.bild(`${AUS}/05-ohne-video.jpg`);
await c.blocken([]);

console.log('\n=== 10. Konsole ===');
const echteFehler = konsole.filter(t => !/hero-scrub\.mp4|hero-poster\.jpg|ERR_BLOCKED/.test(t));
pruefe('Keine unerwarteten Konsolenfehler', echteFehler.length === 0,
       echteFehler.length ? echteFehler.slice(0, 3).join(' | ') : 'sauber');

console.log('\n============================================');
console.log(`  bestanden: ${gut.length}     durchgefallen: ${schlecht.length}`);
if (schlecht.length) { console.log('\n  Offen:'); schlecht.forEach(s => console.log('   - ' + s)); }
console.log('============================================\n');

c.schliessen();
process.exit(schlecht.length ? 1 : 0);
