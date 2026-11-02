(()=>{
const KINDS={color:['Da colorare','🎨'],maze:['Labirinto','🧭'],dots:['Unisci i puntini','✨'],words:['Cerca le parole','🔤'],sym:['Simmetria','❄️'],write:['Scrivi e disegna','✏️'],cal:['Calendario','📅']};
const BADGES=[
{id:'first',n:'Prima porticina',i:'🚪',d:'Il primo gioco fatto',f:s=>s.size>=1},
{id:'col',n:'Piccolo artista',i:'🎨',d:'Tutte le pagine da colorare',f:s=>kc(s,'color')},
{id:'maze',n:'Esploratore',i:'🧭',d:'Tutti i labirinti',f:s=>kc(s,'maze')},
{id:'dots',n:'Stellina',i:'⭐',d:'Tutti i puntini uniti',f:s=>kc(s,'dots')},
{id:'words',n:'Detective di parole',i:'🔎',d:'Tutte le ricerche di parole',f:s=>kc(s,'words')},
{id:'sym',n:'Maestro di neve',i:'❄️',d:'Tutte le simmetrie',f:s=>kc(s,'sym')},
{id:'write',n:'Scrittore',i:'✒️',d:'Tutte le pagine da scrivere',f:s=>kc(s,'write')},
{id:'h',n:'Metà strada',i:'🛷',d:'12 giochi fatti',f:s=>s.size>=12},
{id:'t',n:'Quasi arrivati',i:'🔔',d:'20 giochi fatti',f:s=>s.size>=20},
{id:'all',n:'Magia di Natale',i:'🎄',d:'Tutti i 25 giochi',f:s=>s.size>=25}];
const D=window.DAYS,$=q=>document.querySelector(q);
let st={done:[],badges:[]};
try{st=Object.assign(st,JSON.parse(localStorage.getItem('diario')||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem('diario',JSON.stringify(st))}catch(e){}};
const S=()=>new Set(st.done);
function kc(s,k){return D.filter(x=>x.k===k).every(x=>s.has(x.d))}
const pad=n=>String(n).padStart(2,'0');
let filter='all';const fl2=new Set();
function filters(){const f=$('#filters');f.innerHTML='';[['all','Tutti']].concat(Object.entries(KINDS).map(([k,v])=>[k,v[1]+' '+v[0]])).forEach(([k,l])=>{const b=document.createElement('button');b.className='chip'+(k===filter?' on':'');b.textContent=l;b.onclick=()=>{filter=k;filters();grid()};f.appendChild(b)})}
function grid(){const g=$('#grid'),s=S();g.innerHTML='';D.filter(x=>filter==='all'||x.k===filter).forEach(x=>{
 const c=document.createElement('div');c.className='card'+(s.has(x.d)?' done':'')+(fl2.has(x.d)?' flip':'');c.tabIndex=0;c.setAttribute('role','button');
 c.innerHTML=`<div class="face front"><img loading="lazy" src="img/t${pad(x.d)}.jpg" alt=""><span class="num">${x.d}</span><b>${x.t}</b></div>
 <div class="face back"><small>${x.f}</small><strong>${x.t}</strong><div>${KINDS[x.k][1]} ${KINDS[x.k][0]}</div><button class="b" data-a="open">Apri la scheda</button><button class="b ${s.has(x.d)?'done':''}" data-a="done">${s.has(x.d)?'✓ Fatto':'Fatto!'}</button></div>`;
 c.onclick=e=>{c.style.setProperty('--ry','0deg');c.style.setProperty('--rx','0deg');const a=e.target.dataset.a;if(a==='open'){open(x)}else if(a==='done'){toggle(x.d)}else{c.classList.toggle('flip');c.classList.contains('flip')?fl2.add(x.d):fl2.delete(x.d)}};
 c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();c.classList.toggle('flip');c.classList.contains('flip')?fl2.add(x.d):fl2.delete(x.d)}};
 tilt(c);g.appendChild(c)})}
function tilt(el){el.addEventListener('pointermove',e=>{if(el.classList.contains('flip')||e.pointerType==='touch')return;const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.setProperty('--ry',(x*18)+'deg');el.style.setProperty('--rx',(-y*18)+'deg')});el.addEventListener('pointerleave',()=>{el.style.setProperty('--ry','0deg');el.style.setProperty('--rx','0deg')})}
function shelf(newIds=[]){const sh=$('#shelf');sh.innerHTML='';BADGES.forEach(b=>{const u=st.badges.includes(b.id),e=document.createElement('div');e.className='badge'+(u?'':' lock')+(newIds.includes(b.id)?' new':'');
 e.innerHTML=`<div class="medal"><span>${u?b.i:'🔒'}</span></div><b>${b.n}</b><small>${b.d}</small>`;tilt3(e);sh.appendChild(e)})}
function tilt3(el){el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`rotateY(${x*50}deg) rotateX(${-y*40}deg)`});el.addEventListener('pointerleave',()=>el.style.transform='')}
function prog(){const n=st.done.length;$('#barfill').style.width=n/25*100+'%';$('#proglbl').textContent=`${n} di 25 giochi fatti`}
function toggle(d){const s=S();s.has(d)?s.delete(d):s.add(d);st.done=[...s];const fresh=[];BADGES.forEach(b=>{if(b.f(s)&&!st.badges.includes(b.id)){st.badges.push(b.id);fresh.push(b)}});save();grid();shelf(fresh.map(b=>b.id));prog();lights();upd();
 if(fresh.length){toast('🏅 Nuovo badge: '+fresh.map(b=>b.n).join(', '));confetti()}}
