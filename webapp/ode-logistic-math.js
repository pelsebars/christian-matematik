import {math,N,x,exp,eq,fn,y,yp,frac,power,group,point,ln} from './ode-local-math.js';
export {math,N,x,exp,eq,fn,y,yp,frac,power,group,point,ln};
export const t='<mi>t</mi>';
export const logisticRate=(a,M,value)=>a*value*(M-value);
// Positive model branch, including both equilibria; reject crossing a backward pole.
export function logisticValue(M,a,initial,time,start=0){
 if(![M,a,initial,time,start].every(Number.isFinite)||M<=0||a<0||initial<0)return NaN;
 if(initial===0)return 0;if(initial===M||a===0)return initial;
 const denominator=1+(M/initial-1)*Math.exp(-a*M*(time-start));
 return denominator>0?M/denominator:NaN;
}
export function logisticTime(M,a,initial,target,start=0){
 if(!(M>0&&a>0&&initial>0&&initial<M&&target>0&&target<M))return NaN;
 return start+Math.log((M/initial-1)/(M/target-1))/(a*M);
}
export function rateRoots(a,M,rate){
 if(!(a>0&&M>0&&rate>=0&&rate<=a*M*M/4))return [];
 const d=Math.sqrt(M*M-4*rate/a);return d===0?[M/2]:[(M-d)/2,(M+d)/2];
}
export const logisticFormula=(M,a,initial,start=0,variable=t)=>{
 if(initial===0)return N(0);if(initial===M)return N(M);
 const c=M/initial-1,coefficient=Number.isInteger(c)?N(c):group(frac(N(M),N(initial))+'<mo>−</mo>'+N(1));
 return frac(N(M),N(1)+'<mo>+</mo>'+coefficient+exp(N(-Number((a*M).toPrecision(14)))+(start?group(variable+'<mo>−</mo>'+N(start)):variable)));
};
export const harvest={M:15.5,a:.000369,initial:13.1,start:400};
export const harvestValue=x=>logisticValue(harvest.M,harvest.a,harvest.initial,x,harvest.start);
export const harvestProfit=x=>700*harvestValue(x)-1.97*x;
export const harvestCandidates=()=>[0,1000,...rateRoots(harvest.a,harvest.M,1.97/700).map(v=>logisticTime(harvest.M,harvest.a,harvest.initial,v,400)).filter(x=>x>=0&&x<=1000)];
export const harvestOptimum=()=>harvestCandidates().reduce((best,x)=>harvestProfit(x)>harvestProfit(best)?x:best,0);
export const soupAmounts=rateRoots(.00002,10000,250);
export const twoPointA=2*Math.log(8/7)/(5*15);
export const logisticFormulas={
 rabbits:frac(N(1700),N(1)+'<mo>+</mo>'+N(16)+exp(N(-.03)+t)),
 population:logisticFormula(1000,.0001,100),cars:logisticFormula(315,.0004,198),plant:logisticFormula(52,.001,2),pig:logisticFormula(139.6,.000193,7.3),
 rates:logisticFormula(1000,.00013,50),bacteria:logisticFormula(2000,.000155,50),infection:logisticFormula(500000,3/500000,2500),harvest:logisticFormula(15.5,.000369,13.1,400,x),soup:frac(N(10000),N(1)+'<mo>+</mo>'+group(N(3)+'<mo>+</mo>'+N(2)+'<msqrt><mn>2</mn></msqrt>')+exp(N(-.2)+group(x+'<mo>−</mo>'+N(40)))),
 oyster:logisticFormula(53.63,.00018,.59),twoPoints:logisticFormula(15,twoPointA,7,10,x),
};
