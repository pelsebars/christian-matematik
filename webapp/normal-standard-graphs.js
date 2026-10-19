import { fmt,pdf } from './normal-math.js';
import { standardModel,outcomeClass,outcomeLabels } from './normal-standard-math.js';
export function standardLabMarkup(id){
 return `<figure class="normal-lab" data-standard-lab="${id}">
  <h3>Samme observation og areal · to måleskalaer</h3>
  <p>Øverst måles i de oprindelige enheder. Nederst måles i antal spredninger fra centrum. Den orange markering viser samme observation på begge skalaer. De blå områder beskriver samme hændelse.</p>
  <div class="normal-controls">
   <label for="${id}-mean">Middelværdi i oprindelige enheder<input id="${id}-mean" data-standard-value="mean" inputmode="decimal" value="100"></label>
   <label for="${id}-sd">Spredning i oprindelige enheder<input id="${id}-sd" data-standard-value="sd" inputmode="decimal" value="2"></label>
   ${[['selected','Valgt observations placering',-4,4,1],['a','Områdets nedre grænse i spredninger',-4,4,-1],['b','Områdets øvre grænse i spredninger',-4,4,1]].map(([key,label,min,max,value])=>`<label for="${id}-${key}">${label}<input id="${id}-${key}" data-standard-value="${key}" type="range" min="${min}" max="${max}" step="0.05" value="${value}"><output data-standard-output="${key}" for="${id}-${key}"></output></label>`).join('')}
   <label for="${id}-mode">Vælg sandsynlighedsområde<select id="${id}-mode" data-standard-value="mode"><option value="between">Mellem grænserne</option><option value="left">Til venstre for øvre grænse</option><option value="right">Til højre for nedre grænse</option></select></label>
  </div>
  <div class="normal-presets" aria-label="Vælg symmetrisk område">${[1,2,3].map(k=>`<button type="button" class="secondary-button" data-standard-band="${k}">Inden for ${k} ${k===1?'spredning':'spredninger'}</button>`).join('')}</div>
  <p data-standard-error role="status"></p><div data-standard-result aria-live="polite" aria-atomic="true"></div>
  ${['original','standard'].map(kind=>`<svg data-standard-graph="${kind}" class="normal-svg" viewBox="0 0 640 290" role="img" aria-labelledby="${id}-${kind}-title ${id}-${kind}-desc"><title id="${id}-${kind}-title">${kind==='original'?'Oprindelig måleskala':'Skala i antal spredninger'}</title><desc id="${id}-${kind}-desc"></desc><g data-plot></g></svg>`).join('')}
  <figcaption>Vandret placering og lodret tæthed får forskellige tal, men sandsynlighedsarealet bevares. Tæthed er højde, ikke sandsynlighed. Figuren viser fem spredninger på hver side; halerne fortsætter uden for figuren. Hele den valgte hale medregnes i sandsynligheden.</figcaption>
 </figure>`;
}
const line=(points,px,py)=>points.map(([x,y],i)=>`${i?'L':'M'}${px(x).toFixed(3)},${py(y).toFixed(3)}`).join(' ');
export function bindStandardLabs(host){
 for(const lab of host.querySelectorAll('[data-standard-lab]')){
  const fields=Object.fromEntries([...lab.querySelectorAll('[data-standard-value]')].map(el=>[el.dataset.standardValue,el]));
  function draw(){
   const values=Object.fromEntries(Object.entries(fields).map(([key,el])=>[key,key==='mode'?el.value:el.value.trim()===''?NaN:Number(el.value.replace(',','.'))]));
   for(const key of ['selected','a','b'])lab.querySelector(`[data-standard-output="${key}"]`).textContent=fmt(values[key],2);
   let model;try{model=standardModel(values);}catch(error){lab.querySelector('[data-standard-error]').textContent=error.message;lab.querySelector('[data-standard-result]').textContent='Ret oplysningerne for at vise de to skalaer.';lab.querySelectorAll('svg').forEach(svg=>svg.setAttribute('hidden',''));return;}
   lab.querySelector('[data-standard-error]').textContent='';lab.querySelectorAll('svg').forEach(svg=>svg.removeAttribute('hidden'));
   const {mean,sd,selected,a,b,mode}=values;
   const event=mode==='left'?`til venstre for ${fmt(model.high,3)} oprindelige enheder (svarende til ${fmt(b,2)} spredninger)`:mode==='right'?`til højre for ${fmt(model.low,3)} oprindelige enheder (svarende til ${fmt(a,2)} spredninger)`:`fra ${fmt(model.low,3)} til ${fmt(model.high,3)} oprindelige enheder (fra ${fmt(a,2)} til ${fmt(b,2)} spredninger)`;
   const observationText=`Observationen ${fmt(model.observation,3)} ligger ${fmt(model.observation-mean,3)} oprindelige enheder fra centrum, altså ${fmt(selected,2)} spredninger.`;
   const eventText=`Området ${event} har sandsynlighed ${fmt(model.probability,4)} på begge skalaer, cirka ${fmt(model.probability*100,2)} procent.`;
   const summary=observationText+' '+eventText;
   const result=lab.querySelector('[data-standard-result]');result.replaceChildren();
   for(const text of [observationText,eventText,outcomeLabels[outcomeClass(model.observation,mean,sd)]]){const paragraph=document.createElement('p');paragraph.textContent=text;result.append(paragraph);}
   for(const kind of ['original','standard']){
    const svg=lab.querySelector(`[data-standard-graph="${kind}"]`),original=kind==='original';
    const key=original?'x':'z',density=original?'original':'standard',xmin=original?mean-5*sd:-5,span=original?10*sd:10,ymax=.46/(original?sd:1);
    const px=x=>58+(x-xmin)/span*545,py=y=>235-y/ymax*180;
    const curve=model.curve.map(p=>[p[key],p[density]]),shade=model.shade.map(p=>[p[key],p[density]]),marker=original?model.observation:selected;
    const markerDensity=original?pdf(marker,mean,sd):pdf(marker);
    const ticks=[-4,-2,0,2,4].map(z=>({value:original?mean+sd*z:z}));
    const bounds=(mode==='left'?[b]:mode==='right'?[a]:[a,b]).map(z=>original?mean+sd*z:z);
    const title=original?'Oprindelige enheder · tæthed pr. måleenhed':'Antal spredninger · tæthed pr. spredningsenhed';
    svg.querySelector('desc').textContent=summary+' '+title;
    svg.querySelector('[data-plot]').innerHTML=`<text x="58" y="20">${title}</text><path d="M58 40V235H603" fill="none" stroke="currentColor"/>${[0,.2,.4].map(y=>`<text x="51" y="${py(y/(original?sd:1))+4}" text-anchor="end">${fmt(y/(original?sd:1),3)}</text>`).join('')}${ticks.map(t=>`<text x="${px(t.value)}" y="255" text-anchor="middle">${fmt(t.value,2)}</text>`).join('')}<path data-standard-shade d="${line([[shade[0][0],0],...shade,[shade.at(-1)[0],0]],px,py)}Z" fill="#cce8f3"/><path d="${line(curve,px,py)}" fill="none" stroke="#176489" stroke-width="3"/>${bounds.map(x=>`<path d="M${px(x)} 235V${py(original?pdf(x,mean,sd):pdf(x))}" stroke="#6d7886" stroke-dasharray="4 4"/>`).join('')}<path d="M${px(marker)} 235V${py(markerDensity)}" stroke="#a24d24" stroke-width="2"/><circle cx="${px(marker)}" cy="${py(markerDensity)}" r="5" fill="#a24d24"/><text x="58" y="282">Orange: valgt observation · blå flade: valgt sandsynlighedsområde</text>`;
   }
  }
  lab.addEventListener('input',draw);
  lab.addEventListener('click',event=>{const button=event.target.closest('[data-standard-band]');if(!button)return;fields.a.value=-Number(button.dataset.standardBand);fields.b.value=Number(button.dataset.standardBand);fields.mode.value='between';draw();});
  draw();
 }
}
