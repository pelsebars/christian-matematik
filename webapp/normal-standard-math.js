import { mi,op,parens,frac,mu,sigma,X,x,n,math,fn,P,cdf,survival,intervalProbability,pdf } from './normal-math.js';
export { mi,op,parens,frac,mu,sigma,X,x,n,math,fn,P };
export const Z=mi('Z'), z=mi('z');
export const standardFormula=frac(x+op('−')+mu,sigma);
export const reverseFormula=mu+op('+')+sigma+op('·')+z;
export const standardDistribution=Z+op('∼')+mi('N')+parens(n(0)+op(';')+n(1));
export const Phi=arg=>fn('Φ',arg);
function valid(mean,sd){if(!Number.isFinite(mean)||!Number.isFinite(sd)||sd<=0)throw RangeError('Angiv en endelig middelværdi og en positiv spredning.');}
export function standardize(value,mean,sd){valid(mean,sd);if(!Number.isFinite(value))throw RangeError('Målingen skal være et endeligt tal.');const result=(value-mean)/sd;if(!Number.isFinite(result))throw RangeError('Tallene er for store til beregningen.');return result;}
export function unstandardize(value,mean,sd){valid(mean,sd);if(!Number.isFinite(value))throw RangeError('Antallet af spredninger skal være endeligt.');const result=mean+sd*value;if(!Number.isFinite(result))throw RangeError('Tallene er for store til beregningen.');return result;}
export function outcomeClass(value,mean,sd){
 standardize(value,mean,sd);
 const distance=Math.abs(value-mean);
 // Compare in original units: subtracting a large centre can amplify rounding.
 const rounding=8*Number.EPSILON*Math.max(Math.abs(value),Math.abs(mean),sd);
 return distance<=2*sd+rounding?'normal':distance>3*sd+rounding?'exceptional':'between';
}
export const outcomeLabels={normal:'Normalt udfald: højst to spredninger fra middelværdien.',between:'Uden for normalintervallet, men ikke exceptionelt: mere end to og højst tre spredninger fra middelværdien.',exceptional:'Exceptionelt udfald: mere end tre spredninger fra middelværdien.'};
export function standardModel({mean,sd,selected,a,b,mode}){
 valid(mean,sd);if(![selected,a,b].every(Number.isFinite)||a>b||!['left','right','between'].includes(mode)||Math.max(Math.abs(selected),Math.abs(a),Math.abs(b))>4)throw RangeError('Vælg gyldige grænser mellem minus fire og fire spredninger.');
 if(mean+sd===mean||!Number.isFinite(mean-5*sd)||!Number.isFinite(mean+5*sd)||!Number.isFinite(.46/sd))throw RangeError('Vælg en middelværdi og spredning, som kan vises på en præcis måleskala.');
 const curve=Array.from({length:1201},(_,i)=>{const z=-5+i/120;return {z,x:unstandardize(z,mean,sd),standard:pdf(z),original:pdf(unstandardize(z,mean,sd),mean,sd)};});
 const from=mode==='left'?-5:a,to=mode==='right'?5:b,count=Math.max(2,Math.ceil((to-from)*120)+1);
 const shade=Array.from({length:count},(_,i)=>{const z=from+(to-from)*i/(count-1);return {z,x:unstandardize(z,mean,sd),standard:pdf(z),original:pdf(unstandardize(z,mean,sd),mean,sd)};});
 return {curve,shade,low:unstandardize(a,mean,sd),high:unstandardize(b,mean,sd),observation:unstandardize(selected,mean,sd),probability:mode==='left'?cdf(b):mode==='right'?survival(a):intervalProbability(a,b)};
}
