import { math,N,x,exp,eq,fn,k,y,yp,formula } from './ode-proportional-math.js';
import { frac,power,ln } from './integral-math.js';
export { math,N,x,exp,eq,fn,k,y,yp,formula,frac,power,ln };
export const group=s=>'<mrow><mo>(</mo>'+s+'<mo>)</mo></mrow>';
export const point=(a,b)=>math(group(N(a)+'<mo>;</mo>'+N(b)));
export const localSlope=(id,x,y)=>id==='root'?(y>0?(x+3)/Math.sqrt(y):null):id==='quotient'?(y!==0?(x+3)/y:null):4*x+y;
export function positiveRoot(f,low,high){for(let i=0;i<80;i++){const mid=(low+high)/2;if(f(mid)>0)high=mid;else low=mid;}return (low+high)/2;}
export const rabbitRate=positiveRoot(k=>100*k*Math.exp(4*k)-10,0,1);
export const carStop=575*Math.log(530/510);
export const infusionRate=3/(1-Math.exp(-.09));
export const concretePeak=5*Math.log(3.2);
export const worldPopulation=t=>(5.28**(-.3)-.0036*t)**(-1/.3);
export const fishLength=t=>72*Math.exp(.619/.22*(Math.exp(-2.2)-Math.exp(-.22*t)));
export const fishAge=length=>-Math.log(Math.exp(-2.2)-.22/.619*Math.log(length/72))/.22;
export const mexicoPopulation=t=>106.5*Math.exp(.68*(1-Math.exp(-.025*t)));
export const mexicoTime=target=>-Math.log(1-Math.log(target/106.5)/.68)/.025;
export const localFormulas={
 rabbitsA:formula(100,Math.log(3)/4), rabbitsB:formula(100,rabbitRate), grass:formula(3,.16), medicine:formula(2,-.035),
 world:'<msup>'+group(power(N(5.28),-.3)+'<mo>−</mo>'+N(.0036)+x)+'<mrow><mo>−</mo>'+frac(N(10),N(3))+'</mrow></msup>',
 car:N(530)+exp('<mo>−</mo>'+frac(x,N(575)))+'<mo>−</mo>'+N(510),
 infusion:frac('<mi>p</mi>',N(.03))+group(N(1)+'<mo>−</mo>'+exp(N(-.03)+x)),
 concrete:N(-80)+exp(N(-.3)+x)+'<mo>+</mo>'+N(75)+exp(N(-.1)+x)+'<mo>+</mo>'+N(20),
 variable:x+group(ln(x)+'<mo>+</mo>'+N(4)),
 fish:N(72)+exp(frac(N(.619),N(.22))+group(exp(N(-2.2))+'<mo>−</mo>'+exp(N(-.22)+x))),
 trig:'<mi>sin</mi>'+group(x)+'<mo>−</mo><mi>cos</mi>'+group(x)+'<mo>+</mo>'+N(1),
 mexicoRate:formula(.017,-.025),mexico:N(106.5)+exp(N(.68)+group(N(1)+'<mo>−</mo>'+exp(N(-.025)+x))),
};
