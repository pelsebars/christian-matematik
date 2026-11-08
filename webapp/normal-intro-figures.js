import {pdf} from './normal-math.js';

const color='#176489',accent='#a65a25';
const frame=(label,body)=>`<svg viewBox="0 0 640 260" role="img" aria-label="${label}"><title>${label}</title>${body}</svg>`;
const path=points=>points.map(([x,y],i)=>`${i?'L':'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join('');
const curve=(mean,sd)=>Array.from({length:241},(_,i)=>{const v=-4+i/30;return[60+(v+4)*65,205-pdf(v,mean,sd)*245];});

export function introBellFigure(mode='center'){
 if(!['center','shift','wide'].includes(mode))throw RangeError('Ukendt klokkevisning.');
 const mean=mode==='shift'?1:0,sd=mode==='wide'?1.55:1,points=curve(mean,sd);
 const label={center:'En klokke med centrum ved den stiplede linje.',shift:'Klokkens centrum er flyttet mod større fyld. Spredningen er uændret.',wide:'Klokken er bredere og lavere. Centrum er uændret, og variationen er større.'}[mode];
 return frame(label,`<path d="M60 205H580" stroke="currentColor"/>${mode!=='center'?`<path d="${path(curve(0,1))}" fill="none" stroke="#7a8794" stroke-width="2" stroke-dasharray="5 4"/>`:''}<path d="${path(points)}" fill="none" stroke="${color}" stroke-width="4"/><path d="M${320+mean*65} 65V212" stroke="${accent}" stroke-dasharray="4 4"/><text x="${320+mean*65}" y="45" text-anchor="middle">Centrum</text><text x="60" y="240">Mindre fyld</text><text x="580" y="240" text-anchor="end">Mere fyld</text>`);
}
export function introAreaFigure(mode='left'){
 if(!['left','right','between'].includes(mode))throw RangeError('Ukendt område.');
 const points=curve(0,1),selected=points.filter(([x])=>mode==='left'?x<=385:mode==='right'?x>=385:x>=255&&x<=385);
 const label={left:'Det farvede areal viser sandsynligheden for fyld under grænsen.',right:'Det farvede areal viser sandsynligheden for fyld over grænsen.',between:'Det farvede areal viser sandsynligheden for fyld mellem de to grænser.'}[mode];
 const bounds=mode==='between'?[255,385]:[385];
 return frame(label,`<path d="${path([[selected[0][0],205],...selected,[selected.at(-1)[0],205]])}Z" fill="#badfe8"/><path d="M60 205H580" stroke="currentColor"/><path d="${path(points)}" stroke="${color}" stroke-width="3" fill="none"/>${bounds.map((v,i)=>`<path d="M${v} 65V210" stroke="${accent}" stroke-dasharray="4 3"/><text x="${v}" y="45" text-anchor="middle">${bounds.length===2?(i?'Øvre grænse':'Nedre grænse'):'Grænse'}</text>`).join('')}<text x="60" y="242">Mindre fyld</text><text x="580" y="242" text-anchor="end">Mere fyld</text>`);
}
export function introRegressionFigure(){
 const points=[[90,190],[150,155],[215,165],[280,120],[345,125],[415,80],[485,85],[550,50]];
 return frame('Skitse: større produktionsmængder følges af længere arbejdstid. Punkterne ligger på begge sider af en stigende linje. Ét residual er markeret lodret.',`<path d="M60 30V215H580" fill="none" stroke="currentColor"/><path d="M75 190L560 45" stroke="${color}" stroke-width="3"/>${points.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="${color}"/>`).join('')}<path d="M345 125V109.28" stroke="${accent}" stroke-width="4"/><text x="355" y="140">Afstand til linjen</text><text x="70" y="20">Arbejdstid</text><text x="320" y="249" text-anchor="middle">Produktionsmængde</text>`);
}
export const introIntervals={
 positive:{lower:.6,upper:2.8,label:'Helt over nul',text:'Hele intervallet ligger over nul. Det støtter en voksende lineær sammenhæng under modelantagelserne. Det siger ikke, at hver enkelt måling vokser, eller at den ene størrelse er årsag til den anden.'},
 zero:{lower:-1.3,upper:1.9,label:'Nul er med',text:'Intervallet indeholder nul. Data fastslår derfor ikke en hældning forskellig fra nul ved dette niveau. Det beviser hverken en vandret linje eller, at der slet ingen sammenhæng findes.'},
 negative:{lower:-2.8,upper:-.6,label:'Helt under nul',text:'Hele intervallet ligger under nul. Det støtter en aftagende lineær sammenhæng under modelantagelserne. Konklusionen handler om den underliggende tendens, ikke om alle datapunkter.'}
};
export function introIntervalFigure(mode='zero'){
 const interval=introIntervals[mode];if(!interval)throw RangeError('Ukendt interval.');
 const px=v=>320+v*80,center=(interval.lower+interval.upper)/2;
 return frame(`Illustration af et hældningsinterval: ${interval.label.toLowerCase()}. Prikken viser den beregnede hældning.`, `<path d="M60 180H580" stroke="currentColor"/><path d="M320 50V190" stroke="${accent}" stroke-dasharray="5 4"/><text x="320" y="215" text-anchor="middle">0: vandret tendens</text><path d="M${px(interval.lower)} 110H${px(interval.upper)}M${px(interval.lower)} 96V124M${px(interval.upper)} 96V124" stroke="${color}" stroke-width="5"/><circle cx="${px(center)}" cy="110" r="7" fill="${color}"/><text x="${px(center)}" y="75" text-anchor="middle">Beregnet hældning</text><text x="60" y="248">Aftagende</text><text x="580" y="248" text-anchor="end">Voksende</text>`);
}

