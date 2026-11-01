import { math,n,x,exp,eq,fn } from './integral-math.js';
export { math,x,exp,eq,fn };
export const N=value=>n(value).replace(/\./g,',');
export const k='<mi>k</mi>', C='<mi>C</mi>', y='<mi>y</mi>', t='<mi>t</mi>', yp='<msup><mi>y</mi><mo>′</mo></msup>';
export const formula=(b,rate,offset=0,variable=x)=>N(b)+exp(N(rate)+(offset?'<mo>(</mo>'+variable+'<mo>−</mo>'+N(offset)+'<mo>)</mo>':variable));
export const modelValue=(b,rate,time,start=0)=>b*Math.exp(rate*(time-start));
export const rateBetween=(a,b,elapsed)=>Math.log(b/a)/elapsed;
