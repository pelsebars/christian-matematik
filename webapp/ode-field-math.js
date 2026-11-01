import {math,N,x,exp,eq,fn,y,yp,frac,power,group,point} from './ode-local-math.js';
export {math,N,x,exp,eq,fn,y,yp,frac,power,group,point};
export const vesselLimit=(.15/.023)**(4/3);
export const cellExact=x=>(266**.2+.164/Math.log(.88)*(.88**x-.88**10))**5;
export const fieldModels={
 proportional:{label:'Proportional vækst',formula:yp+eq+N(3)+y,f:(x,y)=>3*y,initial:[0,2],bounds:[-.5,1,0,12],steps:[.1,.25,.5],step:.1},
 quartic:{label:'Polynomiel model',formula:yp+eq+power(y,2)+'<mo>−</mo>'+N(.25)+power(y,4),f:(x,y)=>y*y-.25*y**4,initial:[2,1],bounds:[-5,5,0,2.5],steps:[.1,.25,.5],step:.25},
 sine:{label:'Sinus af summen',formula:yp+eq+'<mi>sin</mi>'+group(x+'<mo>+</mo>'+y),f:(x,y)=>Math.sin(x+y),initial:[0,5],bounds:[0,10,0,5],steps:[.1,.25,.5],step:.25},
 cells:{label:'Cellemodellen',formula:'<msup><mi>N</mi><mo>′</mo></msup>'+eq+N(.82)+'<msup>'+N(.88)+'<mi>x</mi></msup>'+power('<mi>N</mi>',.8),f:(x,y)=>y>=0?.82*.88**x*y**.8:NaN,initial:[10,266],bounds:[0,60,0,550],steps:[1,2,5],step:1},
 vessel:{label:'Tilførsel og fordampning',formula:'<msup><mi>V</mi><mo>′</mo></msup>'+eq+N(.15)+'<mo>−</mo>'+N(.023)+'<msup><mi>V</mi><mfrac><mn>3</mn><mn>4</mn></mfrac></msup>',f:(x,y)=>y>=0?.15-.023*y**.75:NaN,initial:[0,0],bounds:[0,300,0,14],steps:[5,10,20],step:10},
};
// Stop rather than drawing a fabricated continuation through an invalid domain or overflow.
export function integrate(f,start,end,step,method='rk4'){
 const [a,b]=start,points=[{x:a,y:b}];
 if(![a,b,end,step].every(Number.isFinite)||step<=0||!['euler','rk4'].includes(method))throw Error('Ugyldige integrationsparametre');
 if(!Number.isFinite(f(a,b)))return {points:[],stopped:true,reason:"Begyndelsespunktet ligger uden for domænet."};
 const sign=Math.sign(end-a);let x=a,y=b;
 for(let i=0;sign*(end-x)>1e-10;i++){
  if(i>=20000)return {points,stopped:true,reason:'For mange beregningstrin.'};
  const h=sign*Math.min(step,Math.abs(end-x)),k1=f(x,y);
  let next;if(method==='euler')next=y+h*k1;else {const k2=f(x+h/2,y+h*k1/2),k3=f(x+h/2,y+h*k2/2),k4=f(x+h,y+h*k3);next=y+h*(k1+2*k2+2*k3+k4)/6;}
  if(!Number.isFinite(next)||Math.abs(next)>1e8||!Number.isFinite(f(x+h,next)))return {points,stopped:true,reason:'Beregningen forlader domænet eller bliver for stor.'};
  x+=h;y=next;points.push({x,y});
 }
 return {points,stopped:false,reason:''};
}
export const sourceImage=(name,alt)=>`<figure class="ode-source-figure"><img src="/ode-field-${name}.png" alt="${alt}" loading="lazy"><figcaption>Figur fra opgaveark 4. Brug figuren til din besvarelse. Egne skitser tegnes på papir og vurderes særskilt.</figcaption></figure>`;
