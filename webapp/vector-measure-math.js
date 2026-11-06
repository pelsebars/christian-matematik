import {math,n,mi,op,row,par,pow,frac,vec,col,fn,t,eq,plus,minus,curve} from './vector-math.js';
import {df,dvec,norm,sqrt} from './vector-dynamics-math.js';
export {math,n,mi,op,row,par,pow,frac,vec,col,fn,t,eq,plus,minus,curve,df,dvec,norm,sqrt};
export const pi=mi('π');
export const integral=(body,a=mi('a'),b=mi('b'),variable=t)=>`<msubsup><mo>∫</mo>${row(a)}${row(b)}</msubsup>${row(body)}<mspace width="0.2em"/><mi mathvariant="normal">d</mi>${variable}`;
export const abs=body=>row(op('|')+body+op('|'));
export const crossVector=(name='r')=>`<mover accent="true">${vec(name)}<mo>ˆ</mo></mover>`;
export const areaIntegrand=()=>fn('x')+df('y')+minus+fn('y')+df('x');
export const lengthFormula=(a=mi('a'),b=mi('b'))=>math(mi('L')+eq+integral(norm(dvec()),a,b)+eq+integral(sqrt(pow(df('x'))+plus+pow(df('y'))),a,b));
export const areaFormula=(a=mi('a'),b=mi('b'))=>math(mi('A')+eq+frac(n(1),n(2))+op('·')+abs(integral(dvec()+op('·')+crossVector()+par(t),a,b)));
export const coordinateArea=(a=mi('a'),b=mi('b'),signed=false)=>math(mi(signed?'J':'A')+eq+frac(n(1),n(2))+op('·')+(signed?integral(par(areaIntegrand()),a,b):abs(integral(par(areaIntegrand()),a,b))));
export const sourceCar=curve(fn('sin')+plus+n(2),n(3)+fn('sin',frac(t,n(2)))+plus+n(1));
export const sourceLoop=curve(pow(t)+minus+n(2)+t,pow(t,3)+minus+n(12)+t);
export const astroid=curve(n(4)+pow(fn('cos'),3),n(4)+pow(fn('sin'),3));
export const cannon=curve(n('11,2')+t,minus+n('4,91')+pow(t)+plus+n('8,43')+t+plus+n('1,7'));
export const road=curve(n(12)+t,n('0,001')+pow(t,3)+minus+n('0,1')+pow(t)+plus+n('2,4')+t);
export const smallLoop=curve(pow(t)+minus+n(1),pow(t,3)+minus+t);
export const eightCurve=curve(fn('sin'),fn('sin',n(2)+t));
// Composite Simpson is used only for interactive estimates. Published answers
// are fixed and checked independently; this helper is not a general CAS.
export function measureIntegral(f,a,b,segments=1024){if(![a,b].every(Number.isFinite)||!Number.isInteger(segments)||segments<2||segments>20000||segments%2)throw new RangeError('Brug endelige grænser og et lige antal delintervaller.');const h=(b-a)/segments;let sum=f(a)+f(b);for(let i=1;i<segments;i++)sum+=(i%2?4:2)*f(a+i*h);return sum*h/3;}
export const measureModels={
 circle:{label:'Cirkel · ét eller to omløb',formula:curve(n(2)+fn('cos'),n(2)+fn('sin')),range:[0,2*Math.PI],bounds:[-2.6,2.6,-2.6,2.6],r:t=>[2*Math.cos(t),2*Math.sin(t)],v:t=>[-2*Math.sin(t),2*Math.cos(t)],closed:true},
 eight:{label:'To løkker · modsatte fortegn',formula:eightCurve,range:[0,2*Math.PI],bounds:[-1.4,1.4,-1.4,1.4],r:t=>[Math.sin(t),Math.sin(2*t)],v:t=>[Math.cos(t),2*Math.cos(2*t)],closed:true},
 car:{label:'Kildearkets modelbil',formula:sourceCar,range:[0,4*Math.PI],bounds:[.5,3.5,-2.6,4.6],r:t=>[Math.sin(t)+2,3*Math.sin(t/2)+1],v:t=>[Math.cos(t),1.5*Math.cos(t/2)],closed:true},
 loop:{label:'Kildearkets dobbeltpunkt',formula:sourceLoop,range:[-2,4],bounds:[-2,10,-18,18],r:t=>[t*t-2*t,t*t*t-12*t],v:t=>[2*t-2,3*t*t-12],closed:true}
};
export function polygonLength(model,a,b,count){if(!Number.isInteger(count)||count<1||count>256)throw new RangeError('Ugyldigt antal rette stykker.');let total=0,p=model.r(a);for(let i=1;i<=count;i++){const q=model.r(a+(b-a)*i/count);total+=Math.hypot(q[0]-p[0],q[1]-p[1]);p=q;}return total;}
export const signedDensity=(m,t)=>{const [x,y]=m.r(t),[dx,dy]=m.v(t);return (x*dy-y*dx)/2;};
