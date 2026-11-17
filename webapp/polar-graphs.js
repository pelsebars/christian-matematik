export function bindPolarGraph(root){
 root.innerHTML=`<div class="polar-controls"><label for="polar-radius">Radius r <input id="polar-radius" type="range" min="0" max="5" value="4" step="0.1"></label><label for="polar-angle">Vinkel θ i grader <input id="polar-angle" type="range" min="0" max="360" value="60" step="1"></label></div><svg viewBox="0 0 400 400" role="img" aria-labelledby="polar-graph-title polar-graph-desc"><title id="polar-graph-title">Punktets radius og koordinater</title><desc id="polar-graph-desc">Vinklen måles fra positiv x-akse mod uret. De aktuelle koordinater står under grafen.</desc><circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" opacity=".15"/><path d="M20 200H380 M200 380V20" stroke="currentColor" opacity=".5"/><text x="375" y="190">x</text><text x="210" y="25">y</text><text x="207" y="220">0</text><path data-projection fill="none" stroke="currentColor" stroke-dasharray="5 5" opacity=".5"/><line data-radius x1="200" y1="200" stroke="#2563eb" stroke-width="3"/><path data-angle fill="none" stroke="#b45309" stroke-width="3"/><circle data-point r="6" fill="#2563eb"/></svg><p class="polar-readout" data-polar-readout role="status" aria-live="polite"></p>`;
 const radius=root.querySelector('#polar-radius'),angle=root.querySelector('#polar-angle');
 const fmt=n=>(Math.abs(n)<.0005?0:n).toLocaleString('da-DK',{maximumFractionDigits:3});
 function draw(){
  const r=Number(radius.value),deg=Number(angle.value),theta=deg*Math.PI/180,x=r*Math.cos(theta),y=r*Math.sin(theta),px=200+30*x,py=200-30*y;
  for(const [name,value] of Object.entries({x2:px,y2:py}))root.querySelector('[data-radius]').setAttribute(name,value);
  root.querySelector('[data-point]').setAttribute('cx',px);root.querySelector('[data-point]').setAttribute('cy',py);
  root.querySelector('[data-projection]').setAttribute('d',`M${px} 200V${py}H200`);
  const segments=Math.max(2,Math.ceil(deg/5)+1);
  root.querySelector('[data-angle]').setAttribute('d',Array.from({length:segments},(_,i)=>{const t=theta*i/(segments-1);return `${i?'L':'M'}${200+24*Math.cos(t)} ${200-24*Math.sin(t)}`;}).join(' '));
  root.querySelector('[data-polar-readout]').textContent=`r=${fmt(r)} · θ=${fmt(deg)}°=${fmt(theta)} rad · x=${fmt(x)} · y=${fmt(y)}. ${r===0?'Origo: alle vinkler giver samme punkt.':deg%90===0?'Punktet ligger på en koordinatakse.':`Kvadrant ${Math.floor(deg/90)+1}.`}`;
 }
 root.addEventListener('input',draw);draw();
}
