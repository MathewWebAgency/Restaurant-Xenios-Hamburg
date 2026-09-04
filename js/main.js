/* ==========================================================================
   Xenios. Die Seite unter dem Hero.
   Auftritte, der heutige Tag, die Zahlen, das Gedeck, das Formular.
   ========================================================================== */

(function () {
  'use strict';

  var reduziert = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------------------------------------------------------------------
     Auftritte. Ein Auftritt pro Moment, nicht ein Effekt pro Element.
     Nach dem Auftritt werden die Staffelverzoegerungen zurueckgenommen,
     sonst haengt jeder spaetere Hover genau um diese Staffelung hinterher.
     --------------------------------------------------------------------- */
  var gruppen = document.querySelectorAll(
    '.haus__innen, .brot__kopf, .dreier, .karte__kopf, .keller__innen,' +
    '.tisch__text, .zeiten__innen, .platz__links, .platz__rechts'
  );
  Array.prototype.forEach.call(gruppen, function (g) { g.classList.add('auftritt'); });

  if ('IntersectionObserver' in window && !reduziert.matches) {
    var beobachter = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        beobachter.unobserve(e.target);
        // Aufraeumen, sobald der letzte Uebergang wirklich durch ist.
        setTimeout(function () { e.target.classList.add('fertig'); }, 900);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(gruppen, function (g) { beobachter.observe(g); });

    /* Nachzuegler einsammeln.
       Ein Sprung ueber eine Sektion hinweg, etwa ueber einen Anker im Menue,
       kann den Beobachter ueberspringen: Der Zustand wechselt von "noch
       darunter" direkt auf "schon darueber", beide Male ohne Schnittmenge,
       also meldet er gar nichts. Die Sektion bliebe dann fuer immer
       unsichtbar. Wer schon daran vorbei ist, bekommt den Endzustand
       deshalb sofort und ohne Bewegung. */
    var offen = false;
    function nachzuegler() {
      offen = false;
      Array.prototype.forEach.call(gruppen, function (g) {
        if (g.classList.contains('in')) return;
        if (g.getBoundingClientRect().bottom < 0) {
          g.classList.add('in', 'fertig');
          beobachter.unobserve(g);
        }
      });
    }
    window.addEventListener('scroll', function () {
      if (offen) return;
      offen = true;
      requestAnimationFrame(nachzuegler);
    }, { passive: true });
    window.addEventListener('hashchange', function () { setTimeout(nachzuegler, 60); });
  } else {
    Array.prototype.forEach.call(gruppen, function (g) { g.classList.add('in', 'fertig'); });
  }

  /* Der Anfangszustand muss mitgesetzt werden. Wird die Seite in einem
     Hintergrundtab geladen, feuert visibilitychange nie, und die Schleifen
     liefen dort ungebremst weiter. */
  document.body.classList.toggle('pausiert', document.hidden);

  /* ---------------------------------------------------------------------
     Der heutige Tag in der Wochentabelle.
     Die Marke ist ein eigener Strich und nicht nur eine Farbe, damit sie
     auch ohne Farbwahrnehmung ankommt.
     --------------------------------------------------------------------- */
  var heute = new Date().getDay();
  var zeile = document.querySelector('.woche tr[data-tag="' + heute + '"]');
  if (zeile) {
    zeile.setAttribute('data-heute', '');
    var th = zeile.querySelector('th');
    if (th) {
      var hinweis = document.createElement('span');
      hinweis.className = 'nur-fuer-screenreader';
      hinweis.textContent = ' (heute)';
      th.appendChild(hinweis);
    }
  }

  /* ---------------------------------------------------------------------
     Der Kopf dreht um, sobald die Seite hell wird.
     --------------------------------------------------------------------- */
  var hero = document.getElementById('hero');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      document.body.classList.toggle('kopf-hell', !e[0].isIntersecting);
    }, { rootMargin: '-64px 0px 0px 0px' }).observe(hero);
  }

  /* ---------------------------------------------------------------------
     Die Zahlen im Keller. Sie zaehlen einmal hoch, wenn sie ins Bild
     kommen, gedrosselt und nur bei echter Aenderung geschrieben.
     --------------------------------------------------------------------- */
  function zaehlen(el) {
    var ziel = parseInt(el.getAttribute('data-zaehler'), 10);
    if (reduziert.matches) { el.textContent = ziel; return; }
    var start = null, letzter = -1, letzteZeit = 0;
    function schritt(now) {
      if (start === null) start = now;
      var p = Math.min(1, (now - start) / 1100);
      var e = 1 - Math.pow(1 - p, 3);
      var wert = Math.round(e * ziel);
      if (wert !== letzter && now - letzteZeit > 60) {
        letzter = wert; letzteZeit = now;
        el.textContent = wert;
      }
      if (p < 1) requestAnimationFrame(schritt);
      else el.textContent = ziel;
    }
    requestAnimationFrame(schritt);
  }

  var ziffern = document.querySelectorAll('[data-zaehler]');
  if ('IntersectionObserver' in window) {
    var zb = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (!e.isIntersecting) return;
        zaehlen(e.target); zb.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(ziffern, function (z) { zb.observe(z); });
  }

  /* ---------------------------------------------------------------------
     DAS GEDECK. Der eine Mitmach-Moment.
     Der Besucher haelt gedrueckt und deckt den letzten Platz ein. Laesst
     er zu frueh los, faehrt der Fortschritt weich zurueck, nie mit einem
     Sprung. Ist gedeckt, geht die Reservierung daneben an.
     --------------------------------------------------------------------- */
  var gedeck  = document.getElementById('gedeck');
  var knopf   = document.getElementById('gedeck-knopf');
  var rechts  = document.querySelector('.platz__rechts');
  var label   = knopf ? knopf.querySelector('.gedeck__label') : null;

  if (gedeck && knopf && rechts) {
    var f = 0, haelt = false, gRaf = null, gLetzt = 0, fertig = false;
    var DAUER = 1600;   // Millisekunden bis gedeckt

    function stufeSetzen() {
      var stufe = f <= 0.02 ? 0 : Math.min(4, Math.floor(f * 4) + 1);
      if (gedeck.getAttribute('data-stufe') !== String(stufe)) {
        gedeck.setAttribute('data-stufe', stufe);
      }
      knopf.style.setProperty('--f', f.toFixed(3));
    }

    function gTick(now) {
      var dt = Math.min(100, now - (gLetzt || now));
      gLetzt = now;
      if (haelt) f += dt / DAUER;
      else f -= dt / (DAUER * 0.7);       // zurueck, aber weich
      f = Math.min(1, Math.max(0, f));
      stufeSetzen();

      if (f >= 1 && !fertig) {
        fertig = true;
        gedeck.setAttribute('data-fertig', '');
        rechts.classList.add('an');
        if (label) label.textContent = 'Gedeckt';
        knopf.setAttribute('aria-disabled', 'true');
      }
      if ((haelt && f < 1) || (!haelt && f > 0)) gRaf = requestAnimationFrame(gTick);
      else { gRaf = null; gLetzt = 0; }
    }

    function anstoss() { if (gRaf === null) { gLetzt = 0; gRaf = requestAnimationFrame(gTick); } }
    function los()  { if (fertig) return; haelt = true;  anstoss(); }
    function ende() { if (fertig) return; haelt = false; anstoss(); }

    knopf.addEventListener('pointerdown', function (e) { e.preventDefault(); los(); });
    knopf.addEventListener('pointerup', ende);
    knopf.addEventListener('pointercancel', ende);
    knopf.addEventListener('pointerleave', ende);
    // Tastatur: Leertaste und Enter halten genauso.
    knopf.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); los(); }
    });
    knopf.addEventListener('keyup', function (e) {
      if (e.key === ' ' || e.key === 'Enter') ende();
    });

    function gedeckFertigSofort() {
      haelt = false; fertig = true; f = 1;
      if (gRaf !== null) { cancelAnimationFrame(gRaf); gRaf = null; }
      gedeck.setAttribute('data-stufe', '4');
      gedeck.setAttribute('data-fertig', '');
      knopf.style.setProperty('--f', '1');
      rechts.classList.add('an');
      if (label) label.textContent = 'Gedeckt';
    }
    function gedeckLoesen() {
      if (!reduziert.matches) {
        fertig = false; f = 0;
        gedeck.removeAttribute('data-fertig');
        gedeck.setAttribute('data-stufe', '0');
        knopf.style.setProperty('--f', '0');
        knopf.removeAttribute('aria-disabled');
        rechts.classList.remove('an');
        if (label) label.textContent = 'Gedrückt halten';
      }
    }

    // Bei reduzierter Bewegung steht der Endzustand sofort da, ohne Halten.
    if (reduziert.matches) gedeckFertigSofort();
    document.addEventListener('xenios:festsetzen', gedeckFertigSofort);
    document.addEventListener('xenios:loesen', gedeckLoesen);
  }

  /* ---------------------------------------------------------------------
     Das Formular. Es gibt kein Backend, also baut es eine mailto-Nachricht
     und oeffnet das Mailprogramm des Besuchers. Der Erfolgstext sagt genau
     das, nichts anderes waere die Wahrheit.
     --------------------------------------------------------------------- */
  var formular = document.getElementById('formular');
  var status   = document.getElementById('formular-status');

  if (formular && status) {
    formular.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(formular);
      var name     = (d.get('name') || '').toString().trim();
      var personen = (d.get('personen') || '').toString().trim();
      var zeit     = (d.get('zeit') || '').toString().trim();
      var text     = (d.get('text') || '').toString().trim();

      if (!name || !personen || !zeit) {
        status.textContent = 'Bitte Name, Personen und Wunschzeit ausfüllen.';
        var fehlt = !name ? 'f-name' : (!personen ? 'f-personen' : 'f-zeit');
        var el = document.getElementById(fehlt);
        if (el) el.focus();
        return;
      }

      var betreff = 'Tischanfrage: ' + personen + ' Personen, ' + zeit;
      var koerper =
        'Guten Tag,\n\nich hätte gern einen Tisch.\n\n' +
        'Name: ' + name + '\n' +
        'Personen: ' + personen + '\n' +
        'Wunschzeit: ' + zeit + '\n' +
        (text ? '\n' + text + '\n' : '') +
        '\nViele Grüße\n' + name;

      window.location.href = 'mailto:info@bei-themi.de'
        + '?subject=' + encodeURIComponent(betreff)
        + '&body=' + encodeURIComponent(koerper);

      status.textContent = 'Ihr Mailprogramm ist offen. Schicken Sie die Nachricht ab, wir melden uns.';
    });
  }

})();

