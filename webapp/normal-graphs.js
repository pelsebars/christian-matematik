import { plotModel,pdf,cdf,quantile,intervalProbability,fmt,math,n,mi,op,P,distribution,leftEvent,rightEvent,betweenEvent,fn } from './normal-math.js';
export function graphMarkup(id){return `<figure class="normal-lab" data-normal-lab="${id}"><h3>Undersøg kurven og arealet</h3><p>Flyt centrum og spredning. Vælg derefter område og grænser. Begge grafer bruger samme model. Den grå stiplede kurve viser den faste sammenligningsmodel med middelværdi 10 og spredning 4.</p><div class="normal-controls">${[['mean','Middelværdi',0,30,10,.1],['sd','Spredning',.05,10,4,.05],['a','Nedre grænse',-20,60,6,.05],['b','Øvre grænse',-20,60,14,.05]].map(([key,label,min,max,value,step])=>`<label for="${id}-${key}">${label}<input id="${id}-${key}" data-normal-value="${key}" type="range" min="${min}" max="${max}" value="${value}" step="${step}"><output for="${id}-${key}" data-normal-output="${key}"></output></label>`).join('')}<label for="${id}-mode">Vælg sandsynlighedsareal<select id="${id}-mode" data-normal-value="mode"><option value="between">Mellem de to grænser</option><option value="left">Til venstre for øvre grænse</option><option value="right">Til højre for nedre grænse</option></select></label></div><p data-normal-error role="status"></p><p data-normal-result aria-live="polite" aria-atomic="true"></p><svg class="normal-svg" data-normal-density viewBox="0 0 640 300" role="img" aria-labelledby="${id}-pdf-title ${id}-pdf-desc"><title id="${id}-pdf-title">Tæthed: sandsynligheden er det farvede areal</title><desc id="${id}-pdf-desc"></desc><g data-plot></g></svg><svg class="normal-svg" data-normal-cdf viewBox="0 0 640 280" role="img" aria-labelledby="${id}-cdf-title ${id}-cdf-desc"><title id="${id}-cdf-title">Fordeling: opsamlet sandsynlighed til venstre</title><desc id="${id}-cdf-desc"></desc><g data-plot></g></svg><figcaption>Øverst: den lodrette akse viser tæthed, ikke sandsynlighed. Nederst: den lodrette akse viser opsamlet sandsynlighed fra nul til én. Kurvernes haler fortsætter uden for figuren; der vises mindst otte spredninger på hver side af centrum. Beregningen medtager hele det valgte område. Aksernes skala tilpasses, og deres tal viser den aktuelle skala.</figcaption></figure>`;}
const path=(points,px,py)=>points.map(([x,y],i)=>`${i?'L':'M'}${px(x).toFixed(3)},${py(y).toFixed(3)}`).join(' ');
export function bindNormalGraphs(host){
 for(const lab of host.querySelectorAll('[data-normal-lab]')){
  const fields=Object.fromEntries([...lab.querySelectorAll('[data-normal-value]')].map(el=>[el.dataset.normalValue,el]));
  const draw=()=>{
   const values=Object.fromEntries(Object.entries(fields).map(([k,el])=>[k,k==='mode'?el.value:Number(el.value)]));
   for(const k of ['mean','sd','a','b'])lab.querySelector(`[data-normal-output="${k}"]`).textContent=fmt(values[k],2);
   // Prevent the sliders from exchanging the meanings of lower and upper bound.
   const invalid=values.a>values.b;lab.querySelector('[data-normal-error]').textContent=invalid?'Nedre grænse skal være mindre end eller lig med øvre grænse. Flyt én af grænserne.':'';
   lab.querySelectorAll('svg').forEach(el=>{if(invalid)el.setAttribute('hidden','');else el.removeAttribute('hidden');});
   if(invalid){lab.querySelector('[data-normal-result]').textContent='Intet område er beregnet, før intervallet er gyldigt.';return;}
   const m=plotModel(values),{mean,sd,a,b,mode}=values;
   const px=x=>54+(x-m.min)/(m.max-m.min)*558, ymax=Math.max(pdf(mean,mean,sd),pdf(10,10,4))*1.15,py=y=>248-y/ymax*200;
   const ticks=Array.from({length:7},(_,i)=>m.min+(m.max-m.min)*i/6);
   const axes=`<path d="M54 30V248H612" fill="none" stroke="currentColor"/>${ticks.map(t=>`<text x="${px(t)}" y="269" text-anchor="middle">${fmt(t,1)}</text>`).join('')}<text x="585" y="293">Måleværdi</text>`;
   const area=m.shade.length?path([[m.shade[0][0],0],...m.shade,[m.shade.at(-1)[0],0]],px,py)+'Z':'';
   const ref=Array.from({length:481},(_,i)=>{const x=-6+i*32/480;return [x,pdf(x,10,4)];});
   const markers=[...(mode!=='left'?[a]:[]),...(mode!=='right'?[b]:[])];
   const summary=`Middelværdi ${fmt(mean,2)}, spredning ${fmt(sd,2)}. ${mode==='left'?'Venstre hale til '+fmt(b,2):mode==='right'?'Højre hale fra '+fmt(a,2):'Fra '+fmt(a,2)+' til '+fmt(b,2)}: sandsynlighed ${fmt(m.probability,4)}, cirka ${fmt(m.probability*100,2)} procent.`;
   const event=mode==='left'?leftEvent(n(fmt(b,2))):mode==='right'?rightEvent(n(fmt(a,2))):betweenEvent(n(fmt(a,2)),n(fmt(b,2)));
   lab.querySelector('[data-normal-result]').innerHTML=math(distribution(n(fmt(mean,2)),n(fmt(sd,2))))+' · '+math(P(event)+op('≈')+n(fmt(m.probability,4)))+` · cirka ${fmt(m.probability*100,2)} %.<br>Kurvens højde ved øvre grænse: ${fmt(pdf(b,mean,sd),4)} pr. måleenhed. Højden er tæthed.`;
   const density=lab.querySelector('[data-normal-density]');density.querySelector('desc').textContent=summary+' Det farvede areal er sandsynligheden, mens højden er tæthed.';
   density.querySelector('[data-plot]').innerHTML=axes+`<text x="54" y="18">Tæthed pr. måleenhed</text>${[0,.5,1].map(t=>`<text x="48" y="${py(ymax*t)+4}" text-anchor="end">${fmt(ymax*t,2)}</text>`).join('')}<path data-shade d="${area}" fill="#cce8f3"/><path d="${path(ref,px,py)}" fill="none" stroke="#77838f" stroke-dasharray="5 5" stroke-width="2"/><path d="${path(m.curve,px,py)}" fill="none" stroke="#176489" stroke-width="3"/>${markers.map(t=>`<path d="M${px(t)} 248V${py(pdf(t,mean,sd))}" stroke="#87522d" stroke-dasharray="4 3"/>`).join('')}`;
   const fsvg=lab.querySelector('[data-normal-cdf]'),fy=p=>228-p*180;
   const fp=m.curve.filter((_,i)=>i%8===0).map(([x])=>[x,cdf(x,mean,sd)]);
   fsvg.querySelector('desc').textContent=summary+' Fordelingsfunktionens højde ved en grænse er det opsamlede venstre areal. Forskellen mellem to højder er mellemområdet.';
   const low=mode==='left'?0:cdf(a,mean,sd),high=mode==='right'?1:cdf(b,mean,sd);
   fsvg.querySelector('[data-plot]').innerHTML=`<text x="54" y="18">Opsamlet sandsynlighed</text><path d="M54 35V228H612" fill="none" stroke="currentColor"/>${[0,.25,.5,.75,1].map(t=>`<text x="48" y="${fy(t)+4}" text-anchor="end">${fmt(t,2)}</text><path d="M54 ${fy(t)}H612" stroke="#e5e9ed"/>`).join('')}${ticks.map(t=>`<text x="${px(t)}" y="249" text-anchor="middle">${fmt(t,1)}</text>`).join('')}<path d="${path(fp,px,fy)}" fill="none" stroke="#176489" stroke-width="3"/>${markers.map(t=>`<path d="M${px(t)} 228V${fy(cdf(t,mean,sd))}H54" fill="none" stroke="#87522d" stroke-dasharray="4 3"/><circle cx="${px(t)}" cy="${fy(cdf(t,mean,sd))}" r="4" fill="#87522d"/>`).join('')}<path d="M622 ${fy(low)}V${fy(high)}" stroke="#087d69" stroke-width="7"/><text x="54" y="276">Grøn markering: forskellen i opsamlet sandsynlighed</text>`;
  };
  lab.addEventListener('input',draw);draw();
 }
 const form=host.querySelector('#normal-inverse');
 form.addEventListener('submit',e=>{
  e.preventDefault();const out=host.querySelector('#normal-inverse-result');
  const vals=['mean','sd','p'].map(k=>form.elements.namedItem(k).value.trim().replace(',','.'));
  const [mean,sd,p]=vals.map(Number);
  if(vals.some(v=>!v)||!Number.isFinite(mean)||!Number.isFinite(sd)||sd<=0||!Number.isFinite(p)||p<=0||p>=1){out.textContent='Angiv en middelværdi, en positiv spredning og et venstre areal strengt mellem nul og én.';return;}
  const k=quantile(p,mean,sd);
  out.innerHTML=math(mi('k')+op('≈')+n(fmt(k,4)))+'. Kontrol: '+math(P(leftEvent(n(fmt(k,4))))+op('≈')+n(fmt(cdf(k,mean,sd),4)))+'. Grænsen er i samme enhed som middelværdien.';
 });
}
