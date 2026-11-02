// Google Apps Script — salva le iscrizioni nel foglio.
// 1) Apri il foglio -> Estensioni -> Apps Script, incolla questo codice.
// 2) Distribuisci -> Nuova distribuzione -> Tipo: App web
//    Esegui come: Me · Chi ha accesso: Chiunque. Copia l'URL (finisce con /exec).
// 3) Incolla l'URL in landing.js (SCRIPT_URL) e ricarica il sito su GitHub.
const SHEET_ID='1O2Ck9Va2nmOrey7XQNC9FnyRmQAns_d4RWcQtAzZ0S0';
function doPost(e){
  const sh=SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  if(sh.getLastRow()===0) sh.appendRow(['Data','Nome','Email','Consenso','Fonte']);
  const p=e.parameter||{};
  sh.appendRow([new Date(),p.nome||'',p.email||'',p.consenso||'',p.fonte||'']);
  return ContentService.createTextOutput('ok');
}
