import {math,n,mi,op,pow,fn,t,x,eq,plus,minus,curve,interval} from './vector-math.js';
export {math,n,mi,op,pow,fn,t,x,eq,plus,minus,curve,interval};
export {df,sqrt} from './vector-dynamics-math.js';
export const cubic=pow(x,3)+minus+n(3)+x;
export const hedgehog=curve(minus+n(2)+pow(t)+plus+n(10)+t,pow(t,3)+minus+n(11)+pow(t)+plus+n(30)+t);
export const height=minus+n(2)+pow(t)+plus+n(8)+t+plus+n(1);
export const scalar=(body,name='f',arg=x)=>math(fn(name,arg)+eq+body);
export const monotonyModels={
 cubic:{label:'To stationære punkter',formula:scalar(cubic),f:x=>x**3-3*x,d:x=>3*x*x-3,range:[-2,2],bounds:[-3,10],roots:[-1,1]},
 flat:{label:'Stationært punkt uden ekstremum',formula:scalar(pow(x,3)),f:x=>x**3,d:x=>3*x*x,range:[-2,2],bounds:[-9,13],roots:[0]}
};
export const optimizationModels={
 height:{label:'Kast · største højde',formula:scalar(height,'h',t),f:t=>-2*t*t+8*t+1,derivative:t=>8-4*t,range:[0,4],peak:2,unit:'meter',time:'sekunder',quantity:'Højde'},
 distance:{label:'Pindsvin · største afstand til reden',formula:hedgehog,f:t=>Math.hypot(-2*t*t+10*t,t**3-11*t*t+30*t),range:[0,5],peak:1.9164223147059518,unit:'meter',time:'minutter',quantity:'Afstand'}
};
// These two models have one interior maximum. This is not a general root solver.
export function modelCandidates(id,end){const m=optimizationModels[id];if(!m||!Number.isFinite(end)||end<=0||end>m.range[1])throw new RangeError('Ugyldigt modelinterval.');return [0,...(m.peak<end?[m.peak]:[]),end].map(t=>({t,value:m.f(t)}));}
