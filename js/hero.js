/* ==========================================================================
   Xenios. Der Hero.

   Der Scrollfortschritt durch die angeheftete Strecke geht von 0 bis 1 und
   treibt die Zeit im Film. Jede Regel hier hat einen echten Fehler
   verhindert, keine ist Zierrat.
   ========================================================================== */

(function () {
  'use strict';

  var VIDEO_URL   = 'assets/video/hero-scrub.mp4';
  var POSTER_URL  = 'assets/video/hero-poster.jpg';
  var VIDEO_BYTES = 8540258;   // echte Dateigroesse, Rueckfall wenn Content-Length fehlt

  var hero    = document.getElementById('hero');
  var buehne  = document.getElementById('buehne');
  var film    = document.getElementById('film');
  var poster  = document.getElementById('poster');
  var ring    = document.getElementById('ring');
  var wink    = document.getElementById('wink');
  var baender = Array.prototype.slice.call(document.querySelectorAll('.band'));

  if (!hero || !film) return;

  /* ---------------------------------------------------------------------
     Die fuenf Bedingungen fuer den Static-Hero.
     Sie stehen zeichengenau genauso im Stylesheet. Weicht eine ab, laedt
     die eine Seite Dateien, die die andere versteckt.
     --------------------------------------------------------------------- */
  var GATES = [
    '(max-width: 720px)',
    '(orientation: portrait) and (max-width: 1024px)',
    '(orientation: portrait) and (pointer: coarse)',
    '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
    '(prefers-reduced-motion: reduce)'
  ];
  var MQLS = GATES.map(function (q) { return window.matchMedia(q); });

  /* ---------------------------------------------------------------------
     Text zerlegen. Einmal beim Laden, mit gesaetem Zufall, damit die
     Streuung bei jedem Aufruf identisch ist.
     --------------------------------------------------------------------- */
  function rng(seed) {
    var s = seed >>> 0;
    return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }

  function zerlegen(el, art, spread, seed) {
    var text = el.textContent;
    var lesbar = document.createElement('span');
    lesbar.className = 'nur-fuer-screenreader';
    lesbar.textContent = text;

    var sicht = document.createElement('span');
    sicht.setAttribute('aria-hidden', 'true');

    var betont = el.querySelector('.em');
    var betonter = betont ? betont.textContent.trim() : null;

    var r = rng(seed);
    var woerter = text.split(/(\s+)/);
    var zeichenGesamt = text.replace(/\s/g, '').length;
    var gezaehlt = 0;

    woerter.forEach(function (w) {
      if (/^\s+$/.test(w)) { sicht.appendChild(document.createTextNode(w)); return; }
      var ws = document.createElement('span');
      ws.className = 'w';
      if (betonter && betonter.indexOf(w.replace(/[.,]/g, '')) !== -1) ws.classList.add('em');

      if (art === 'raster') {
        w.split('').forEach(function (ch) {
          var cs = document.createElement('span');
          cs.className = 'c';
          cs.textContent = ch;
          // Schwelle in Leserichtung, plus eine Spur Zufall
          cs.style.setProperty('--th', (gezaehlt / zeichenGesamt * spread + r() * 0.06).toFixed(4));
          cs.style.setProperty('--jx', (-34 - r() * 26).toFixed(1) + 'px');
          ws.appendChild(cs);
          gezaehlt++;
        });
      } else {
        ws.textContent = w;
        ws.style.setProperty('--th', (r() * 0.34).toFixed(4));
      }
      sicht.appendChild(ws);
    });

    el.textContent = '';
    el.appendChild(lesbar);
    el.appendChild(sicht);
  }

  baender.forEach(function (b, i) {
    var art  = b.getAttribute('data-auftritt');
    var zeile = b.querySelector('.band__zeile');
    if (!zeile) return;

    if (art === 'schaerfe') {
      // Zwei Kopien, die weiche liegt als Pseudoelement darunter.
      // Der Weichzeichner ist statisch, animiert wird nur die Deckkraft:
      // filter selbst zu animieren ist nicht compositorfreundlich.
      zeile.setAttribute('data-echo', zeile.textContent);
    } else if (art === 'raster' || art === 'schlag' || art === 'ankunft') {
      var spread = parseFloat(b.getAttribute('data-spread') || '0.4');
      zerlegen(zeile, art, spread, 1981 + i * 97);
    }
  });

  /* ---------------------------------------------------------------------
     Bandzustaende. Jedes Band merkt sich seinen letzten Wert, damit nur
     bei echter Aenderung ins DOM geschrieben wird. Pro Bild alles neu zu
     setzen ist die zweite Haelfte von ruckeligem Scrollen.
     --------------------------------------------------------------------- */
  var bandInfo = baender.map(function (b) {
    return {
      el: b,
      a: parseFloat(b.getAttribute('data-a')),
      b: parseFloat(b.getAttribute('data-b')),
      ramp: b.hasAttribute('data-ramp') ? parseFloat(b.getAttribute('data-ramp')) : null,
      op: -1,
      k: -1
    };
  });

  function smoothstep(p, e0, e1) {
    var t = Math.min(1, Math.max(0, (p - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  }
  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

  // Band 1 bekommt beim Laden einmalig eine zeitliche Rampe und uebergibt
  // dann an den Scroll. Ohne sie oeffnet der Hero auf Film ohne Worte.
  var ladeK = 0, ladeStart = 0;

  function baenderSetzen(p) {
    for (var i = 0; i < bandInfo.length; i++) {
      var bi = bandInfo[i];
      var f = Math.min(0.02, (bi.b - bi.a) / 3);

      // Das erste Band laesst die Einblendrampe weg, das letzte die
      // Ausblendrampe, damit die Reise gesetzt beginnt und gesetzt endet.
      var ein = (i === 0) ? 1 : smoothstep(p, bi.a, bi.a + f);
      var aus = (i === bandInfo.length - 1) ? 0 : smoothstep(p, bi.b - f, bi.b);
      var op = ein * (1 - aus);

      var rampe = bi.ramp || Math.min(0.025, (bi.b - bi.a) * 0.35);
      var k = clamp((p - bi.a) / rampe, 0, 1);
      if (i === 0) k = Math.max(k, ladeK);

      if (Math.abs(op - bi.op) > 0.004) {
        bi.op = op;
        bi.el.style.opacity = op.toFixed(3);
      }
      if (Math.abs(k - bi.k) > 0.008) {
        bi.k = k;
        bi.el.style.setProperty('--k', k.toFixed(3));
      }
    }
  }

  /* ---------------------------------------------------------------------
     Die Seeks gaten. Nie in currentTime schreiben, solange noch ein Seek
     laeuft. Ungegatete Seeks stapeln sich, und genau das ist in Chrome
     der Unterschied zwischen weich und ruckelig.
     --------------------------------------------------------------------- */
  var seekBesetzt = false;
  var seekOffen = null;

  function seekAnfordern(t) {
    if (!film.duration) return;
    if (seekBesetzt) { seekOffen = t; return; }
    seekBesetzt = true;
    try { film.currentTime = t; } catch (e) { seekBesetzt = false; }
  }
  film.addEventListener('seeked', function () {
    seekBesetzt = false;
    if (seekOffen !== null) { var t = seekOffen; seekOffen = null; seekAnfordern(t); }
  });
  // Der Ausgang aus der Klemme: ohne das bliebe das Gate nach einem
  // Fehler fuer immer besetzt und das Scrubbing stuende still.
  film.addEventListener('error', function () {
    seekBesetzt = false; seekOffen = null; filmFehlt();
  });

  /* ---------------------------------------------------------------------
     Die Schleife. Sie interpoliert weich und kommt zur Ruhe. Der Exponent
     normalisiert auf 60 Bilder je Sekunde, sonst faehrt ein 120-Hz-Schirm
     doppelt so schnell ein und die Seite fuehlt sich je Rechner anders an.
     --------------------------------------------------------------------- */
  var ziel = 0, gezeigt = 0, rafId = null, letzterTick = 0;
  var heroSichtbar = true, scrubAn = false;

  function fortschritt() {
    var r = hero.getBoundingClientRect();
    var strecke = hero.offsetHeight - window.innerHeight;
    if (strecke <= 0) return 0;
    return clamp(-r.top / strecke, 0, 1);
  }

  function tick(now) {
    var dt = Math.min(100, now - (letzterTick || now));
    letzterTick = now;
    var k = 0.16;
    gezeigt += (ziel - gezeigt) * (1 - Math.pow(1 - k, dt / 16.667));

    if (ladeK < 1 && ladeStart) {
      ladeK = clamp((now - ladeStart) / 900, 0, 1);
    }

    var fertig = Math.abs(ziel - gezeigt) < 0.0005 && ladeK >= 1;
    if (fertig) { gezeigt = ziel; rafId = null; letzterTick = 0; }
    else { rafId = requestAnimationFrame(tick); }

    if (film.duration) seekAnfordern(gezeigt * film.duration);
    baenderSetzen(gezeigt);
  }

  function anstossen() {
    if (rafId === null && heroSichtbar && scrubAn) {
      letzterTick = 0;
      rafId = requestAnimationFrame(tick);
    }
  }
  function beiScroll() { ziel = fortschritt(); anstossen(); }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (eintraege) {
      heroSichtbar = eintraege[0].isIntersecting;
      if (heroSichtbar) anstossen();
    }, { rootMargin: '10% 0px' }).observe(hero);
  }

  /* ---------------------------------------------------------------------
     Das Video als Blob holen.
     Viele Hoster koennen keine Teilabrufe. Ohne die klemmt jeder Seek auf
     null, und zwar nur live, lokal laeuft es. Also die ganze Datei holen
     und die Objekt-URL abspielen, das geht ueberall.
     Das Standbild gewinnt das Rennen um die Bandbreite mit Absicht.
     --------------------------------------------------------------------- */
  var gestartet = false;

  function heroEinmalStarten() {
    if (gestartet) return;
    gestartet = true;

    poster.style.backgroundImage = "url('" + POSTER_URL + "')";

    var los = false;
    function blobStarten() { if (los) return; los = true; blobHolen().catch(filmFehlt); }

    var vorschau = new Image();
    vorschau.onload = blobStarten;
    vorschau.onerror = blobStarten;
    vorschau.src = POSTER_URL;
    setTimeout(blobStarten, 4000);   // ein haengendes Standbild darf den Film nie ewig blocken

    ladeStart = performance.now();
    anstossen();
  }

  function blobHolen() {
    var ctrl = new AbortController();
    var wachhund = setTimeout(function () { ctrl.abort(); }, 20000);

    return fetch(VIDEO_URL, { priority: 'low', signal: ctrl.signal }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var gesamt = Number(res.headers.get('Content-Length')) || VIDEO_BYTES;
      var leser = res.body.getReader();
      var teile = [], hab = 0, letzterRing = 0;

      function weiter() {
        return leser.read().then(function (r) {
          if (r.done) return;
          clearTimeout(wachhund);
          // Der Wachhund wird bei jedem Stueck neu gespannt: zwanzig
          // Sekunden ohne Fortschritt brechen ab. Ein ewig haengender
          // Ring ist schlimmer als gar keiner.
          wachhund = setTimeout(function () { ctrl.abort(); }, 20000);
          teile.push(r.value);
          hab += r.value.length;
          var anteil = Math.min(1, hab / gesamt);
          var jetzt = performance.now();
          if (jetzt - letzterRing > 100 || anteil === 1) {
            letzterRing = jetzt;
            ring.style.setProperty('--ld', Math.round(126 * (1 - anteil)));
          }
          return weiter();
        });
      }

      return weiter().then(function () {
        clearTimeout(wachhund);
        ring.style.setProperty('--ld', 0);
        film.src = URL.createObjectURL(new Blob(teile, { type: 'video/mp4' }));
        film.load();
        film.addEventListener('canplay', function () {
          seekAnfordern(fortschritt() * film.duration);
          buehne.classList.add('film-bereit');
        }, { once: true });
      });
    });
  }

  function filmFehlt() {
    // Kein steckengebliebener Ring, sondern ein ehrlicher Scrollhinweis.
    // Die Seite bleibt vollstaendig, das Standbild traegt die ganze Reise.
    buehne.classList.add('film-aus');
  }

  /* ---------------------------------------------------------------------
     Die fuenf Bedingungen leben. Sie werden nicht einmal beim Laden
     geprueft, sondern an Change-Listener gehaengt: Ein gedrehtes Tablet,
     ein aufgezogenes Fenster oder ein umgelegter Bewegungsschalter
     laesst das Stylesheet die Buehne wieder zeigen, und ohne das hier
     stuende dort nichts.
     --------------------------------------------------------------------- */
  function scrubAn_() {
    if (scrubAn) return;
    scrubAn = true;
    heroEinmalStarten();
    window.addEventListener('scroll', beiScroll, { passive: true });
    window.addEventListener('resize', beiScroll, { passive: true });
    bandInfo.forEach(function (bi) { bi.op = -1; bi.k = -1; });   // Zwischenspeicher leeren
    festsetzenLoesen();
    ziel = fortschritt();
    baenderSetzen(ziel);
    beiScroll();                                                 // Frame auf die Scrollstelle ziehen
  }
  function scrubAus_() {
    if (!scrubAn) return;
    scrubAn = false;
    window.removeEventListener('scroll', beiScroll);
    window.removeEventListener('resize', beiScroll);
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  }
  function heroModus() {
    var still = MQLS.some(function (m) { return m.matches; });
    if (still) scrubAus_(); else scrubAn_();
  }
  MQLS.forEach(function (m) {
    if (m.addEventListener) m.addEventListener('change', heroModus);
    else m.addListener(heroModus);
  });

  /* Reduzierte Bewegung wird in BEIDE Richtungen befolgt. Beim Einschalten
     werden alle scrollgetriebenen Elemente auf ihren Endzustand gesetzt und
     die Antriebe angehalten. Beim Ausschalten wird alles wieder geloest,
     sonst bleibt die halbe Seite festgenagelt zurueck.                    */
  var reduziert = window.matchMedia('(prefers-reduced-motion: reduce)');
  function beiReduziert(e) {
    if (e.matches) { auf.Endzustaende(); }
    else { heroModus(); }
  }
  var auf = {
    Endzustaende: function () {
      scrubAus_();
      document.querySelectorAll('.auftritt').forEach(function (el) {
        el.classList.add('in', 'fertig');
      });
      document.dispatchEvent(new CustomEvent('xenios:festsetzen'));
    }
  };
  function festsetzenLoesen() {
    document.dispatchEvent(new CustomEvent('xenios:loesen'));
  }
  if (reduziert.addEventListener) reduziert.addEventListener('change', beiReduziert);
  else reduziert.addListener(beiReduziert);

  heroModus();

  // Alles anhalten, wenn der Tab weg ist.
  document.addEventListener('visibilitychange', function () {
    document.body.classList.toggle('pausiert', document.hidden);
  });

})();
