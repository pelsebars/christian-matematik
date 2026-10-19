import {normalData} from './normal-data.js';
import {quantile,cdf,survival} from './normal-math.js';
import {outcomeClass} from './normal-standard-math.js';
const finite=v=>{if(!Number.isFinite(v))throw RangeError('Alle observationer skal være endelige tal.');};
export function sampleStatistics(values){
 if(!Array.isArray(values)||values.length<2)throw RangeError('Brug mindst to observationer.');
 let mean=0,sumSquares=0;values.forEach((value,index)=>{finite(value);const delta=value-mean;mean+=delta/(index+1);sumSquares+=delta*(value-mean);});
 const variance=Math.max(0,sumSquares)/(values.length-1),sd=Math.sqrt(variance);finite(mean);finite(sd);
 return {n:values.length,mean,sd,variance,populationSD:Math.sqrt(Math.max(0,sumSquares)/values.length),min:Math.min(...values),max:Math.max(...values)};
}
export function plottingPosition(rank,count){if(!Number.isInteger(count)||count<2||!Number.isInteger(rank)||rank<1||rank>count)throw RangeError('Rangen skal være fra én til antallet af observationer.');return (rank-.5)/count;}
const quantileCache=new Map();
export function normalPlotPoints(values){
 const stats=sampleStatistics(values);if(stats.sd===0)throw RangeError('Alle værdier er ens. Et normalplot med positiv spredning kan ikke tilpasses.');
 if(!quantileCache.has(stats.n))quantileCache.set(stats.n,Array.from({length:stats.n},(_,i)=>quantile(plottingPosition(i+1,stats.n))));
 const points=values.map((value,index)=>({value,original:index+1})).sort((a,b)=>a.value-b.value||a.original-b.original).map((p,i)=>({...p,rank:i+1,p:plottingPosition(i+1,stats.n),z:quantileCache.get(stats.n)[i],modelZ:(p.value-stats.mean)/stats.sd,classification:outcomeClass(p.value,stats.mean,stats.sd)}));
 return {...stats,points,exceptional:points.filter(p=>p.classification==='exceptional')};
}
export function readNormalPlotLine(slope,intercept,axes='observed'){
 finite(slope);finite(intercept);if(slope<=0||!['observed','theoretical'].includes(axes))throw RangeError('Brug en stigende linje og angiv aksernes betydning.');
 const result=axes==='observed'?{mean:-intercept/slope,sd:1/slope}:{mean:intercept,sd:slope};finite(result.mean);finite(result.sd);return result;
}
export const plotSources={
 carrots:{label:'Gulerødder · 400 poser',unit:'g',key:'carrots',decimals:1,judgement:'Punkterne ligger overvejende omtrent retlinjet. Materialet anvender en tilnærmet normalmodel. De to lave yderpunkter bør undersøges; de beviser hverken alene, at modellen er forkert, eller at målingerne skal slettes.'},
 volume:{label:'Rumfang · 100 kartoner',unit:'liter',key:'volume',decimals:3,judgement:'Punkterne ligger omtrent på en ret linje uden store systematiske afvigelser. Som i materialet er en normaltilnærmelse rimelig som arbejdsmodel, med forbehold for stikprøve og modelantagelser.'},
 height40:{label:'Højde · 40 personer',unit:'cm',key:'height40',decimals:1,judgement:'Punkterne følger omtrent en ret linje med mindre variation. Materialets normaltilnærmelse er rimelig for disse data; plottet beviser ikke, at alle personers højder følger samme normalmodel.'},
 height200:{label:'Højde · 200 klubmedlemmer',unit:'cm',key:'height200',decimals:2,judgement:'Der er et systematisk bøjet forløb med ændret hældning. Materialet afviser én samlet normalmodel. Fravær af observationer mere end tre stikprøvespredninger fra gennemsnittet ændrer ikke denne vurdering.'},
};
export const plotValues=Object.fromEntries(Object.keys(plotSources).map(key=>[key,normalData[key].rows.map(row=>row[0])]));
const sampleCache=new Map();
export function sourcePlot(key){if(!plotSources[key])throw RangeError('Ukendt datasæt.');if(!sampleCache.has(key))sampleCache.set(key,normalPlotPoints(plotValues[key]));return sampleCache.get(key);}
export function estimatedProbability(key,bound,side='left'){
 finite(bound);if(!['left','right'].includes(side))throw RangeError('Vælg en hale.');const stats=sampleStatistics(plotValues[key]||[]);return side==='left'?cdf(bound,stats.mean,stats.sd):survival(bound,stats.mean,stats.sd);
}