let cur=null;
function open(x){cur=x;$('#mimg').src=`img/p-${pad(x.d+2)}.jpg`;$('#mimg').alt=`Scheda del giorno ${x.d}`;$('#mt').textContent=`${x.d} dicembre · ${x.t}`;$('#mdl').href=`pdf/giorno-${pad(x.d)}.pdf`;upd();$('#modal').hidden=false}
function upd(){if(!cur)return;const on=S().has(cur.d),b=$('#mdone');b.textContent=on?'✓ Fatto (annulla)':'Fatto!';b.classList.toggle('on',on)}
$('#mx').onclick=()=>$('#modal').hidden=true;$('#modal').onclick=e=>{if(e.target.id==='modal')$('#modal').hidden=true};
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#modal').hidden=true});
$('#mdone').onclick=()=>toggle(cur.d);
$('#mprint').onclick=()=>printPage(`print/p-${pad(cur.d+2)}.jpg`);
function printPage(src){const f=document.createElement('iframe');f.style.cssText='position:fixed;width:0;height:0;border:0';document.body.appendChild(f);
 f.contentDocument.write(`<!doctype html><title>Stampa</title><style>@page{size:A4;margin:0}html,body{margin:0}img{width:210mm;height:297mm;display:block}</style><img src="${src}">`);f.contentDocument.close();
 const im=f.contentDocument.querySelector('img');const go=()=>{f.contentWindow.focus();f.contentWindow.print();setTimeout(()=>f.remove(),3000)};im.complete?go():im.onload=go}
document.addEventListener('click',e=>{const p=e.target.closest('[data-print]');if(!p)return;const u=p.dataset.print;
 if(u.endsWith('soluzioni.pdf')){const w=window.open(u);}else{window.open(u)}toast('Si apre il PDF: premi Stampa dal visualizzatore')});
