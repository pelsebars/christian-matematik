import { quantile,cdf,pdf } from './normal-math.js';
const finite=value=>{if(!Number.isFinite(value))throw RangeError('Måleværdier og parametre skal være endelige tal.');};
export function leftProbability(probability,side='left'){
 if(!Number.isFinite(probability)||probability<=0||probability>=1)throw RangeError('Sandsynligheden skal være strengt mellem nul og én.');
 if(!['left','right'].includes(side))throw RangeError('Vælg venstre eller højre hale.');
 return side==='right'?1-probability:probability;
}
export function sdFromProbability(mean,bound,probability,side='left'){
 finite(mean);finite(bound);const p=leftProbability(probability,side),z=quantile(p);
 if(p===.5){if(bound===mean)throw RangeError('Oplysningen rammer centrum. Alle positive spredninger passer; spredningen er ikke entydig.');throw RangeError('Halvdelen ligger ved middelværdien. De givne oplysninger passer ikke sammen.');}
 const sd=(bound-mean)/z;
 if(!Number.isFinite(sd)||sd<=0)throw RangeError('Oplysningerne giver ikke en positiv spredning. Kontrollér grænse, middelværdi og halevalg.');
 return {mean,sd,p,z,bound};
}
export function meanFromProbability(sd,bound,probability,side='left'){
 finite(sd);finite(bound);if(sd<=0)throw RangeError('Spredningen skal være positiv.');const p=leftProbability(probability,side),z=quantile(p),mean=bound-sd*z;finite(mean);return {mean,sd,p,z,bound};
}
export function parametersFromQuantiles(lower,pLower,upper,pUpper){
 finite(lower);finite(upper);leftProbability(pLower);leftProbability(pUpper);
 if(lower>=upper||pLower>=pUpper)throw RangeError('To forskellige grænser skal stå i stigende rækkefølge og have stigende venstre sandsynligheder.');
 const zLower=quantile(pLower),zUpper=quantile(pUpper),sd=(upper-lower)/(zUpper-zLower),mean=lower-sd*zLower;
 finite(mean);finite(sd);if(sd<=0)throw RangeError('Modellen skal have positiv spredning.');
 return {mean,sd,zLower,zUpper,lower,upper,pLower,pUpper};
}
export function meansFromDensity(bound,sd,height){
 finite(bound);finite(sd);finite(height);if(sd<=0||height<=0)throw RangeError('Spredning og tæthed skal være positive.');
 const peak=pdf(bound,bound,sd),ratio=height/peak,rounding=8*Number.EPSILON;
 if(ratio>1+rounding)throw RangeError('Den ønskede tæthed er højere end den størst mulige top ved denne spredning. Ingen middelværdi passer.');
 const distance=ratio>=1-rounding?0:sd*Math.sqrt(-2*Math.log(ratio));
 const means=distance===0?[bound]:[bound-distance,bound+distance];means.forEach(finite);return {means,peak,distance,bound,sd,height};
}
export const parameterCases={
 phosphor:{title:'Fosfor: kendt middelværdi',unit:'kg',mean:5,sd:2,meanRange:[0,10,.01],sdRange:[.1,6,.001],known:'mean',points:[{bound:2,p:.1}]},
 coffee:{title:'Kaffe: kendt spredning',unit:'g',mean:500,sd:5,meanRange:[480,515,.01],sdRange:[1,10,.01],known:'sd',points:[{bound:500,p:.7}]},
 oil:{title:'Olie: to ukendte parametre',unit:'liter',mean:100,sd:20,meanRange:[80,120,.01],sdRange:[2,70,.01],known:'',points:[{bound:90,p:.4},{bound:110,p:.6}]},
 tea:{title:'Te: to ukendte parametre',unit:'g',mean:250,sd:6,meanRange:[240,260,.01],sdRange:[.5,10,.001],known:'',points:[{bound:245,p:.1},{bound:255,p:.9}]},
};
export function solveParameterCase(name){const c=parameterCases[name];if(!c)throw RangeError('Ukendt eksempel.');const [a,b]=c.points;return c.known==='mean'?sdFromProbability(c.mean,a.bound,a.p):c.known==='sd'?meanFromProbability(c.sd,a.bound,a.p):parametersFromQuantiles(a.bound,a.p,b.bound,b.p);}
export function parameterPlotModel(mean,sd,points){
 finite(mean);finite(sd);if(sd<=0||!Array.isArray(points)||!points.length)throw RangeError('Vælg en positiv spredning og mindst én kontrolgrænse.');
 points.forEach(({bound,p})=>{finite(bound);leftProbability(p);});
 if(mean+sd===mean||!Number.isFinite(mean-8*sd)||!Number.isFinite(mean+8*sd)||!Number.isFinite(1/sd))throw RangeError('Tallene kan ikke vises præcist på figuren.');
 const min=Math.min(mean-5*sd,...points.map(p=>p.bound-sd)),max=Math.max(mean+5*sd,...points.map(p=>p.bound+sd));
 const curve=Array.from({length:1601},(_,i)=>{const value=mean-8*sd+i*sd/100;return [value,pdf(value,mean,sd)];});
 const upper=Math.min(mean+8*sd,points[0].bound),lower=mean-8*sd,count=Math.max(2,Math.ceil((upper-lower)/sd*100)+1);
 const shade=upper<lower?[]:Array.from({length:count},(_,i)=>{const value=lower+(upper-lower)*i/(count-1);return [value,pdf(value,mean,sd)];});
 return {min,max,curve,shade,probability:cdf(points[0].bound,mean,sd),checks:points.map(p=>({...p,actual:cdf(p.bound,mean,sd)}))};
}
