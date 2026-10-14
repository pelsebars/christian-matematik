import {n,x,frac} from './integral-math.js';
export const inverse=(arg=x)=>`<msup><mi>f</mi><mrow>${n(-1)}</mrow></msup><mo>(</mo>${arg}<mo>)</mo>`;
export const root=body=>`<msqrt><mrow>${body}</mrow></msqrt>`;
export const rationalPower=(base,p,q)=>`<msup><mrow>${/^<(mi|mn)>[^<]+<\/\1>$/.test(base)?base:`<mo>(</mo>${base}<mo>)</mo>`}</mrow><mrow>${frac(n(p),n(q))}</mrow></msup>`;
