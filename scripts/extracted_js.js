
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const salons=[
{name:'The Scissors Edge',area:'Saheed Nagar',type:'Unisex',rating:4.8,free:'2 of 3 chairs free',queue:1,wait:5,letter:'T'},
{name:'Urban Look Salon',area:'Jaydev Vihar',type:"Men's",rating:4.6,free:'1 of 2 chairs free',queue:3,wait:10,letter:'U'},
{name:'Style Studio by Jawed Habib',area:'Patia',type:'Premium',rating:4.7,free:'All chairs busy',queue:5,wait:15,letter:'S'},
{name:'Lakmé Salon',area:'Patia',type:'Unisex',rating:4.9,free:'2 chairs free',queue:0,wait:0,letter:'L'},
{name:'NVN Unisex Salon',area:'Patia',type:'Unisex',rating:4.6,free:'1 chair free',queue:2,wait:5,letter:'N'},
{name:'Green Trends Salon',area:'Patia',type:'Unisex',rating:4.7,free:'1 chair free',queue:4,wait:12,letter:'G'}];
let current='All';
function renderSalons(){let list=[...salons];if(current==="Shortest")list.sort((a,b)=>a.wait-b.wait);else if(current==="Top")list.sort((a,b)=>b.rating-a.rating);else if(current==="Available")list=list.filter(s=>s.wait===0||!s.free.includes('All'));else if(["Men's","Unisex","Premium"].includes(current))list=list.filter(s=>s.type===current);
$('#salonGrid').innerHTML=list.map(s=>`<article class="salon"><div class="salon-top"><div class="avatar">${s.letter}</div><span class="open">● Open</span></div><h3>${s.name}</h3><div class="salon-meta">${s.area} · ${s.type} · ★ ${s.rating.toFixed(1)}</div><div class="salon-stats"><div><strong>${s.free.startsWith('All')?'0':s.free.split(' ')[0]}</strong><span>Chairs free</span></div><div><strong>${s.queue}</strong><span>In queue</span></div><div><strong>${s.wait} min</strong><span>Wait</span></div></div><div class="salon-foot"><small>${s.free}</small><button class="join" data-salon="${s.name}">Join queue ↗</button></div></article>`).join('')||'<p>No sample salons match this filter.</p>';
$$('[data-salon]').forEach(b=>b.addEventListener('click',()=>notify('Demo preview only. Queue joining will be connected to the live service.')));
}
renderSalons();
$$('.filter').forEach(b=>b.addEventListener('click',()=>{$$('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');current=b.dataset.filter;renderSalons()}));
$('#locate').addEventListener('click',()=>{if(!navigator.geolocation){notify('Location is not available in this browser.');return}$('#locate').textContent='Locating…';navigator.geolocation.getCurrentPosition(()=>{notify('Location permission received. Nearby results need the live salon service.');$('#locate').textContent='Use my location'},()=>{notify('Location unavailable. Choose your area instead.');$('#locate').textContent='Use my location'},{timeout:8000})});
$$('.tab').forEach(b=>b.addEventListener('click',()=>{$$('.tab').forEach(x=>x.classList.toggle('active',x===b));let desk=b.dataset.tab==='desk';$('#customerDemo').style.display=desk?'none':'block';$('#deskDemo').style.display=desk?'block':'none';$('#demoCopy').innerHTML=desk?'<div class="eyebrow">The salon desk</div><h3>One view of the working day.</h3><p>See active chairs, waiting customers and the next token in this illustrative SalonOS preview.</p>':'<div class="eyebrow">The customer side</div><h3>Choose your service. Know your place.</h3><p>Pick a service, see its duration and price, then generate a demo token with queue position and estimated wait.</p>'}));
$('#tokenBtn').addEventListener('click',()=>{$('#token').classList.add('show');$('#tokenBtn').textContent='Demo token generated'});
$('#reviewBtn').addEventListener('click',()=>notify('Demo only. Verified review submission is not connected yet.'));
function money(n){return '₹'+Math.round(n).toLocaleString('en-IN')}
function calc(){let c=+$('#customers').value,t=+$('#ticket').value,d=+$('#days').value,r=+$('#rate').value;let rev=c*t*d,comm=rev*r/100,sub=400;$('#custVal').textContent=c;$('#ticketVal').textContent=money(t);$('#daysVal').textContent=d;$('#rateVal').textContent=r+'%';$('#revenue').textContent=money(rev);$('#commission').textContent=money(comm);$('#saving').textContent=money(comm-sub)}
['customers','ticket','days','rate'].forEach(id=>$('#'+id).addEventListener('input',calc));calc();
function notify(s){let t=$('#toast');t.textContent=s;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000)}
$('#menu').addEventListener('click',()=>$('#navlinks').classList.toggle('open'));$$('#navlinks a').forEach(a=>a.addEventListener('click',()=>$('#navlinks').classList.remove('open')));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});$$('.reveal').forEach(el=>io.observe(el));

// Scroll controlled hair cutting sequence. The scissors travel along the SVG curve.
(()=>{
 const scene=document.getElementById('cutScene'); if(!scene)return;
 const path=document.getElementById('hairPath'),rig=document.getElementById('scissorRig');
 const a=document.getElementById('bladeA'),b=document.getElementById('bladeB');
 const cut=document.getElementById('cutHair'),loose=document.getElementById('looseHair');
 const progressBar=document.getElementById('cutProgress'),copy=document.getElementById('cutCopy');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduced){cut.style.strokeDasharray=path.getTotalLength();cut.style.strokeDashoffset=0;return}
 const length=path.getTotalLength();cut.style.strokeDasharray=length;cut.style.strokeDashoffset=length;
 let scheduled=false;
 function frame(){
  const rect=scene.getBoundingClientRect(),travel=scene.offsetHeight-innerHeight;
  const p=Math.max(0,Math.min(1,-rect.top/travel));
  const travelP=Math.max(0,Math.min(1,(p-.08)/.76));
  const point=path.getPointAtLength(length*travelP);
  const ahead=path.getPointAtLength(Math.min(length,length*travelP+2));
  const angle=Math.atan2(ahead.y-point.y,ahead.x-point.x)*180/Math.PI;
  const box=scene.querySelector('.cut-stage').getBoundingClientRect();
  const scaleX=box.width/1000,scaleY=box.height/590;
  const x=point.x*scaleX-95,y=point.y*scaleY-75;
  rig.style.transform=`translate(${x}px,${y}px) rotate(${angle}deg)`;
  const cutStart=Math.max(0,Math.min(length,length*(travelP-.035)));
  cut.style.strokeDashoffset=length-cutStart;
  const snip=Math.max(0,Math.min(1,(p-.48)/.18));
  const open=1-snip;
  a.style.transform=`rotate(${-24*open}deg)`;
  b.style.transform=`rotate(${24*open}deg)`;
  loose.style.opacity=String(Math.max(0,(p-.66)*2.5));
  progressBar.style.height=(p*100)+'%';
  copy.style.opacity=String(Math.max(.25,1-Math.max(0,p-.7)*2.5));
  copy.style.transform=`translateY(${Math.max(0,p-.55)*-24}px)`;
  scheduled=false;
 }
 function update(){if(!scheduled){requestAnimationFrame(frame);scheduled=true}}
 addEventListener('scroll',update,{passive:true});addEventListener('resize',update);frame();
})();