$('#reset').onclick=()=>{if(confirm('Vuoi azzerare tutti i progressi e i badge?')){st={done:[],badges:[]};save();grid();shelf();prog();lights()}};
function toast(m){const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(t._t);t._t=setTimeout(()=>t.hidden=true,3500)}
// libro 3D
const book=$('#book');if(book){addEventListener('pointermove',e=>{const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;book.style.transform=`rotateY(${-22+x*30}deg) rotateX(${6-y*20}deg)`})}
// neve
const sc=$('#snow'),sx=sc.getContext('2d');let fl=[];function rs(){sc.width=innerWidth;sc.height=innerHeight;fl=Array.from({length:Math.min(90,innerWidth/12)},()=>({x:Math.random()*sc.width,y:Math.random()*sc.height,r:1+Math.random()*3,v:.3+Math.random()*.9,o:Math.random()*6}))}
rs();addEventListener('resize',rs);
if(!matchMedia('(prefers-reduced-motion:reduce)').matches)(function loop(){sx.clearRect(0,0,sc.width,sc.height);sx.fillStyle='#ffffffcc';fl.forEach(f=>{f.y+=f.v;f.o+=.01;f.x+=Math.sin(f.o)*.4;if(f.y>sc.height){f.y=-5;f.x=Math.random()*sc.width}sx.beginPath();sx.arc(f.x,f.y,f.r,0,7);sx.fill()});requestAnimationFrame(loop)})();
// coriandoli
function confetti(){const c=$('#conf'),x=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;const cols=['#b3261e','#c99a2e','#1e6b3a','#fff8e6','#4aa3ff'];
 const p=Array.from({length:140},()=>({x:innerWidth/2,y:innerHeight*.6,vx:(Math.random()-.5)*16,vy:-8-Math.random()*12,c:cols[Math.random()*5|0],s:5+Math.random()*7,a:Math.random()*6}));let t=0;
 (function f(){x.clearRect(0,0,c.width,c.height);p.forEach(q=>{q.vy+=.35;q.x+=q.vx;q.y+=q.vy;q.a+=.2;x.save();x.translate(q.x,q.y);x.rotate(q.a);x.fillStyle=q.c;x.fillRect(-q.s/2,-q.s/4,q.s,q.s/2);x.restore()});if(++t<110)requestAnimationFrame(f);else x.clearRect(0,0,c.width,c.height)})()}

