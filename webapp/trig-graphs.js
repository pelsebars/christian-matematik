const pi=Math.PI;
const fmt=n=>n.toLocaleString('da-DK',{maximumFractionDigits:3});
// Enumerate both branches before filtering; deduplicate tangential roots.
export function sineRoots(c,omega,phase,low,high){
 if(Math.abs(c)>1||omega===0)return [];
 const u0=Math.min(omega*low+phase,omega*high+phase),u1=Math.max(omega*low+phase,omega*high+phase);
 const roots=[];
 for(const base of [Math.asin(c),pi-Math.asin(c)])for(let k=Math.ceil((u0-base)/(2*pi)-1e-12);k<=Math.floor((u1-base)/(2*pi)+1e-12);k++){
  const x=(base+2*pi*k-phase)/omega;
  if(!roots.some(r=>Math.abs(r-x)<1e-9))roots.push(x);
 }
 return roots.sort((a,b)=>a-b);
}
export function bindTrigGraph(host,module){
 const id='trig-lab-'+module;
 host.innerHTML=`<div class="trig-controls">${[['a','Amplitudefaktor A',-4,4,1,2],['w','Vinkelfrekvens ω',.5,4,.5,1],['p','Fase φ i radianer',-3.14,3.14,.01,0],['d','Midterlinje d',-3,3,1,1],...(module==='2'?[['level','Målværdi',-7,7,.5,2]]:[])].map(([key,label,min,max,step,value])=>`<label for="${id}-${key}">${label}<input id="${id}-${key}" data-param="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"><output for="${id}-${key}"></output></label>`).join('')}</div><p data-trig-readout role="status"></p><svg viewBox="0 0 720 330" role="img" aria-label="Sinusgraf med vandret akse fra 0 til 2 pi radianer og lodret akse fra minus 8 til 8"></svg><div class="int-table"><table><caption>Udvalgte punkter på grafen</caption><thead><tr><th>x (rad)</th><th>f(x)</th></tr></thead><tbody></tbody></table></div><p data-trig-roots role="status"></p>`;
 const x=t=>50+t/(2*pi)*640,y=v=>155-v*16;
 function draw(){
  const values=Object.fromEntries([...host.querySelectorAll('input')].map(e=>{e.nextElementSibling.textContent=fmt(+e.value);return [e.dataset.param,+e.value];}));
  const {a,w,p,d,level}=values,f=t=>a*Math.sin(w*t+p)+d;
  host.querySelector('[data-trig-readout]').textContent=`f(x) = ${fmt(a)} sin(${fmt(w)}x + (${fmt(p)})) + (${fmt(d)}). Amplitude ${fmt(Math.abs(a))}. ${a===0?'Konstant funktion; ingen mindste positiv periode.':'Periode '+fmt(2*pi/w)+'.'} Midterlinje ${fmt(d)}.`;
  let path='';for(let i=0;i<=400;i++){const t=i*2*pi/400;path+=`${i?'L':'M'}${x(t).toFixed(2)},${y(f(t)).toFixed(2)} `;}
  const ticks=[0,pi/2,pi,3*pi/2,2*pi],labels=['0','π/2','π','3π/2','2π'];
  let roots=module==='2'&&a!==0?sineRoots((level-d)/a,w,p,0,2*pi):[];
  host.querySelector('svg').innerHTML=`<path d="M50 20V295 M50 155H695" stroke="currentColor" fill="none"/>${[-8,-4,4,8].map(v=>`<text x="20" y="${y(v)+4}">${v}</text>`).join('')}${ticks.map((t,i)=>`<path d="M${x(t)} 151v8" stroke="currentColor"/><text x="${x(t)}" y="319" text-anchor="middle">${labels[i]}</text>`).join('')}<text x="695" y="145">x</text><text x="55" y="18">f(x)</text><path d="${path}" stroke="#2563eb" stroke-width="3" fill="none"/>${module==='2'?`<path d="M50 ${y(level)}H690" stroke="#b45309" stroke-width="2" stroke-dasharray="6 4"/>${roots.map(t=>`<circle cx="${x(t)}" cy="${y(level)}" r="5" fill="#b45309"/>`).join('')}`:''}`;
  host.querySelector('tbody').innerHTML=ticks.map((t,i)=>`<tr><td>${labels[i]}</td><td>${fmt(f(t))}</td></tr>`).join('');
  host.querySelector('[data-trig-roots]').textContent=module==='2'?`Løsninger til f(x)=${fmt(level)} i [0;2π]: ${a===0?(level===d?'alle x i intervallet.':'ingen.'):(roots.length?roots.map(fmt).join('; ')+'.':'ingen.')} Den stiplede linje viser målværdien.`:'';
 }
 host.addEventListener('input',draw);draw();
}
