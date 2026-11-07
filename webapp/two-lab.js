import {classifyStationary} from './two-math.js';
const fmt=n=>Number(n.toFixed(3)).toLocaleString('da-DK');
export function bindTwoLab(root,module){
 if(module==='3')return bindStationaryLab(root,module);
 if(module==='2')return bindGradientLab(root,module);
 const slider=(id,label,min,max,value,step=.1)=>`<label for="two-lab-${module}-${id}">${label}<input id="two-lab-${module}-${id}" data-control="${id}" type="range" min="${min}" max="${max}" value="${value}" step="${step}"></label>`;
 root.innerHTML=`<h3>Fladen z=x²+y²</h3><p>Venstre: niveaukurven x²+y²=k set ovenfra. Højre: snittet y=b, altså z=x²+b². Begge koordinatvinduer går fra −5 til 5 vandret.</p><div class="two-controls">${slider('level','Niveau k',-1,16,4)}${slider('b','Fast y-værdi b',-3,3,1)}</div><p data-two-readout role="status"></p><div data-two-plot></div><div class="int-table" data-two-table></div>`;
 const update=()=>{
  const k=+root.querySelector('[data-control=level]').value,b=+root.querySelector('[data-control=b]').value,r=Math.sqrt(Math.max(0,k));
  const curve=Array.from({length:101},(_,i)=>{const x=-5+i/10;return `${440+(x+5)*28},${320-(x*x+b*b)*8}`;}).join(' ');
  root.querySelector('[data-two-readout]').textContent=`k=${fmt(k)}: ${k<0?'ingen niveaukurve':k===0?'kun punktet (0;0)':`cirkel med radius ${fmt(r)}`}. Snittet y=${fmt(b)} har z=x²+${fmt(b*b)} og minimum ${fmt(b*b)}.`;
  root.querySelector('[data-two-plot]').innerHTML=`<svg viewBox="0 0 800 390" role="img" aria-label="Niveaukurve og lodret snit i paraboloiden"><g stroke="currentColor" opacity=".4"><path d="M40 180H340 M190 30V330 M440 320H740 M580 30V340" fill="none"/></g><g fill="currentColor" font-size="16"><text x="320" y="205">x</text><text x="200" y="45">y</text><text x="725" y="345">x</text><text x="590" y="45">z</text><text x="45" y="365">Niveau: z=${fmt(k)}</text><text x="440" y="365">Snit: y=${fmt(b)}</text><text x="45" y="200">−5</text><text x="300" y="200">5</text><text x="440" y="345">−5</text><text x="700" y="345">5</text><text x="590" y="85">30</text></g>${k>=0?`<circle cx="190" cy="180" r="${k===0?3:r*28}" fill="${k===0?'#137c8b':'none'}" stroke="#137c8b" stroke-width="3"/>`:''}<polyline points="${curve}" fill="none" stroke="#b45309" stroke-width="3"/></svg>`;
  root.querySelector('[data-two-table]').innerHTML=`<table><caption>Kontrolpunkter på snittet y=${fmt(b)}</caption><thead><tr><th>x</th><th>y</th><th>z=f(x,y)</th></tr></thead><tbody>${[-2,-1,0,1,2].map(x=>`<tr><td>${x}</td><td>${fmt(b)}</td><td>${fmt(x*x+b*b)}</td></tr>`).join('')}</tbody></table>`;
 };
 root.addEventListener('input',update);update();
}

