/* Laeuft ohne defer, also vor dem ersten Anstrich.
   Setzt die Klasse, solange noch nichts gezeichnet ist. Lag das inline
   im Kopf, blockte die Content-Security-Policy es live weg, und der
   Auftritt sprang einmal fertig und dann zurueck. Deshalb eine Datei. */
document.documentElement.classList.add('js-bereit');
