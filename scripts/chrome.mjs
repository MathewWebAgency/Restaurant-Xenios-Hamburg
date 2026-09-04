/* Steuert das installierte Chrome headless ueber das DevTools-Protokoll.
   Braucht keine Pakete: Node ab 22 bringt WebSocket global mit.
   Grund: die eingebaute Vorschau komponiert nicht, dort steht
   requestAnimationFrame still und CSS-Uebergaenge frieren mitten drin ein.
   Nur ein echter Browser kann Touch, Reduced Motion live, geblockte URLs
   und einen echten Mausdruck mit Pause pruefen. */

let id = 0;
const warten = new Map();

export async function verbinden(port = 9222) {
  const liste = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const ziel = liste.find(t => t.type === 'page');
  if (!ziel) throw new Error('keine Seite in Chrome gefunden');
  const ws = new WebSocket(ziel.webSocketDebuggerUrl);
  await new Promise((ok, fehler) => { ws.onopen = ok; ws.onerror = fehler; });

  const zuhoerer = [];
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && warten.has(d.id)) {
      const { ok, fehler } = warten.get(d.id); warten.delete(d.id);
      d.error ? fehler(new Error(d.error.message)) : ok(d.result);
    } else if (d.method) {
      zuhoerer.forEach(f => f(d));
    }
  };

  const senden = (method, params = {}) => new Promise((ok, fehler) => {
    const n = ++id;
    warten.set(n, { ok, fehler });
    ws.send(JSON.stringify({ id: n, method, params }));
  });

  return {
    senden,
    auf: (f) => zuhoerer.push(f),
    schliessen: () => ws.close(),

    async gehe(url) {
      await senden('Page.enable');
      await senden('Runtime.enable');
      const fertig = new Promise(ok => {
        const f = (d) => { if (d.method === 'Page.loadEventFired') ok(); };
        zuhoerer.push(f);
      });
      await senden('Page.navigate', { url });
      await fertig;
      await new Promise(r => setTimeout(r, 400));
    },

    async js(ausdruck) {
      const r = await senden('Runtime.evaluate', {
        expression: `(async () => { ${ausdruck} })()`,
        awaitPromise: true, returnByValue: true
      });
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' ' +
        (r.exceptionDetails.exception?.description || ''));
      return r.result.value;
    },

    async bild(pfad, opts = {}) {
      const r = await senden('Page.captureScreenshot', { format: 'jpeg', quality: 82, ...opts });
      const fs = await import('node:fs/promises');
      await fs.writeFile(pfad, Buffer.from(r.data, 'base64'));
      return pfad;
    },

    async groesse(w, h, mobil = false) {
      await senden('Emulation.setDeviceMetricsOverride', {
        width: w, height: h, deviceScaleFactor: 1, mobile: mobil
      });
      // maxTouchPoints 0 wird abgelehnt, also immer 5 senden und ueber
      // enabled steuern.
      await senden('Emulation.setTouchEmulationEnabled', { enabled: mobil, maxTouchPoints: 5 });
    },

    async medien(merkmale) {
      await senden('Emulation.setEmulatedMedia', { features: merkmale });
    },

    async blocken(muster) {
      await senden('Network.enable');
      await senden('Network.setBlockedURLs', { urls: muster });
    },

    async maus(typ, x, y, knopf = 'left') {
      await senden('Input.dispatchMouseEvent', {
        type: typ, x, y, button: knopf, clickCount: typ === 'mouseReleased' ? 1 : 1,
        buttons: typ === 'mouseReleased' ? 0 : 1
      });
    },

    async scrolle(y) {
      await this.js(`window.scrollTo({top:${y},behavior:'instant'}); await new Promise(r=>setTimeout(r,${y > 2000 ? 500 : 250}));`);
    }
  };
}
