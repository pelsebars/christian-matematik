import {math,n,mi,op,mu,sigma,X,x,frac,distribution,cdf,pdf,quantile} from './normal-math.js';

const zSymbol=mi('z'),Z=mi('Z'),pSymbol=mi('p'),phi=mi('Φ');
const forward=zSymbol+op('=')+frac(x+op('−')+mu,sigma);
const backward=x+op('=')+mu+op('+')+sigma+op('·')+zSymbol;
const inversePhi=`<msup>${phi}<mrow>${op('−')+n(1)}</mrow></msup>`;
const presets=[[-2,'Under centrum'],[0,'Ved centrum'],[2,'Over centrum']];
const f=(v,d=2)=>new Intl.NumberFormat('da-DK',{minimumFractionDigits:d,maximumFractionDigits:d,useGrouping:false}).format(v).replace(/^-/, '−');
const pct=p=>f(100*p,2)+' %';
const line=points=>points.map(([a,b],i)=>`${i?'L':'M'}${a.toFixed(2)} ${b.toFixed(2)}`).join('');

export function normalScaleModel({mean=1000,sd=20,z=2}={}){
 if(!Number.isFinite(mean)||!Number.isFinite(sd)||sd<=0||!Number.isFinite(z)||Math.abs(z)>3)throw RangeError('Kontrollér centrum, positiv spredning og placeringen mellem −3 og 3.');
 const value=mean+sd*z,standardized=(value-mean)/sd,quartileZ=quantile(.25);
 return {mean,sd,z:standardized,value,returned:mean+sd*standardized,p:cdf(standardized),quartileZ,quartile:mean+sd*quartileZ};
}

export function normalScaleCurve(model,standard=false){
 const px=v=>50+(v+3.5)*500/7,py=v=>156-pdf(v)/pdf(0)*102;
 const points=Array.from({length:281},(_,i)=>{const v=-3.5+i/40;return[px(v),py(v)];});
 const shaded=[...points.filter(([a])=>a<px(model.z)),[px(model.z),py(model.z)]];
 const value=standard?f(model.z):f(model.value,0)+' mL',center=standard?'0':f(model.mean,0)+' mL',q=standard?f(model.quartileZ,3):f(model.quartile,2)+' mL';
 const atCenter=Math.abs(model.z)<1e-10,centerLabel=standard?(atCenter?'0 = z':'Centrum'):(atCenter?'μ = x':'μ');
 const description=`${standard?'Standardnormalfordeling':'Oprindelig normalfordeling i milliliter'}. Centrum ${center}. Én spredning er ${standard?'1 uden enhed':f(model.sd,0)+' mL'}. Den valgte grænse er ${value}; ${pct(model.p)} ligger til venstre. Første kvartil er ${q}.`;
 const axisValue=v=>standard?f(v,2):f(model.mean+model.sd*v,0)+' mL';
 return `<svg class="normal-scale-curve" viewBox="0 0 600 260" role="img" aria-label="${description}"><title>${standard?'Standardnormalfordelingen':'Mælkeskalaen'}</title><desc>${description}</desc>
 <path d="${line([[50,156],...shaded,[px(model.z),156]])}Z" fill="#cbe7ef"/>
 <path d="M50 156H550" fill="none" stroke="currentColor"/>
 <path d="${line(points)}" fill="none" stroke="#176489" stroke-width="3"/>
 <path data-scale-spread="" d="M${px(0)} 36H${px(1)}M${px(0)+6} 32L${px(0)} 36L${px(0)+6} 40M${px(1)-6} 32L${px(1)} 36L${px(1)-6} 40" fill="none" stroke="#087f8c" stroke-width="2"/>
 <text x="${px(.5)}" y="20" text-anchor="middle">${standard?'σ = 1':'σ = '+f(model.sd,0)+' mL'}</text>
 <path d="M${px(0)} 48V160" stroke="${atCenter?'#b35b26':'#087f8c'}" stroke-dasharray="5 4" stroke-width="2"/>
 <path d="M${px(model.quartileZ)} ${py(model.quartileZ)}V218" fill="none" stroke="#775ba3" stroke-dasharray="3 3"/>
 ${atCenter?'':`<path d="M${px(model.z)} ${py(model.z)}V161" stroke="#b35b26" stroke-width="3"/>`}
 <text x="${px(0)}" y="182" text-anchor="middle">${centerLabel}</text>
 <text x="${px(0)}" y="204" text-anchor="middle">${center}</text>
 ${atCenter?'':`<text x="${px(model.z)}" y="182" text-anchor="middle">${standard?'z':'x'}</text><text x="${px(model.z)}" y="204" text-anchor="middle">${value}</text>`}
 <text x="${px(model.quartileZ)}" y="234" text-anchor="middle">Q₁: ${q}</text>
 <text x="50" y="254" text-anchor="start">${axisValue(-3)}</text><text x="550" y="254" text-anchor="end">${axisValue(3)}</text>
 </svg>`;
}

