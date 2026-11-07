// The second derivative test only applies at a stationary interior point.
export function classifyStationary(xx,yy,xy){
 const determinant=xx*yy-xy*xy;
 return {determinant,kind:determinant<0?'saddle':determinant>0?(xx>0?'min':'max'):'unknown'};
}
export function openBox(x,y,volume=32){
 if(![x,y,volume].every(v=>Number.isFinite(v)&&v>0))return null;
 return {height:volume/(x*y),area:x*y+2*volume/x+2*volume/y,dx:y-2*volume/(x*x),dy:x-2*volume/(y*y)};
}
