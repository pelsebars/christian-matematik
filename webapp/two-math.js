// The second derivative test only applies at a stationary interior point.
export function classifyStationary(xx,yy,xy){
 const determinant=xx*yy-xy*xy;
 return {determinant,kind:determinant<0?'saddle':determinant>0?(xx>0?'min':'max'):'unknown'};
}