/* ==========================================================================
   Die Linie der Ankunft.
   Zeichnet sich ueber die helle Haelfte der Seite selbst. Geschrieben wird
   nur bei echter Aenderung, und die Schleife laeuft nicht frei mit.
   ========================================================================== */
(function () {
  'use strict';
  var weg = document.getElementById('weg');
  var knoten = document.querySelectorAll('#weg-knoten circle');
  if (!weg || !knoten.length) return;

  var reduziert = window.matchMedia('(prefers-reduced-motion: reduce)');
  var letzterP = -1, offen = false;

  function anfang() {
    var h = document.getElementById('hero');
    return h ? h.offsetHeight : 0;
  }

  function messen() {
    offen = false;
    var start = anfang();
    var ende = document.body.scrollHeight - window.innerHeight;
    var strecke = ende - start;
    if (strecke <= 0) return;
    var p = Math.min(1, Math.max(0, (window.scrollY - start) / strecke));
    if (Math.abs(p - letzterP) < 0.004) return;
    letzterP = p;
    weg.style.setProperty('--wp', p.toFixed(3));
    for (var i = 0; i < knoten.length; i++) {
      var an = p >= (parseFloat(knoten[i].getAttribute('cy')) / 1000);
      if (an !== knoten[i].classList.contains('an')) knoten[i].classList.toggle('an', an);
    }
  }

  function beiScroll() {
    if (offen) return;
    offen = true;
    requestAnimationFrame(messen);
  }

  if (reduziert.matches) {
    weg.style.setProperty('--wp', '1');
    Array.prototype.forEach.call(knoten, function (k) { k.classList.add('an'); });
  } else {
    window.addEventListener('scroll', beiScroll, { passive: true });
    window.addEventListener('resize', beiScroll, { passive: true });
    messen();
  }
})();
