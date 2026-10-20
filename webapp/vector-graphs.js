import {math,n,mi,op,pair,fn,eq,plotCurves} from './vector-math.js';
export const vectorGraphMarkup=()=>`<figure class="vector-function-lab"><h3>Undersøg én parameter og én position</h3><p>Flyt parameteren med skyderen eller piletasterne. Den blå kurve viser alle tilladte positioner; den orange prik viser den valgte position. Pilen viser retningen for stigende parameter.</p><label for="vector-curve">Vælg bane</label><select id="vector-curve">${Object.entries(plotCurves).map(([id,c])=>`<option value="${id}">${c.label}</option>`).join('')}</select><div data-vector-formula></div><label for="vector-time">Parameter</label><input id="vector-time" type="range" min="-4" max="2" step="0.01" value="0"><output for="vector-time" data-vector-position aria-live="polite"></output><div data-vector-plot></div><figcaption>Akserne viser koordinater, ikke parameteren. Cirklen bruger radianer. Løkkens dobbeltpunkt nås ved parametrene minus 1 og 2. Tabellen giver et alternativ til figuren. Talvisninger afrundes til tre decimaler.</figcaption><details><summary>Se en koordinattabel</summary><div class="int-table" tabindex="0" role="region" aria-label="Koordinattabel"><table><thead><tr><th>Parameter</th><th>Første koordinat</th><th>Anden koordinat</th></tr></thead><tbody data-vector-table></tbody></table></div></details></figure>`;
export function bindVectorGraph(host){
 const select=host.querySelector('#vector-curve'),slider=host.querySelector('#vector-time');
 const fmt=v=>Number(v.toFixed(3));
 function draw(){
  const c=plotCurves[select.value],t=Number(slider.value),p=c.at(t),[xmin,xmax,ymin,ymax]=c.bounds;
  // Equal units on both axes prevent a circle being shown as an ellipse.
  const scale=Math.min(510/(xmax-xmin),310/(ymax-ymin));
  const X=x=>60+(510-(xmax-xmin)*scale)/2+(x-xmin)*scale,Y=y=>30+(310-(ymax-ymin)*scale)/2+(ymax-y)*scale;
  const points=Array.from({length:241},(_,i)=>c.at(c.min+(c.max-c.min)*i/240));
  const path=points.map(([x,y],i)=>`${i?'L':'M'}${X(x).toFixed(2)} ${Y(y).toFixed(2)}`).join(' ');
  const a=c.at(c.min+(c.max-c.min)*.14),b=c.at(c.min+(c.max-c.min)*.17);
  const ticks=(axis,lo,hi)=>Array.from({length:Math.floor(hi)-Math.ceil(lo)+1},(_,i)=>Math.ceil(lo)+i).filter(v=>v%((hi-lo)>12?4:2)===0).map(v=>axis==='x'?`<path d="M${X(v)} ${Y(0)-4}v8"/><text x="${X(v)}" y="${Y(0)+20}" text-anchor="middle">${v}</text>`:`<path d="M${X(0)-4} ${Y(v)}h8"/><text x="${X(0)-9}" y="${Y(v)+4}" text-anchor="end">${v}</text>`).join('');
  host.querySelector('[data-vector-formula]').innerHTML=c.formula;
  host.querySelector('[data-vector-position]').innerHTML=math(mi('t')+eq+n(fmt(t))+op(';')+fn('P',n(fmt(t)))+op('≈')+pair(n(fmt(p[0])),n(fmt(p[1]))));
  host.querySelector('[data-vector-plot]').innerHTML=`<svg viewBox="0 0 620 390" role="img" aria-label="${c.label}. Blå banekurve og orange position. Parameter ${fmt(t)}, første koordinat ${fmt(p[0])}, anden koordinat ${fmt(p[1])}."><title>${c.label}: koordinater og gennemløb</title><defs><marker id="vector-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#176489"/></marker></defs><g stroke="#96a3ac" fill="none"><path d="M${X(xmin)} ${Y(0)}H${X(xmax)}M${X(0)} ${Y(ymin)}V${Y(ymax)}"/>${ticks('x',xmin,xmax)}${ticks('y',ymin,ymax)}</g><text x="${X(xmax)+15}" y="${Y(0)+4}">x</text><text x="${X(0)+10}" y="${Y(ymax)-10}">y</text><path data-vector-path d="${path}" fill="none" stroke="#176489" stroke-width="2.5"/><path d="M${X(a[0])} ${Y(a[1])}L${X(b[0])} ${Y(b[1])}" stroke="#176489" stroke-width="3" marker-end="url(#vector-arrow)"/><circle data-vector-dot cx="${X(p[0])}" cy="${Y(p[1])}" r="6" fill="#b9692c" stroke="white" stroke-width="2"/></svg>`;
  const samples=select.value==='loop'?[-1,0,1,2]:Array.from({length:5},(_,i)=>c.min+(c.max-c.min)*i/4);
  host.querySelector('[data-vector-table]').innerHTML=samples.map(v=>`<tr><td>${math(n(fmt(v)))}</td>${c.at(v).map(a=>`<td>${math(n(fmt(a)))}</td>`).join('')}</tr>`).join('');
 }
 select.addEventListener('change',()=>{const c=plotCurves[select.value];slider.min=c.min;slider.max=c.max;slider.value=0;draw();});slider.addEventListener('input',draw);draw();
}
