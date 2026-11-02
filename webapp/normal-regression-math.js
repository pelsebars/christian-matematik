import {normalData} from './normal-data.js';
const finite=v=>{if(!Number.isFinite(v))throw RangeError('Brug endelige tal.');};
// Lanczos log gamma and a continued fraction for regularized incomplete beta.
// Student quantiles use the finite-sample t distribution, never a fixed 1.96.
function logGamma(z){
 const p=[676.5203681218851,-1259.1392167224028,771.3234287776531,-176.6150291621406,12.507343278686905,-.13857109526572012,9.984369578019572e-6,1.5056327351493116e-7];
 if(z<.5)return Math.log(Math.PI)-Math.log(Math.sin(Math.PI*z))-logGamma(1-z);
 z--;let x=.9999999999998099;for(let i=0;i<p.length;i++)x+=p[i]/(z+i+1);const t=z+7.5;return .5*Math.log(2*Math.PI)+(z+.5)*Math.log(t)-t+Math.log(x);
}
function betaFraction(a,b,x){
 const tiny=1e-300;let c=1,d=1-(a+b)*x/(a+1);if(Math.abs(d)<tiny)d=tiny;d=1/d;let h=d;
 for(let m=1;m<=500;m++){
  const m2=2*m;let aa=m*(b-m)*x/((a+m2-1)*(a+m2));d=1+aa*d;if(Math.abs(d)<tiny)d=tiny;c=1+aa/c;if(Math.abs(c)<tiny)c=tiny;d=1/d;h*=d*c;
  aa=-(a+m)*(a+b+m)*x/((a+m2)*(a+m2+1));d=1+aa*d;if(Math.abs(d)<tiny)d=tiny;c=1+aa/c;if(Math.abs(c)<tiny)c=tiny;d=1/d;const delta=d*c;h*=delta;if(Math.abs(delta-1)<3e-14)return h;
 }throw RangeError('Den numeriske beregning konvergerede ikke.');
}
function beta(x,a,b){if(x<=0)return 0;if(x>=1)return 1;const front=Math.exp(logGamma(a+b)-logGamma(a)-logGamma(b)+a*Math.log(x)+b*Math.log1p(-x));return x<(a+1)/(a+b+2)?front*betaFraction(a,b,x)/a:1-front*betaFraction(b,a,1-x)/b;}
export function studentCDF(t,df){finite(t);if(!Number.isInteger(df)||df<1)throw RangeError('Frihedsgrader skal være et positivt helt tal.');if(t===0)return .5;const tail=.5*beta(df/(df+t*t),df/2,.5);return t>0?1-tail:tail;}
const tCache=new Map();
export function studentQuantile(p,df){if(!Number.isFinite(p)||p<=0||p>=1)throw RangeError('Fraktilens sandsynlighed skal ligge mellem nul og én.');studentCDF(0,df);if(p===.5)return 0;if(p<.5)return -studentQuantile(1-p,df);const key=p+':'+df;if(tCache.has(key))return tCache.get(key);let lo=0,hi=1;while(studentCDF(hi,df)<p){hi*=2;if(!Number.isFinite(hi))throw RangeError('Fraktilen er for stor.');}for(let i=0;i<90;i++){const mid=(lo+hi)/2;if(studentCDF(mid,df)<p)lo=mid;else hi=mid;}const result=(lo+hi)/2;tCache.set(key,result);return result;}
export function intervalConclusion(lower,upper){finite(lower);finite(upper);if(lower>upper)throw RangeError('Nedre grænse skal komme først.');return lower>0?'positive':upper<0?'negative':'includes-zero';}
export function linearRegression(pairs){
 if(!Array.isArray(pairs)||pairs.length<3)throw RangeError('Brug mindst tre sammenhørende talpar.');
 let meanX=0,meanY=0;for(const [i,p] of pairs.entries()){if(!Array.isArray(p)||p.length!==2)throw RangeError('Hver observation skal have en x- og en y-værdi.');p.forEach(finite);meanX+=(p[0]-meanX)/(i+1);meanY+=(p[1]-meanY)/(i+1);}
 let sxx=0,sxy=0,syy=0;for(const [x,y] of pairs){sxx+=(x-meanX)**2;sxy+=(x-meanX)*(y-meanY);syy+=(y-meanY)**2;}if(sxx<=0)throw RangeError('De vandrette værdier skal variere.');
 const slope=sxy/sxx,intercept=meanY-slope*meanX,points=pairs.map(([x,y],i)=>{const fitted=meanY+slope*(x-meanX);return{x,y,fitted,residual:y-fitted,row:i+1};}),sse=points.reduce((s,p)=>s+p.residual**2,0),df=pairs.length-2,residualSD=Math.sqrt(sse/df),se=residualSD/Math.sqrt(sxx),t=studentQuantile(.975,df),margin=t*se,lower=slope-margin,upper=slope+margin;
 const result={n:pairs.length,meanX,meanY,sxx,slope,intercept,points,sse,df,residualSD,se,t,margin,lower,upper,conclusion:intervalConclusion(lower,upper),r2:syy===0?null:Math.max(0,1-sse/syy)};[slope,intercept,sse,se,lower,upper].forEach(finite);return result;
}
export const regressionSources={
 grain:{label:'Korn · 56 år',xLabel:'År efter 1961',yLabel:'Kornproduktion (mio. ton)',slopeUnit:'mio. ton pr. år',yUnit:'mio. ton',judgement:'Residualerne ligger overvejende omkring nul og deres normalplot er omtrent retlinjet. Det støtter arkets tilnærmelse. Årsdata kan være afhængige; plottene alene dokumenterer ikke uafhængighed eller en sikker fremtidig udvikling.'},
 flowers:{label:'Blomster · 100 kronblade',xLabel:'Bredde (cm)',yLabel:'Længde (cm)',slopeUnit:'cm længde pr. cm bredde',yUnit:'cm',judgement:'Residualernes normalplot er omtrent retlinjet, som i materialets vurdering. Vurder også residualmønster og nogenlunde ens spredning. Intervallet støtter en positiv lineær sammenhæng under modelantagelserne; det beviser ikke årsag.'},
 phillips:{label:'Phillipsdata · 18 år',xLabel:'Arbejdsløshed (%)',yLabel:'Inflation (%)',slopeUnit:'procentpoint inflation pr. procentpoint arbejdsløshed',yUnit:'procentpoint',judgement:'Intervallet indeholder nul. En negativ beregnet hældning er derfor ikke nok til at fastslå en aftagende lineær sammenhæng ved dette niveau. Årsdata kræver særlig omtanke om afhængighed og om en simpel lineær model er rimelig.'},
 unibrew:{label:'Unibrew · 106 produktionsserier',xLabel:'Produktionsmængde (hl)',yLabel:'Produktionstid (timer)',slopeUnit:'timer pr. hl',yUnit:'timer',judgement:'Det positive interval støtter en voksende lineær sammenhæng under modelantagelserne. Undersøg residualer og indsamlingsforhold; resultatet beskriver hældningen og er ikke et interval for hver produktionsseries tid.'},
};
export const regressionPairs=Object.fromEntries(Object.keys(regressionSources).map(key=>[key,normalData[key].rows.map(r=>key==='grain'?[r[0]-1961,r[1]]:key==='phillips'?[r[1],r[2]]:r.slice())]));
const sourceCache=new Map();
export function sourceRegression(key){if(!regressionSources[key])throw RangeError('Ukendt datasæt.');if(!sourceCache.has(key))sourceCache.set(key,linearRegression(regressionPairs[key]));return sourceCache.get(key);}
export const reciprocalPairs=[[1,.0706],[2,.0520],[3,.0410],[4,.0342],[5,.0292],[6,.0258]];
export const squaredPairs=[[.3,3.2],[.4,2.9],[.5,2.6],[.6,2.3],[.7,1.8],[.8,1.1]];
export function transformedRegression(pairs,kind){if(!['reciprocal','squared'].includes(kind))throw RangeError('Vælg en omformning.');return linearRegression(pairs.map(([x,y])=>{finite(y);if(kind==='reciprocal'&&y===0)throw RangeError('Nul kan ikke stå i nævneren.');return[x,kind==='reciprocal'?1/y:y*y];}));}
export function transformedPrediction(model,x,kind){finite(x);const value=model.slope*x+model.intercept;if(kind==='reciprocal'){if(value<=0)throw RangeError('Modellen skal give positiv reciprok respons i denne sammenhæng.');return 1/value;}if(kind==='squared'){if(value<0)throw RangeError('Et negativt kvadrat giver ingen reel hastighed.');return Math.sqrt(value);}throw RangeError('Vælg en omformning.');}
export function simulateIntervals({count=100,n=16,noise=3,seed=1}={}){
 if(!Number.isInteger(count)||count<1||count>300||!Number.isInteger(n)||n<3||n>100||!Number.isFinite(noise)||noise<=0||!Number.isInteger(seed))throw RangeError('Ugyldige simulationsvalg.');
 let state=seed>>>0;const uniform=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return(state+.5)/4294967296;};const normal=()=>Math.sqrt(-2*Math.log(uniform()))*Math.cos(2*Math.PI*uniform());
 const truth=2,intervals=Array.from({length:count},()=>{const model=linearRegression(Array.from({length:n},(_,i)=>{const x=10*i/(n-1);return[x,5+truth*x+noise*normal()];}));return{lower:model.lower,upper:model.upper,slope:model.slope,covers:model.lower<=truth&&model.upper>=truth};});return{truth,n,noise,intervals,covered:intervals.filter(i=>i.covers).length};
}
