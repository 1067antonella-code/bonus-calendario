# Diario dell'attesa — landing "Sblocca bonus" + web app
- `index.html` landing: nome/email -> sblocca -> diario interattivo, PDF, cartella Drive.
- `diario.html` web app (25 carte 3D, albero delle luci, badge, stampa).
- `apps-script.gs` codice da incollare in Google Apps Script per salvare le email nel foglio; poi metti l'URL in `landing.js` (SCRIPT_URL).

Pubblicazione: carica tutto su GitHub (con le cartelle img, pdf, print), poi importa il repository su Vercel (framework Other, nessun build).
