import { pdf,intervalProbability,fmt } from './normal-math.js';
export function standardBandFigure(mean,sd,steps,id){
 const px=value=>300+(value-mean)/sd*65,py=value=>170-value/pdf(mean,mean,sd)*135;
 const sample=(a,b)=>Array.from({length:481},(_,i)=>{const value=a+(b-a)*i/480;return [value,pdf(value,mean,sd)];});
 const line=points=>points.map(([x,y],i)=>`${i?'L':'M'}${px(x).toFixed(3)},${py(y).toFixed(3)}`).join(' ');
 const low=mean-steps*sd,high=mean+steps*sd,area=sample(low,high);
 return `<figure class="normal-concepts task-figure"><svg viewBox="0 0 600 215" role="img" aria-label="Symmetrisk centralt areal fra ${fmt(low,0)} til ${fmt(high,0)}: cirka ${fmt(intervalProbability(low,high,mean,sd)*100,2)} procent"><title>Centralt areal under en tæthedskurve</title><desc>Det centrale område fra ${fmt(low,0)} til ${fmt(high,0)} har areal cirka ${fmt(intervalProbability(low,high,mean,sd)*100,2)} procent. Brug aksetallene til at finde centrum og bredde.</desc><path d="M30 170H570" stroke="currentColor"/><path d="${line([[low,0],...area,[high,0]])}Z" fill="#cce8f3"/><path d="${line(sample(mean-4*sd,mean+4*sd))}" fill="none" stroke="#176489" stroke-width="3"/>${[-2,-1,0,1,2].map(i=>`<text x="${px(mean+i*sd)}" y="193" text-anchor="middle">${fmt(mean+i*sd,0)}</text>`).join('')}<text x="300" y="155" text-anchor="middle">${fmt(intervalProbability(low,high,mean,sd)*100,2)} %</text><text x="35" y="20">Tæthed</text></svg><figcaption>Det farvede areal er symmetrisk om kurvens centrum. Tallene på den vandrette akse er måleværdier; kurvehøjden er tæthed.</figcaption></figure>`;
}
