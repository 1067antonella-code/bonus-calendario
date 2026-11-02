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
 c.onclick=e=>{const a=e.target.dataset.a;if(a==='open'){open(x)}else if(a==='done'){toggle(x.d)}else{c.classList.toggle('flip');c.classList.contains('flip')?fl2.add(x.d):fl2.delete(x.d)}};
 c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();c.classList.toggle('flip');c.classList.contains('flip')?fl2.add(x.d):fl2.delete(x.d)}};
 tilt(c);g.appendChild(c)})}
function tilt(el){el.addEventListener('pointermove',e=>{if(el.classList.contains('flip')||e.pointerType==='touch')return;const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`rotateY(${x*18}deg) rotateX(${-y*18}deg)`});el.addEventListener('pointerleave',()=>{el.style.transform=''})}
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
 const ns='http://www.w3.org/2000/svg';let h='<defs><linearGradient id="gr" x1="0" x2="1"><stop offset="0" stop-color="#14532d"/><stop offset=".5" stop-color="#1e7a43"/><stop offset="1" stop-color="#0f3d22"/></linearGradient></defs>';
 h+='<rect x="175" y="440" width="50" height="60" rx="6" fill="#6b3f1d"/><rect x="175" y="440" width="18" height="60" fill="#8a5428"/>';
 [[200,70,150,170],[200,140,190,190],[200,230,230,240]].forEach(([cx,y,w,hh])=>{h+=`<path d="M${cx},${y} L${cx+w/2},${y+hh} Q${cx},${y+hh+18} ${cx-w/2},${y+hh} Z" fill="url(#gr)" stroke="#0b2d19" stroke-width="2"/>`});
 // ghirlanda
 h+='<path d="M95 175 Q200 215 305 175" fill="none" stroke="#c99a2e" stroke-width="3" stroke-dasharray="2 6" stroke-linecap="round"/><path d="M70 290 Q200 340 330 290" fill="none" stroke="#c99a2e" stroke-width="3" stroke-dasharray="2 6" stroke-linecap="round"/><path d="M45 410 Q200 470 355 410" fill="none" stroke="#c99a2e" stroke-width="3" stroke-dasharray="2 6" stroke-linecap="round"/>';
 // palline fisse
 [[150,160,'#b3261e'],[250,150,'#c99a2e'],[110,265,'#c99a2e'],[290,270,'#b3261e'],[200,300,'#4aa3ff'],[80,385,'#b3261e'],[320,390,'#c99a2e'],[200,420,'#b3261e'],[145,350,'#c99a2e'],[260,345,'#4aa3ff']].forEach(([x,y,f])=>{h+=`<circle cx="${x}" cy="${y}" r="9" fill="${f}" stroke="#0004"/><circle cx="${x-3}" cy="${y-3}" r="2.5" fill="#fff9"/>`});
 // stella
 h+='<polygon class="star" id="tstar" fill="#5a5a40" points="200,16 208,44 238,44 214,60 222,88 200,72 178,88 186,60 162,44 192,44"/>';
 // 25 lucine disposte a righe
 const pos=[];const hw=y=>Math.max(0,...[[70,170,75],[140,190,95],[230,240,115]].map(([t,hh,w])=>y>=t&&y<=t+hh?(y-t)/hh*w:0));
 [[140,3],[192,4],[250,5],[320,6],[400,7]].forEach(([y,n])=>{const w=hw(y)*.78;for(let i=0;i<n;i++)pos.push([200+(i/(n-1)-.5)*2*w,y+(i%2?9:0)])});
 pos.forEach(([x,y],i)=>{h+=`<circle class="bulb" data-d="${i+1}" cx="${x}" cy="${y}" r="8" style="color:${TC[i%5]}"><title>${i+1} dicembre</title></circle>`});
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