// albero
const TC=['#ff4d4d','#ffd75e','#4aa3ff','#6dff8a','#ff9ff3'];
const tr=$('#tree');
function buildTree(){
 let h='<defs><linearGradient id="g1" x1="0" x2="1"><stop offset="0" stop-color="#0d4a27"/><stop offset=".45" stop-color="#1f8a4c"/><stop offset="1" stop-color="#0b3a1f"/></linearGradient><linearGradient id="g2" x1="0" x2="1"><stop offset="0" stop-color="#0f5530"/><stop offset=".5" stop-color="#27a05a"/><stop offset="1" stop-color="#0c4224"/></linearGradient><radialGradient id="halo"><stop offset="0" stop-color="#ffd75e" stop-opacity=".35"/><stop offset="1" stop-color="#ffd75e" stop-opacity="0"/></radialGradient><linearGradient id="tk" x1="0" x2="1"><stop offset="0" stop-color="#5a3216"/><stop offset=".5" stop-color="#8a5428"/><stop offset="1" stop-color="#4a280f"/></linearGradient></defs>';
 h+='<ellipse cx="200" cy="480" rx="170" ry="16" fill="#0006"/>';
 h+='<rect x="178" y="372" width="44" height="64" rx="5" fill="url(#tk)"/>';
 const T=[[50,150,62],[105,215,90],[165,290,120],[235,375,155]];
 const tier=([y0,y1,w],k)=>{const n=Math.round(w/16),st=2*w/n;let d=`M200,${y0} L${200+w},${y1-14}`;for(let i=0;i<n;i++){const x1=200+w-st*(i+1),xm=200+w-st*(i+.5);d+=` Q${xm},${y1+14} ${x1},${y1-14}`}d+=' Z';
  return `<path d="${d}" fill="url(#g${k%2+1})" stroke="#072a15" stroke-width="2.5" stroke-linejoin="round"/>`};
 for(let k=3;k>=0;k--) h+=tier(T[k],k);
 // neve sulle punte
 T.forEach(([y0,y1,w],k)=>{});
 // ghirlande dorate
 [[150,60],[214,86],[288,116],[372,150]].forEach(([y,w])=>{h+=`<path d="M${200-w+6},${y-w*.18} Q200,${y+w*.28} ${200+w-6},${y-w*.18}" fill="none" stroke="#e8b93c" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="1 7"/>`});
 // palline fisse
 [[162,140,'#d33a2f'],[238,136,'#e8b93c'],[150,206,'#e8b93c'],[252,210,'#d33a2f'],[200,230,'#3b8de0'],[128,282,'#d33a2f'],[272,282,'#e8b93c'],[168,310,'#3b8de0'],[232,312,'#d33a2f'],[110,352,'#e8b93c'],[290,352,'#3b8de0'],[200,356,'#d33a2f']].forEach(([x,y,f])=>{h+=`<line x1="${x}" y1="${y-14}" x2="${x}" y2="${y-8}" stroke="#e8b93c" stroke-width="1.5"/><circle cx="${x}" cy="${y}" r="9" fill="${f}" stroke="#0005"/><circle cx="${x-3}" cy="${y-3}" r="2.6" fill="#fff9"/>`});
 // regali
 h+='<g><rect x="70" y="440" width="64" height="40" rx="3" fill="#b3261e"/><rect x="98" y="440" width="8" height="40" fill="#ffd75e"/><rect x="70" y="456" width="64" height="8" fill="#ffd75e"/><path d="M102,440 q-14,-18 -22,-6 q8,10 22,6 q14,4 22,-6 q-8,-12 -22,6z" fill="#ffd75e"/>'+
  '<rect x="262" y="448" width="56" height="32" rx="3" fill="#1f5fa8"/><rect x="286" y="448" width="8" height="32" fill="#fff8e6"/><rect x="262" y="460" width="56" height="7" fill="#fff8e6"/>'+
  '<rect x="214" y="458" width="40" height="22" rx="3" fill="#1e7a43"/><rect x="230" y="458" width="8" height="22" fill="#ffd75e"/></g>';
 // stella e alone
 h+='<circle cx="200" cy="38" r="46" fill="url(#halo)"/><polygon class="star" id="tstar" fill="#5a5a40" stroke="#2a2a1a" stroke-width="1.5" stroke-linejoin="round" points="200,8 209,32 235,33 215,49 222,74 200,60 178,74 185,49 165,33 191,32"/>';
 // 25 lucine
 const hw=y=>Math.max(0,...T.map(([a,b,w])=>y>=a&&y<=b?(y-a)/(b-a)*w:0));
 const pos=[];[[100,2],[148,3],[196,4],[246,5],[292,5],[342,6]].forEach(([y,n])=>{const w=hw(y)*.78;for(let i=0;i<n;i++)pos.push([200+(n===1?0:(i/(n-1)-.5)*2*w),y+(i%2?10:0)])});
 pos.forEach(([x,y],i)=>{h+=`<circle class="bulb" data-d="${i+1}" cx="${x.toFixed(1)}" cy="${y}" r="8" style="color:${TC[i%5]}"><title>${i+1} dicembre</title></circle>`});
 tr.innerHTML=h;
 tr.querySelectorAll('.bulb').forEach(b=>b.onclick=()=>{const d=+b.dataset.d,x=D.find(z=>z.d===d);$('#treecap').textContent=`${d} dicembre · ${x.t}`+(S().has(d)?' ✓':'')});
 tr.parentElement.addEventListener('pointermove',e=>{const r=tr.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5;tr.style.transform=`rotateY(${x*25}deg)`});
 tr.parentElement.addEventListener('pointerleave',()=>tr.style.transform='');
}
function lights(){const s=S();tr.querySelectorAll('.bulb').forEach(b=>{const on=s.has(+b.dataset.d);b.classList.toggle('on',on);b.style.fill=on?TC[(+b.dataset.d-1)%5]:''});
 const st2=$('#tstar'),all=s.size>=25;st2.classList.toggle('on',all);st2.setAttribute('fill',all?'#ffd75e':'#5a5a40');
 $('#treecap').textContent=`${s.size} luci accese su 25`+(all?' — l\'albero è completo! 🎄':'')}
buildTree();lights();filters();grid();shelf();prog();
})();