function bindGradientLab(root,module){
 const slider=(id,label)=>`<label for="two-lab-${module}-${id}">${label}<input id="two-lab-${module}-${id}" data-control="${id}" type="range" min="-3" max="3" step=".1" value="1"></label>`;
 root.innerHTML=`<h3>Niveaukurver og gradient for f(x,y)=x²+y²</h3><p>Flyt punktet P. Den orange pil starter i P og viser ∇f(P)=(2x;2y). Den blå linje viser en tangentretning til niveaukurven. Alle akser har samme målestok.</p><div class="two-controls">${slider('x','Punktets x')}${slider('y','Punktets y')}</div><p data-two-readout role="status"></p><div data-two-plot></div><div class="int-table" data-two-table></div>`;
 const update=()=>{
  const x=+root.querySelector('[data-control=x]').value,y=+root.querySelector('[data-control=y]').value,r=Math.hypot(x,y),X=x=>300+x*28,Y=y=>300-y*28;
  root.querySelector('[data-two-readout]').textContent=`P=(${fmt(x)};${fmt(y)}), f(P)=${fmt(r*r)}, gradient=(${fmt(2*x)};${fmt(2*y)}), længde=${fmt(2*r)}. ${r?'Gradienten peger udad; værdien vokser væk fra centrum.':'Nulgradient: ingen retning. Her er minimum.'}`;
  root.querySelector('[data-two-plot]').innerHTML=`<svg viewBox="0 0 600 600" role="img" aria-label="Cirkelformet niveaukurve med gradientpil og tangent"><defs><marker id="two-arrow-${module}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="#b45309"/></marker></defs><path d="M20 300H580 M300 20V580" stroke="currentColor" opacity=".4"/><g fill="currentColor" font-size="18"><text x="555" y="325">x</text><text x="310" y="30">y</text><text x="440" y="325">5</text><text x="310" y="160">5</text><text x="20" y="575">Niveau k=${fmt(r*r)}</text></g><circle cx="300" cy="300" r="${r*28}" fill="none" stroke="#137c8b" stroke-width="2"/>${r?`<path d="M${X(x-y/r*2)} ${Y(y+x/r*2)}L${X(x+y/r*2)} ${Y(y-x/r*2)}" stroke="#137c8b" stroke-width="3"/><path d="M${X(x)} ${Y(y)}L${X(3*x)} ${Y(3*y)}" stroke="#b45309" stroke-width="3" marker-end="url(#two-arrow-${module})"/>`:''}<circle cx="${X(x)}" cy="${Y(y)}" r="5" fill="currentColor"/><text x="${X(x)+8}" y="${Y(y)-8}" fill="currentColor">P</text></svg>`;
  root.querySelector('[data-two-table]').innerHTML=`<table><caption>Hældninger i P</caption><thead><tr><th>Retning</th><th>Ændring pr. enhed</th></tr></thead><tbody><tr><td>Positiv x-retning</td><td>${fmt(2*x)}</td></tr><tr><td>Positiv y-retning</td><td>${fmt(2*y)}</td></tr><tr><td>Stejleste stigning</td><td>${fmt(2*r)}</td></tr></tbody></table>`;
 };root.addEventListener('input',update);update();
}

function bindStationaryLab(root,module){
 const slider=(id,label,value)=>`<label for="two-lab-${module}-${id}">${label}<input id="two-lab-${module}-${id}" data-control="${id}" type="range" min="-2" max="2" step=".25" value="${value}"></label>`;
 root.innerHTML=`<h3>Fra skål til saddel: f(x,y)=ax²+by²</h3><p>Oprindelsen er altid stationær. Undersøg D=4ab og fladens form. Tegningen viser et trådnet over −2≤x,y≤2 i en fast skrå projektion; tabellen viser snit langs akserne.</p><div class="two-controls">${slider('a','Koefficient a',1)}${slider('b','Koefficient b',-1)}</div><p data-two-readout role="status"></p><div data-two-plot></div><div class="int-table" data-two-table></div>`;
 const update=()=>{
  const a=+root.querySelector('[data-control=a]').value,b=+root.querySelector('[data-control=b]').value,{determinant,kind}=classifyStationary(2*a,2*b,0),labels={min:'Lokalt minimum',max:'Lokalt maksimum',saddle:'Saddelpunkt',unknown:'D=0: andenordenstesten afgør det ikke'};
  const project=(x,y,z)=>`${300+(x-y)*50},${230+(x+y)*20-z*10}`;
  let lines='';for(let i=0;i<=16;i++){const c=-2+i/4;for(const dir of [0,1]){const pts=Array.from({length:41},(_,j)=>{const t=-2+j/10,x=dir?c:t,y=dir?t:c;return project(x,y,a*x*x+b*y*y);}).join(' ');lines+=`<polyline points="${pts}" stroke="${dir?'#137c8b':'#b45309'}" stroke-width="1" fill="none"/>`;}}
  root.querySelector('[data-two-readout]').textContent=`a=${fmt(a)}, b=${fmt(b)}. fₓₓ=${fmt(2*a)}, fᵧᵧ=${fmt(2*b)}, fₓᵧ=0. D=${fmt(determinant)}. ${labels[kind]}.${a===0||b===0?' Når en koefficient er nul, er der en hel linje af stationære punkter; når begge er nul, er alle punkter stationære.':''}`;
  root.querySelector('[data-two-plot]').innerHTML=`<svg viewBox="0 0 600 480" role="img" aria-label="Trådnet af fladen ax²+by² med stationært punkt i oprindelsen">${lines}<path d="M300 230L450 290 M300 230L150 290 M300 230V30" stroke="currentColor" fill="none"/><g fill="currentColor" font-size="18"><text x="455" y="300">x</text><text x="130" y="300">y</text><text x="310" y="35">z</text><text x="310" y="250">(0;0;0)</text></g><circle cx="300" cy="230" r="4" fill="currentColor"/></svg>`;
  root.querySelector('[data-two-table]').innerHTML=`<table><caption>To snit gennem det stationære punkt</caption><thead><tr><th>t</th><th>f(t,0)=at²</th><th>f(0,t)=bt²</th></tr></thead><tbody>${[-2,-1,0,1,2].map(t=>`<tr><td>${t}</td><td>${fmt(a*t*t)}</td><td>${fmt(b*t*t)}</td></tr>`).join('')}</tbody></table>`;
 };root.addEventListener('input',update);update();
}