const descriptions={
 bell:{center:'Centrum fortæller, hvor fyldet samler sig. Klokkens bredde fortæller, hvor meget fyldet varierer.',shift:'Nu ligger centrum længere mod højre: maskinen fylder typisk mere i. Klokken har samme bredde, så variationen er uændret. Den stiplede kurve viser udgangspunktet.',wide:'Centrum er det samme, men fyldet varierer mere. Klokken bliver bredere og lavere; hele arealet er stadig én. Den stiplede kurve viser udgangspunktet.'},
 area:{left:'Under en grænse: behold området til venstre. Grænsen er en fyldmængde; arealet er sandsynligheden.',right:'Over en grænse: behold området til højre. Det er resten, når venstre område er fjernet fra hele arealet.',between:'Mellem to grænser: behold kun området imellem dem. Her søger vi en andel, ikke en kurvehøjde.'}
};
export function introVisual(kind){
 const config={bell:{title:'Se forskellen på centrum og spredning',initial:'center',options:[['center','Udgangspunkt'],['shift','Flyt centrum'],['wide','Større spredning']],render:introBellFigure},area:{title:'Det er spørgsmålet, der vælger området',initial:'left',options:[['left','Under en grænse'],['right','Over en grænse'],['between','Mellem to grænser']],render:introAreaFigure},interval:{title:'Se hele intervallet i forhold til nul',initial:'zero',options:Object.entries(introIntervals).map(([id,v])=>[id,v.label]),render:introIntervalFigure}}[kind];
 if(!config)throw RangeError('Ukendt illustration.');
 return `<figure class="normal-concepts normal-intro-visual" data-intro-visual="${kind}"><figcaption>${config.title}</figcaption><div class="normal-presets" role="group" aria-label="${config.title}">${config.options.map(([id,label])=>`<button class="secondary-button" type="button" data-intro-choice="${id}" aria-pressed="${id===config.initial}">${label}</button>`).join('')}</div><div data-intro-canvas>${config.render(config.initial)}</div><p data-intro-explanation aria-live="polite">${kind==='interval'?introIntervals[config.initial].text:descriptions[kind][config.initial]}</p><p class="normal-intro-caption">${kind==='interval'?'Illustration af tre tænkte resultater. Intervallerne er ikke beregnet fra et datasæt.':'Illustration af en normalmodel. Figuren viser idéen uden konkrete måledata.'}</p></figure>`;
}
export function bindNormalIntro(host){
 for(const figure of host.querySelectorAll('[data-intro-visual]')){
  const kind=figure.dataset.introVisual,render={bell:introBellFigure,area:introAreaFigure,interval:introIntervalFigure}[kind];
  figure.addEventListener('click',event=>{
   const button=event.target.closest('[data-intro-choice]');if(!button||!figure.contains(button))return;
   const mode=button.dataset.introChoice;
   figure.querySelector('[data-intro-canvas]').innerHTML=render(mode);
   figure.querySelector('[data-intro-explanation]').textContent=kind==='interval'?introIntervals[mode].text:descriptions[kind][mode];
   figure.querySelectorAll('[data-intro-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  });
 }
}
