// Small MathML building blocks. All visible vector notation stays structural.
export const mi=s=>`<mi>${s}</mi>`;
export const n=v=>{const s=String(v).replace('.',',');return s.startsWith('-')?`<mrow><mo>−</mo><mn>${s.slice(1)}</mn></mrow>`:`<mn>${s}</mn>`;};
export const op=s=>`<mo>${s}</mo>`;
export const row=s=>`<mrow>${s}</mrow>`;
export const sub=(s,k)=>`<msub>${row(s)}${n(k)}</msub>`;
export const par=s=>row(op('(')+s+op(')'));
export const pow=(s,k=2)=>`<msup>${row(s)}${n(k)}</msup>`;
export const frac=(a,b)=>`<mfrac>${row(a)}${row(b)}</mfrac>`;
export const vec=s=>`<mover>${row(mi(s))}<mo>→</mo></mover>`;
export const col=(a,b)=>row(op('(')+`<mtable><mtr><mtd>${a}</mtd></mtr><mtr><mtd>${b}</mtd></mtr></mtable>`+op(')'));
export const pair=(a,b)=>par(a+op(';')+b);
export const fn=(s,arg=mi('t'))=>mi(s)+par(arg);
export const vf=(a,b,s='r',arg=mi('t'))=>vec(s)+par(arg)+op('=')+col(a,b);
export const math=s=>`<math xmlns="http://www.w3.org/1998/Math/MathML"><mrow>${s}</mrow></math>`;
export const t=mi('t'),x=mi('x'),y=mi('y'),eq=op('='),plus=op('+'),minus=op('−'),times=op('·');
export const interval=(a,b,arg=t)=>n(a)+op('≤')+arg+op('≤')+n(b);
export const point=(a,b)=>math(pair(n(a),n(b)));
export const curve=(a,b)=>math(vf(a,b));
export const axisCurve=curve(pow(t)+plus+n(4)+t,t+plus+n(1));
export const loopCurve=curve(pow(t)+minus+t,pow(t,3)+minus+n(3)+t+plus+n(1));
export const tennisCurve=curve(n('14,8')+t,minus+n('4,9')+pow(t)+plus+n('3,3')+t+plus+n('1,1'));
// Shared with the interactive diagram, not with the independent answer tests.
export const plotCurves={
 parabola:{label:'Parabel',at:t=>[t+2,t*t+4*t+3],min:-4,max:2,bounds:[-3,5,-2,16],formula:curve(t+plus+n(2),pow(t)+plus+n(4)+t+plus+n(3))},
 loop:{label:'Dobbeltpunkt',at:t=>[t*t-t,t*t*t-3*t+1],min:-1.5,max:2.3,bounds:[-1,4,-3,7],formula:loopCurve},
 circle:{label:'Cirkel',at:t=>[2+4*Math.cos(t),1+4*Math.sin(t)],min:0,max:2*Math.PI,bounds:[-3,7,-4,6],formula:curve(n(2)+plus+n(4)+fn('cos'),n(1)+plus+n(4)+fn('sin'))}
};