const calcForward=m=>math(zSymbol+op('=')+frac(n(f(m.value,0))+op('−')+n(f(m.mean,0)),n(f(m.sd,0)))+op('=')+n(f(m.z,0)));
const calcBackward=m=>math(x+op('=')+n(f(m.mean,0))+op('+')+n(f(m.sd,0))+op('·')+(m.z<0?op('(')+n(f(m.z,0))+op(')'):n(f(m.z,0)))+op('=')+n(f(m.returned,0)))+' mL';
const chartCard=(m,step,title,standard=false)=>`<section class="normal-scale-card" data-scale-card="${step}"><h4><span>${step}</span>${title}</h4><p class="normal-scale-model">${standard?math(Z+op('∼')+mi('N')+op('(')+n(0)+op(';')+n(1)+op(')')):math(distribution(n(f(m.mean,0)),n(f(m.sd,0))))}${standard?' · uden enhed':' · fyldmængde i mL'}</p>${normalScaleCurve(m,standard)}<p class="normal-scale-probability">Blåt areal: <strong>${pct(m.p)}</strong> ligger under den valgte grænse.</p></section>`;

function graphicBody(m){return `
 <div class="normal-scale-story">
 ${chartCard(m,1,'Den oprindelige fordeling')}
 <div class="normal-scale-arrow"><span aria-hidden="true">↓</span><div><h4>Fra milliliter til antal spredninger</h4><p>${math(forward)}</p><p>Træk centrum fra. Divider med spredningen.</p><p class="normal-scale-example">I eksemplet: ${calcForward(m)}</p></div></div>
 ${chartCard(m,2,'Standardnormalfordelingen',true)}
 <div class="normal-scale-arrow"><span aria-hidden="true">↓</span><div><h4>Fra antal spredninger tilbage til milliliter</h4><p>${math(backward)}</p><p>Gang med spredningen. Læg centrum til.</p><p class="normal-scale-example">I eksemplet: ${calcBackward(m)}</p></div></div>
 ${chartCard(m,3,'Tilbage på mælkeskalaen')}
 </div>
 <div class="normal-scale-connections"><h4>Samme grænse. Samme andel. To målestokke.</h4><p>Den orange streg følger den samme grænse gennem alle tre trin. ${m.z===0?'Den er ved centrum, så z er nul.':m.z<0?'Den ligger under centrum, så z er negativ.':'Den ligger over centrum, så z er positiv.'} Det blå areal og sandsynligheden ændres ikke ved standardisering.</p>
 <p>Den lilla streg er <strong>første kvartil Q₁</strong>: 25 % ligger til venstre for den. Her svarer ${f(m.quartile,2)} mL til ${f(m.quartileZ,3)} på z-skalaen. En kvartil er en bestemt fraktil.</p>
 <p>Den grønne dobbeltpil måler <strong>én spredning</strong>, fra centrum til én spredning over centrum. Den måler ikke hele klokkens bredde. På mælkeskalaen er den ${f(m.sd,0)} mL; på standardskalaen er den én.</p>
 <p class="normal-intro-caption">Kurvernes lodrette skala er tilpasset i hver graf. Det farvede områdes andel af hele arealet er den samme. Eksemplet er en tænkt fyldemodel.</p></div>
 <div class="normal-scale-connections"><h4>Når spørgsmålet handler om en andel eller en fraktil</h4><dl class="normal-scale-links"><dt>Grænse → andel</dt><dd>${math(mi('F')+op('(')+x+op(')')+op('=')+phi+op('(')+zSymbol+op(')'))}<p>F er den oprindelige models fordelingsfunktion. Φ er standardnormalfordelingens fordelingsfunktion. Begge finder den samme venstre andel, når x og z svarer til hinanden.</p></dd><dt>Andel → grænse</dt><dd>${math(zSymbol+op('=')+inversePhi+op('(')+pSymbol+op(')'))}<p>Fra en kendt venstre andel p finder værktøjet først z-grænsen. Gå derefter tilbage med ${math(backward)}. Det er sådan, du finder en fraktil i mL.</p></dd></dl></div>`;}

