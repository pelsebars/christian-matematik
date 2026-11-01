import {math,N,x,exp,eq,frac,power,ln,group} from './ode-local-math.js';
export {math,N,x,exp,eq,frac,power,ln,group};
export const prob=body=>math('<mi>P</mi>'+group(body));
export const X='<mi>X</mi>';
export const choose=(n,k)=>{if(k<0||k>n)return 0;let c=1;for(let i=1;i<=Math.min(k,n-k);i++)c=c*(n-i+1)/i;return c;};
export function binomialPmf(n,p,k){if(!Number.isInteger(n)||n<0||p<0||p>1||!Number.isInteger(k)||k<0||k>n)return 0;return choose(n,k)*p**k*(1-p)**(n-k);}
export function binomialRange(n,p,from,to){let total=0;for(let k=Math.max(0,Math.ceil(from));k<=Math.min(n,Math.floor(to));k++)total+=binomialPmf(n,p,k);return total;}
