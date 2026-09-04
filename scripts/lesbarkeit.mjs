/* Die Worst-Frame-Pruefung, auf der echt zusammengesetzten Seite.

   Nicht am Videobild plus Rechnung, sondern so, wie der Besucher es sieht:
   Die Schrift wird unsichtbar geschaltet, ohne dass sich das Layout aendert,
   dann wird die Seite fotografiert und im Kasten der Schrift der hellste
   Pixel gesucht. Damit sind alle Scrim-Ebenen und der Abfall des Verlaufs
   exakt mit gemessen. Die Methode ist streng, weil mit der Schrift auch ihr
   Schatten verschwindet, der in Wahrheit noch hilft.

   Aufruf:  node scripts/lesbarkeit.mjs
*/

import { verbinden } from './chrome.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const lauf = promisify(execFile);

const FFMPEG = '/opt/homebrew/bin/ffmpeg';
const TEXTFARBE = [0xF2, 0xE9, 0xD6];   // --kalk
const BODEN = 3.5;
const AUS = 'roh/lesbarkeit';

function leucht([r, g, b]) {
  const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

async function hellsterPixel(bild, kasten) {
  const { x, y, w, h } = kasten;
  const { stdout } = await lauf(FFMPEG, [
    '-v', 'error', '-i', bild,
    '-vf', `crop=${Math.round(w)}:${Math.round(h)}:${Math.round(x)}:${Math.round(y)}`,
    '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'
  ], { encoding: 'buffer', maxBuffer: 1 << 28 });
  const d = stdout;
  let besteL = 0, bestePx = null;
  for (let i = 0; i < d.length; i += 3) {
    const px = [d[i], d[i + 1], d[i + 2]];
    const L = leucht(px);
    if (L > besteL) { besteL = L; bestePx = px; }
  }
  return { L: besteL, px: bestePx };
}

const c = await verbinden();
await mkdir(AUS, { recursive: true });
await c.groesse(1440, 900, false);
await c.gehe('http://127.0.0.1:4331/');

// Auf das Video warten, sonst misst man gegen das Standbild.
await c.js(`
  for (let i=0;i<60;i++){
    const b=document.getElementById('buehne');
    if (b.classList.contains('film-bereit')||b.classList.contains('film-aus')) break;
    await new Promise(r=>setTimeout(r,500));
  }
`);

const baender = await c.js(`
  return [...document.querySelectorAll('.band')].map((b,i) => ({
    i, a: parseFloat(b.dataset.a), b: parseFloat(b.dataset.b)
  }));
`);

const tl = leucht(TEXTFARBE);
console.log('\nWorst-Frame-Pruefung, gemessen an der zusammengesetzten Seite');
console.log('Textfarbe --kalk #F2E9D6, Boden ' + BODEN + ':1\n');
console.log('Band  Stelle   hellster Pixel      Kontrast   Urteil');
console.log('-'.repeat(58));

const ergebnisse = [];
for (const b of baender) {
  // Drei Stellen im Band pruefen, nicht nur die Mitte: der schlimmste
  // Frame ist der, auf dem jemand mitten im Lesen steht.
  let schlimmster = { v: Infinity };
  for (const anteil of [0.25, 0.5, 0.8]) {
    const p = b.a + (b.b - b.a) * anteil;
    const kasten = await c.js(`
      const h = document.getElementById('hero');
      const strecke = h.offsetHeight - window.innerHeight;
      window.scrollTo({top: Math.round(strecke * ${p}), behavior:'instant'});
      await new Promise(r=>setTimeout(r,700));
      const band = document.querySelectorAll('.band')[${b.i}];
      // Schrift unsichtbar, Layout bleibt stehen.
      band.querySelectorAll('p').forEach(p => p.style.visibility = 'hidden');
      await new Promise(r=>setTimeout(r,120));
      // Die Huelle der echten Textzeilen, nicht der ganze Bandkasten.
      // Der Kasten hat Ecken, in denen der Verlauf laengst ausgelaufen ist,
      // dort steht aber gar keine Schrift.
      let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
      band.querySelectorAll('p').forEach(p => {
        const r = p.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) return;
        x0=Math.min(x0,r.left); y0=Math.min(y0,r.top);
        x1=Math.max(x1,r.right); y1=Math.max(y1,r.bottom);
      });
      const x=Math.max(0,x0), y=Math.max(0,y0);
      return { x, y, w: Math.min(x1-x0, innerWidth-x), h: Math.min(y1-y0, innerHeight-y) };
    `);
    const datei = `${AUS}/band${b.i + 1}-${Math.round(anteil * 100)}.jpg`;
    await c.bild(datei);
    await c.js(`document.querySelectorAll('.band')[${b.i}].querySelectorAll('p').forEach(p => p.style.visibility = '');`);

    const { L, px } = await hellsterPixel(datei, kasten);
    const hi = Math.max(tl, L), lo = Math.min(tl, L);
    const v = (hi + 0.05) / (lo + 0.05);
    if (v < schlimmster.v) schlimmster = { v, px, anteil, datei };
  }
  const ok = schlimmster.v >= BODEN;
  ergebnisse.push({ band: b.i + 1, v: schlimmster.v, ok });
  console.log(`  ${b.i + 1}   ${String(Math.round(schlimmster.anteil * 100)).padStart(3)}%   rgb(${schlimmster.px.join(',')})`.padEnd(38) +
              `${schlimmster.v.toFixed(2).padStart(6)}:1   ${ok ? 'ok' : 'DURCHGEFALLEN'}`);
}

const durch = ergebnisse.filter(e => !e.ok);
console.log('\n' + '='.repeat(58));
if (durch.length === 0) {
  const min = Math.min(...ergebnisse.map(e => e.v));
  console.log(`  Alle ${ergebnisse.length} Baender bestehen. Schwaechstes: ${min.toFixed(2)}:1`);
} else {
  console.log(`  ${durch.length} Band/Baender unter dem Boden:`);
  durch.forEach(d => console.log(`   Band ${d.band}: ${d.v.toFixed(2)}:1, Scrim vertiefen`));
}
console.log('='.repeat(58) + '\n');

c.schliessen();
process.exit(durch.length ? 1 : 0);
