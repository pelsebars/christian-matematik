import {x} from './integral-math.js';
export const u='<mi>u</mi>',C='<mi>C</mi>';
export const differential=v=>`<mi mathvariant="normal">d</mi>${v}`;
export const indefinite=(body,variable=x)=>`<mo>∫</mo><mrow>${body}</mrow><mspace width="0.2em"/>${differential(variable)}`;
export const trig=(name,arg=x)=>`<mi mathvariant="normal">${name}</mi><mo>(</mo>${arg}<mo>)</mo>`;
export const abs=body=>`<mo>|</mo>${body}<mo>|</mo>`;
