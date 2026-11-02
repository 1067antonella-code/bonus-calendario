(()=>{
// Incolla qui l'URL dell'app web di Google Apps Script (vedi apps-script.gs / README)
const SCRIPT_URL='https://script.google.com/macros/s/AKfycbysH7thBB2ZzD3MoGLySmUApBbbl2JbcUqO_WoFt6nwefOZgAhTMXI0a_ZxCiGyUCwu/exec';
const $=q=>document.querySelector(q);
const f=$('#f'),ok=$('#ok'),err=$('#err');
function show(){f.hidden=true;ok.hidden=false}
try{if(localStorage.getItem('bonusSbloccato')==='1')show()}catch(e){}
f.addEventListener('submit',async e=>{e.preventDefault();err.hidden=true;
 const d=new FormData(f),email=(d.get('email')||'').trim();
 if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){err.textContent='Inserisci un indirizzo email valido.';err.hidden=false;return}
 if(!f.consenso.checked){err.textContent='Per continuare serve il consenso.';err.hidden=false;return}
 if(d.get('sito')){show();return}
 const b=$('#go');b.disabled=true;b.textContent='Un attimo…';
 try{if(SCRIPT_URL){const body=new URLSearchParams({nome:d.get('nome')||'',email,consenso:'sì',fonte:'landing-bonus'});fetch(SCRIPT_URL,{method:'POST',mode:'no-cors',body,keepalive:true}).catch(()=>{})}}catch(x){}
 try{localStorage.setItem('bonusSbloccato','1')}catch(x){}
 show();$('#ok').scrollIntoView({behavior:'smooth',block:'center'})});
// libro 3D e neve
const book=$('#book');addEventListener('pointermove',e=>{const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;book.style.transform=`rotateY(${-22+x*30}deg) rotateX(${6-y*20}deg)`});
const sc=$('#snow'),sx=sc.getContext('2d');let fl=[];function rs(){sc.width=innerWidth;sc.height=innerHeight;fl=Array.from({length:Math.min(80,innerWidth/12)},()=>({x:Math.random()*sc.width,y:Math.random()*sc.height,r:1+Math.random()*3,v:.3+Math.random()*.9,o:Math.random()*6}))}
rs();addEventListener('resize',rs);
if(!matchMedia('(prefers-reduced-motion:reduce)').matches)(function loop(){sx.clearRect(0,0,sc.width,sc.height);sx.fillStyle='#ffffffcc';fl.forEach(q=>{q.y+=q.v;q.o+=.01;q.x+=Math.sin(q.o)*.4;if(q.y>sc.height){q.y=-5;q.x=Math.random()*sc.width}sx.beginPath();sx.arc(q.x,q.y,q.r,0,7);sx.fill()});requestAnimationFrame(loop)})();
})();
