const fmt=n=>Number(n.toFixed(3)).toLocaleString('da-DK');
export function bindTwoLab(root,module){
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
