import {math,n,mi,op,row,par,pow,frac,vec,col,fn,t,eq,plus,minus,curve} from './vector-math.js';
export const prime=(s,order=1)=>`<msup>${row(s)}<mo>${'′'.repeat(order)}</mo></msup>`;
export const df=(name,arg=t,order=1)=>prime(mi(name),order)+par(arg);
export const dvec=(name='r',arg=t,order=1)=>prime(vec(name),order)+par(arg);
export const derivative=(a,b,order=1,arg=t)=>math(dvec('r',arg,order)+eq+col(a,b));
export const norm=s=>row(op('‖')+s+op('‖'));
export const sqrt=s=>`<msqrt>${row(s)}</msqrt>`;
export const unit=(numerator='m',order=1,denominator='s')=>frac(`<mtext>${numerator}</mtext>`,order===1?`<mtext>${denominator}</mtext>`:pow(`<mtext>${denominator}</mtext>`,order));
export const exp=s=>`<msup><mi>e</mi>${row(s)}</msup>`;
export const basketball=curve(n(4)+t,minus+n('4,91')+pow(t)+plus+n(6)+t+plus+n('1,6'));
export const doubleCurve=curve(pow(t,3)+minus+n(3)+t,pow(t)+minus+t+plus+n(1));
export const horizontalCurve=curve(pow(t,3)+minus+n(3)+t,frac(n(1),n(4))+pow(t,4)+minus+n(2)+pow(t,3)+plus+n(4)+pow(t)+plus+n(1));
export const roseCurve=curve(fn('cos',n(3)+t)+op('·')+fn('cos'),fn('cos',n(3)+t)+op('·')+fn('sin'));
export function vectorLength(v){
 if(!Array.isArray(v)||v.length!==2||!v.every(Number.isFinite))throw new RangeError('Brug to endelige vektorkomponenter.');
 return Math.hypot(...v);
}
export function vectorAngle(a,b){
 const na=vectorLength(a),nb=vectorLength(b);if(!Number.isFinite(na)||!Number.isFinite(nb))throw new RangeError('Brug vektorer med endelig længde.');if(!na||!nb)throw new RangeError('En nulvektor har ingen retning og derfor ingen vinkel.');
 const u=a.map(v=>v/na),v=b.map(w=>w/nb);
 return Math.atan2(Math.abs(u[0]*v[1]-u[1]*v[0]),u[0]*v[0]+u[1]*v[1])*180/Math.PI;
}
export function lineAngle(a,b){const angle=vectorAngle(a,b);return Math.min(angle,180-angle);}
// Positions in metres, parameter in seconds. Negative times in the loop are
// relative to a chosen reference instant, not negative elapsed travel times.
export const dynamicsModels={
 throw:{label:'Kast · højde og retning',range:[0,1.4],bounds:[-1,8,-2,6],formula:basketball,r:t=>[4*t,-4.91*t*t+6*t+1.6],v:t=>[4,6-9.82*t],a:()=>[0,-9.82]},
 circle:{label:'Cirkel · konstant fart',range:[0,6.28],bounds:[-2,7,-1,9],formula:curve(n(2)+plus+n(3)+fn('cos'),n(4)+plus+n(3)+fn('sin')),r:t=>[2+3*Math.cos(t),4+3*Math.sin(t)],v:t=>[-3*Math.sin(t),3*Math.cos(t)],a:t=>[-3*Math.cos(t),-3*Math.sin(t)]},
 loop:{label:'Dobbeltpunkt · to retninger',range:[-1.5,2.2],bounds:[-4,8,-1,8],formula:doubleCurve,r:t=>[t*t*t-3*t,t*t-t+1],v:t=>[3*t*t-3,2*t-1],a:t=>[6*t,2]},
 zero:{label:'Nulvektor · særskilt undersøgelse',range:[-1,1],bounds:[-2,4,-3,3],formula:curve(pow(t),pow(t,3)),r:t=>[t*t,t*t*t],v:t=>[2*t,3*t*t],a:t=>[2,6*t]}
};