export function normalScaleOverviewSvg(options={}){
 const m=normalScaleModel(options),escape=text=>String(text).replaceAll('&','&amp;').replaceAll('<','&lt;');
 const text=(x,y,value,size=19,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" ${extra}>${escape(value)}</text>`;
 const card=(top,step,title,standard=false)=>`<rect x="30" y="${top}" width="640" height="324" rx="16" fill="#f7fbfc" stroke="#cad8df"/>${text(55,top+33,step+' · '+title,23,'font-weight="700"')}${text(55,top+62,standard?'Z ∼ N(0; 1) · uden enhed':`X ∼ N(${f(m.mean,0)}; ${f(m.sd,0)}) · mL`,18)}<svg x="60" y="${top+69}" width="580" height="228" viewBox="0 0 600 260">${normalScaleCurve(m,standard).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</svg>${text(55,top+310,'Blåt areal til venstre for grænsen: '+pct(m.p),17)}`;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="1660" viewBox="0 0 700 1660" role="img" aria-label="Fra mælkeskala til standardskala og tilbage"><title>Normalfordeling · fra x til z og tilbage</title><desc>Standardisering: z = (x − μ) / σ. Tilbage: x = μ + σ · z. μ er middelværdi, σ er spredning. Samme venstre sandsynlighed bevares.</desc><style>text{font-family:Arial,sans-serif;fill:#162c40}svg svg text{font-size:18px}path{vector-effect:non-scaling-stroke}</style><rect width="700" height="1660" fill="white"/>
 ${text(35,40,'Normalfordeling · fra x til z og tilbage',27,'font-weight="700"')}
 ${text(35,73,'μ (my): centrum · σ (sigma): én spredning · x: grænse i mL',18)}
 ${text(35,101,'z: placering i spredninger · Q₁: første kvartil (25 % til venstre)',18)}
 ${card(125,1,'Den oprindelige fordeling')}
 ${text(350,489,'↓   z = (x − μ) / σ',26,'text-anchor="middle" font-weight="700"')}
 ${text(350,520,`Træk centrum fra. Divider med spredningen. z = ${f(m.z,0)}`,18,'text-anchor="middle"')}
 ${card(545,2,'Standardnormalfordelingen',true)}
 ${text(350,909,'↓   x = μ + σ · z',26,'text-anchor="middle" font-weight="700"')}
 ${text(350,940,`Gang med spredningen. Læg centrum til. x = ${f(m.returned,0)} mL`,18,'text-anchor="middle"')}
 ${card(965,3,'Tilbage på mælkeskalaen')}
 ${text(35,1328,'Samme grænse og samme sandsynlighed på begge skalaer.',20,'font-weight="700"')}
 ${text(35,1362,'Den grønne pil viser én spredning, fra μ til μ + σ.',18)}
 ${text(35,1391,`Q₁: ${f(m.quartile,2)} mL svarer til z = ${f(m.quartileZ,3)}.`,18)}
 ${text(35,1435,'Grænse → andel: F(x) = Φ(z)',21,'font-weight="700"')}
 ${text(35,1466,'Φ samler venstre areal i standardnormalfordelingen.',18)}
 ${text(35,1504,'Andel → grænse: z = Φ⁻¹(p), derefter x = μ + σ · z',21,'font-weight="700"')}
 ${text(35,1537,'p er den kendte venstre andel. Værktøjet finder z-grænsen.',18)}
 ${text(35,1582,'Tænkt fyldemodel. Lodret skala tilpasset i hver graf.',16)}
 ${text(35,1610,'Kurvehøjde er tæthed; sandsynlighed er areal.',16)}
 </svg>`;
}

export function normalScaleOverviewMarkup(){
 const m=normalScaleModel();
 return `<div class="normal-scale-overview"><p>Et grafisk opslagskort: følg den samme fyldgrænse fra mælkekartoner til standardskalaen og tilbage. Her har modellen centrum <strong>1000 mL</strong> og spredning <strong>20 mL</strong>. I notationen er anden parameter spredning, ikke varians.</p><dl class="normal-scale-legend"><dt>μ · my</dt><dd>Klokkens centrum, i mL.</dd><dt>σ · sigma</dt><dd>Spredningen, også i mL.</dd><dt>x → z → x</dt><dd>Grænse i mL → placering i spredninger → samme grænse i mL.</dd></dl>
 <div class="normal-presets" role="group" aria-label="Vælg grænsens placering">${presets.map(([z,label])=>`<button class="secondary-button" type="button" data-scale-preset="${z}" aria-pressed="${z===m.z}">${label}</button>`).join('')}</div>
 <p data-scale-summary aria-live="polite">Valgt grænse: ${f(m.value,0)} mL svarer til z = ${f(m.z,0)}.</p>
 <p><a class="text-button" data-scale-download download="normalfordeling-fra-x-til-z-og-tilbage.svg" href="data:image/svg+xml;charset=utf-8,${encodeURIComponent(normalScaleOverviewSvg())}">Hent grafikken til opslag eller udskrift</a></p>
 <div data-scale-graphic>${graphicBody(m)}</div></div>`;
}

export function bindNormalScaleOverview(host){
 const root=host.querySelector('.normal-scale-overview');if(!root)return;
 root.addEventListener('click',event=>{
  const button=event.target.closest('[data-scale-preset]');if(!button||!root.contains(button))return;
  const z=Number(button.dataset.scalePreset),m=normalScaleModel({z});
  root.querySelector('[data-scale-graphic]').innerHTML=graphicBody(m);
  root.querySelector('[data-scale-summary]').textContent=`Valgt grænse: ${f(m.value,0)} mL svarer til z = ${f(m.z,0)}.`;
  root.querySelector('[data-scale-download]').href='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(normalScaleOverviewSvg({z}));
  root.querySelectorAll('[data-scale-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 });
}
