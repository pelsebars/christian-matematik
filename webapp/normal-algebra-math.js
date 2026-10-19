import {n,x,power,mi,op} from './normal-math.js';
export const y=mi('y');
const finite=values=>{if(!values.every(Number.isFinite))throw RangeError('Brug endelige tal.');};
export function squareCoefficients(a,b,sign=1){finite([a,b]);if(![1,-1].includes(sign))throw RangeError('Vælg plus eller minus.');return [b*b,2*sign*a*b,a*a];}
export function conjugateCoefficients(a,b){finite([a,b]);return [-b*b,0,a*a];}
export function polynomialBody(coefficients){
 return coefficients.map((value,index)=>({value,index})).reverse().filter(t=>t.value!==0).map(({value,index},i)=>`${value<0?op('−'):i?op('+'):''}${Math.abs(value)!==1||index===0?n(Math.abs(value)):''}${index?index===1?x:power(x,index):''}`).join('')||n(0);
}
export function linearBody(row){
 return row.slice(0,2).map((coefficient,i)=>({coefficient,symbol:i?y:x})).filter(t=>t.coefficient!==0).map(({coefficient,symbol},i)=>`${coefficient<0?op('−'):i?op('+'):''}${Math.abs(coefficient)!==1?n(Math.abs(coefficient)):''}${symbol}`).join('')||n(0);
}
export const equationBody=row=>linearBody(row)+op('=')+n(row[2]);
export function solveLinearSystem(first,second){
 if(![first,second].every(row=>Array.isArray(row)&&row.length===3))throw RangeError('Hver ligning skal have to koefficienter og en højreside.');finite([...first,...second]);
 const [a,b,c]=first,[d,e,f]=second,det=a*e-b*d;
 if(det!==0){const x=(c*e-b*f)/det,y=(a*f-c*d)/det;finite([x,y]);return {kind:'one',x,y};}
 const impossible=(!a&&!b&&c!==0)||(!d&&!e&&f!==0)||a*f!==c*d||b*f!==c*e;
 return {kind:impossible?'none':'many'};
}
export function checkPair(rows,x,y){finite([x,y]);return rows.map(row=>{finite(row);const actual=row[0]*x+row[1]*y,target=row[2],fits=Math.abs(actual-target)<=1e-10*Math.max(1,Math.abs(actual),Math.abs(target));return {actual,target,fits};});}
// Clip each line to the plotting square; also supports vertical and horizontal lines.
export function lineSegment([a,b,c],min=-2,max=7){
 finite([a,b,c,min,max]);if(min>=max)throw RangeError('Figurens grænser skal være stigende.');if(a===0&&b===0)return [];
 const points=[],add=(x,y)=>{if(x>=min-1e-10&&x<=max+1e-10&&y>=min-1e-10&&y<=max+1e-10&&!points.some(p=>Math.hypot(p[0]-x,p[1]-y)<1e-9))points.push([x,y]);};
 if(b!==0){add(min,(c-a*min)/b);add(max,(c-a*max)/b);}if(a!==0){add((c-b*min)/a,min);add((c-b*max)/a,max);}return points.slice(0,2);
}
export const algebraSystems={
 crossing:{title:'To forskellige linjer med ét skæringspunkt',rows:[[1,1,5],[2,-1,4]],candidate:[1,4]},
 scaled:{title:'Forskellige koefficienter',rows:[[2,3,11],[3,-2,10]],candidate:[3,2]},
 parallel:{title:'Parallelle linjer',rows:[[1,1,5],[2,2,12]],candidate:[3,2]},
 same:{title:'Samme linje, to ligninger',rows:[[1,1,5],[2,2,10]],candidate:[3,2]},
};
export function squareArea(a,b){finite([a,b]);if(a<=0||b<=0)throw RangeError('Sidelængderne skal være positive.');return {a,b,side:a+b,parts:[a*a,a*b,a*b,b*b],total:(a+b)**2};}
