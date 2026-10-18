import { math, n, x, power, frac, fn, exp, definiteIntegral } from './integral-math.js';
export { math, n, x, power, frac, fn, exp, definiteIntegral };
export const mi = name => `<mi>${name}</mi>`;
export const op = symbol => `<mo>${symbol}</mo>`;
export const mu = mi('μ'), sigma = mi('σ'), X = mi('X');
export const parens = body => op('(') + body + op(')');
export const P = body => mi('P') + parens(body);
export const distribution = (mean=mu,sd=sigma) => X + op('∼') + mi('N') + parens(mean + op(';') + sd);
export const leftEvent = bound => X + op('≤') + bound;
export const rightEvent = bound => X + op('≥') + bound;
export const betweenEvent = (a,b) => a + op('≤') + X + op('≤') + b;
export const densityFormula = (mean=mu,sd=sigma) => frac(n(1),'<msqrt>'+n(2)+mi('π')+'</msqrt>'+op('·')+sd)+op('·')+exp(op('−')+frac(n(1),n(2))+op('·')+power(frac(x+op('−')+mean,sd),2));
export const fmt = (value,digits=4) => Number(value).toLocaleString('da-DK',{maximumFractionDigits:digits,minimumFractionDigits:digits});
function parameters(mean,sd){if(!Number.isFinite(mean)||!Number.isFinite(sd)||sd<=0)throw RangeError('Middelværdi skal være endelig, og spredningen skal være positiv.');}
const validBound=value=>{if(typeof value!=='number'||Number.isNaN(value))throw RangeError('Grænsen skal være et tal.');};
export function pdf(value,mean=0,sd=1){parameters(mean,sd);validBound(value);return Math.exp(-.5*((value-mean)/sd)**2)/(sd*Math.sqrt(2*Math.PI));}
// Adaptive Simpson integration of the standard density. Integrate the small tail
// directly, avoiding loss of precision when subtracting nearly equal CDF values.
function integral(f,a,b,eps=2e-13){
 const simpson=(a,b,fa,fm,fb)=>(b-a)*(fa+4*fm+fb)/6;
 function split(a,b,fa,fm,fb,whole,tolerance,depth){
  const m=(a+b)/2,l=(a+m)/2,r=(m+b)/2,fl=f(l),fr=f(r);
  const left=simpson(a,m,fa,fl,fm),right=simpson(m,b,fm,fr,fb),delta=left+right-whole;
  if(depth===0||Math.abs(delta)<=15*tolerance)return left+right+delta/15;
  return split(a,m,fa,fl,fm,left,tolerance/2,depth-1)+split(m,b,fm,fr,fb,right,tolerance/2,depth-1);
 }
 const fa=f(a),fm=f((a+b)/2),fb=f(b);
 return split(a,b,fa,fm,fb,simpson(a,b,fa,fm,fb),eps,22);
}
const tail = z => z>=12?0:integral(t=>Math.exp(-t*t/2)/Math.sqrt(2*Math.PI),z,12);
export function cdf(value,mean=0,sd=1){parameters(mean,sd);validBound(value);const z=(value-mean)/sd;return z<0?tail(-z):1-tail(z);}
export function survival(value,mean=0,sd=1){parameters(mean,sd);validBound(value);const z=(value-mean)/sd;return z<0?1-tail(-z):tail(z);}
export function intervalProbability(a,b,mean=0,sd=1){
 parameters(mean,sd);validBound(a);validBound(b);if(a>b)throw RangeError('Nedre grænse må ikke være større end øvre grænse.');
 return Math.max(0,a>=mean?survival(a,mean,sd)-survival(b,mean,sd):cdf(b,mean,sd)-cdf(a,mean,sd));
}
export function quantile(p,mean=0,sd=1){parameters(mean,sd);if(!(p>=0&&p<=1))throw RangeError('Sandsynligheden skal ligge fra nul til én.');if(p===0)return -Infinity;if(p===1)return Infinity;let lo=-12,hi=12;for(let i=0;i<60;i++){const mid=(lo+hi)/2;if(cdf(mid)<p)lo=mid;else hi=mid;}return mean+sd*(lo+hi)/2;}
export function plotModel({mean,sd,a,b,mode}){
 parameters(mean,sd);if(![a,b].every(Number.isFinite)||a>b||!['left','right','between'].includes(mode))throw RangeError('Kontrollér interval og områdetype.');
 const min=Math.min(mean-8*sd,a,b,-6),max=Math.max(mean+8*sd,a,b,26);
 const from=mode==='left'?min:a,to=mode==='right'?max:b;
 const sample=(lo,hi)=>{if(lo>hi)return [];const count=Math.max(2,Math.ceil((hi-lo)/sd*120)+1);return Array.from({length:count},(_,i)=>{const v=lo+(hi-lo)*i/(count-1);return [v,pdf(v,mean,sd)];});};
 return {min,max,curve:sample(mean-8*sd,mean+8*sd),shade:sample(Math.max(from,mean-8*sd),Math.min(to,mean+8*sd)),probability:mode==='left'?cdf(b,mean,sd):mode==='right'?survival(a,mean,sd):intervalProbability(a,b,mean,sd)};
}
