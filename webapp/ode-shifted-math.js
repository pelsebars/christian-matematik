import {math,N,x,exp,eq,fn,y,yp,frac,power,group,point,ln} from './ode-local-math.js';
export {math,N,x,exp,eq,fn,y,yp,frac,power,group,point,ln};
export const t='<mi>t</mi>';
export const shiftedValue=(level,rate,initial,time,start=0)=>level+(initial-level)*Math.exp(-rate*(time-start));
export const shiftedFormula=(level,coefficient,rate,variable=x,start=0)=>N(level)+(coefficient<0?'<mo>−</mo>':'<mo>+</mo>')+N(Math.abs(coefficient))+exp(N(-rate)+(start?group(variable+'<mo>−</mo>'+N(start)):variable));
export const fishRate=-Math.log(89/99.6),milkRate=Math.log(2)/2,potRate=-Math.log(41/79)/10;
export const fishAge=length=>-Math.log((100-length)/99.6)/fishRate;
export const mexicoValue=time=>132*Math.exp(.68*(1-Math.exp(-.025*time)));
export const bathLevel=flow=>(45*flow/200+.015*22)/(flow/200+.015);
export const bathTemperature=(flow,time)=>shiftedValue(bathLevel(flow),flow/200+.015,39,time);
export function minimumBathFlow(){let lo=0,hi=20;for(let i=0;i<70;i++){const mid=(lo+hi)/2;if(bathTemperature(mid,40)<37)lo=mid;else hi=mid;}return (lo+hi)/2;}
export const childAge=-Math.log((100-5.24/.045)/(50-5.24/.045))/.045;
export const shiftedFormulas={
 family:N(2)+'<mo>+</mo><mi>C</mi>'+exp(N(-5)+x),
 origin:shiftedFormula(5,95,4),point:shiftedFormula(3,2,2,x,1),
 fish:N(100)+'<mo>−</mo>'+N(99.6)+exp(ln(frac(N(89),N(99.6)))+t),
 mexico:N(132)+exp(N(.68)+group(N(1)+'<mo>−</mo>'+exp(N(-.025)+x))),
 ball:frac(N(9.82),N(5.5))+group(N(1)+'<mo>−</mo>'+exp(N(-5.5)+t)),
 milk:N(20)+'<mo>−</mo>'+N(14)+exp('<mo>−</mo>'+frac(ln(N(2)),N(2))+x),
 circuit:shiftedFormula(.9,-.9,25,t),
 child:frac(N(5.24),N(.045))+'<mo>+</mo>'+group(N(50)+'<mo>−</mo>'+frac(N(5.24),N(.045)))+exp(N(-.045)+t),
 pollution:shiftedFormula(20,-20,.02,t),
};
