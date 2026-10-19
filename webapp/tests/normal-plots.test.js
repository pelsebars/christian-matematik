import test from 'node:test';
import assert from 'node:assert/strict';
import {sampleStatistics,plottingPosition,normalPlotPoints,readNormalPlotLine,plotSources,plotValues,sourcePlot,estimatedProbability} from '../normal-plot-math.js';
import {plotSvg,datasetFigure,readingFigure,municipalFigure} from '../normal-plot-figures.js';
import {normalPlotTasks} from '../tasks/bank/normal-plots.js';
import {plotLessonTasks,plotRequired} from '../normal-plot-lesson.js';
import {plotPre,plotMini,plotFinal} from '../normal-plot-exercises.js';
import {normalImplemented,pagesForNormalModule,parseNormalRoute,plotSteps} from '../normal-routes.js';
import {cdf} from '../normal-math.js';
import {normalData} from '../normal-data.js';
import {bank,instantiate} from '../tasks/bank/index.js';
import {goals} from '../tasks/catalog.js';
import {validateTask} from '../tasks/schema.js';
import {gradePart,targetedFeedback} from '../tasks/grading.js';
import {composeSet} from '../tasks/selection.js';
const near=(a,b,t=1e-9)=>assert.ok(Math.abs(a-b)<=t,`${a} versus ${b}`);
const get=id=>normalPlotTasks.find(t=>t.id==='norm4.'+id);
const answer=(id,part)=>Number(get(id).parts.find(p=>p.id===part).answer);
const expected={carrots:[400,400.432,9.481107768150206,9.469248967051188,371.2,427.9,-3.023341439739147,2],volume:[100,.98492,.05552025383460152,.05524195507039915,.867,1.107,-2.5758293035489,0],height40:[40,183.17,7.790796674314686,7.6927953306974155,167.3,197.2,-2.2414027276049446,0],height200:[200,175.08605,5.546013543856815,5.532131135240742,163.85,186.37,-2.807033768343804,0]};
test('all four original datasets match independent workbook statistics and retain order and duplicates',()=>{
 for(const [key,[n,mean,sd,pop,min,max,z,exceptional]] of Object.entries(expected)){
  const values=plotValues[key],before=values.slice(),model=sourcePlot(key);assert.equal(model.n,n);near(model.mean,mean,1e-10);near(model.sd,sd,1e-11);near(model.populationSD,pop,1e-11);assert.equal(model.min,min);assert.equal(model.max,max);near(model.points[0].z,z,2e-11);near(model.points.at(-1).z,-z,2e-11);assert.equal(model.exceptional.length,exceptional);assert.deepEqual(values,before);assert.deepEqual(values,normalData[key].rows.map(r=>r[0]));assert.equal(new Set(model.points.map(p=>p.original)).size,n);assert.ok(model.points.every((p,i)=>p.rank===i+1&&p.value===values[p.original-1]));
 }
 assert.equal(plotValues.carrots.filter(v=>v<396).length,121);assert.deepEqual(sourcePlot('carrots').exceptional.map(p=>p.original),[1,201]);
});
test('rank plotting positions are explicit, finite and separate from actual fitted z values',()=>{
 const values=[3,1,1,5],model=normalPlotPoints(values);assert.deepEqual(model.points.map(p=>p.value),[1,1,3,5]);assert.deepEqual(model.points.map(p=>p.original),[2,3,1,4]);assert.deepEqual(model.points.map(p=>p.p),[.125,.375,.625,.875]);
 for(const p of model.points){near(cdf(p.z),p.p,1e-12);near(p.modelZ,(p.value-model.mean)/model.sd);}
 assert.notEqual(model.points[0].z,model.points[0].modelZ);assert.notEqual(model.points[0].z,model.points[1].z);
 for(const [rank,n] of [[0,4],[5,4],[1,1],[1.5,4],[1,NaN]])assert.throws(()=>plottingPosition(rank,n));
 assert.deepEqual(values,[3,1,1,5]);assert.equal(plottingPosition(1,400),.00125);assert.equal(plottingPosition(400,400),.99875);
});
test('sample spread uses n minus one, returns original units, and handles invalid or constant data',()=>{
 const model=sampleStatistics([2,4,6]);assert.equal(model.mean,4);assert.equal(model.variance,4);assert.equal(model.sd,2);near(model.populationSD,Math.sqrt(8/3));
 const shifted=sampleStatistics([1000000002,1000000004,1000000006]);assert.equal(shifted.sd,2);near(sampleStatistics([.002,.004,.006]).sd,.002,1e-14);
 assert.equal(sampleStatistics([3,3,3]).sd,0);assert.throws(()=>normalPlotPoints([3,3,3]),/ens/);
 for(const values of [[],[1],[1,NaN],[Infinity,2],null])assert.throws(()=>sampleStatistics(values));assert.throws(()=>sourcePlot('missing'));
});
test('parameter reading respects both orientations and the reciprocal slope',()=>{
 for(const [mean,sd] of [[10,4],[24,3],[24.7,4.4],[-5,.025]]){const source=readNormalPlotLine(1/sd,-mean/sd),swapped=readNormalPlotLine(sd,mean,'theoretical');near(source.mean,mean);near(source.sd,sd);assert.deepEqual(swapped,{mean,sd});}
 for(const args of [[0,1],[-1,1],[NaN,1],[1,Infinity],[1,0,'bad']])assert.throws(()=>readNormalPlotLine(...args));
});
test('figures contain every original point on both correctly labelled axes without duplicate IDs or nonfinite coordinates',()=>{
 for(const key of Object.keys(plotSources))for(const axes of ['observed','theoretical']){const model=sourcePlot(key),svg=plotSvg(model,{axes,selected:1,extremes:true,label:plotSources[key].label});assert.equal((svg.match(/<circle /g)||[]).length,model.n);assert.match(svg,/data-qq-rank="1"/);assert.match(svg,axes==='observed'?/Vandret: måling; lodret: teoretisk normalfraktil/:/Vandret: teoretisk normalfraktil; lodret: måling/);assert.doesNotMatch(svg,/NaN|Infinity|id="/);for(const match of svg.matchAll(/(?:cx|cy)="([^\"]+)"/g))assert.ok(Number.isFinite(Number(match[1])));}
 for(const key of Object.keys(plotSources)){const figure=datasetFigure(key,{graph:false});assert.equal((figure.match(/<tr>/g)||[]).length,plotValues[key].length+1);assert.match(figure,new RegExp(normalData[key].source.split('/').at(-1).replaceAll('.','\\.')));}
 for(const kind of ['first','qq','u1']){assert.match(readingFigure(kind),/illustrative/);assert.doesNotMatch(readingFigure(kind),/Centrum aflæses/);}assert.match(municipalFigure(),/ingen parametre/);
});
test('source task answers match independent estimates, probabilities, counts and exact boundary conventions',()=>{
 near(answer('carrots','mean'),400.432);near(answer('carrots','sd'),9.481107768150206);near(answer('volume','mean'),.98492);near(answer('volume','sd'),.05552025383460152);
 near(estimatedProbability('volume',1,'right'),.3929599585246041,1e-11);near(answer('volume','p'),estimatedProbability('volume',1,'right'));
 near(estimatedProbability('carrots',396),.3200868594423768,1e-11);near(answer('model-p','model'),estimatedProbability('carrots',396));near(answer('model-p','observed'),121/400);
 near(answer('read-line','mean')-2*answer('read-line','sd'),answer('read-line','lower'));near(answer('read-line','mean')+2*answer('read-line','sd'),answer('read-line','upper'));
 assert.equal(get('read-qq').parts[2].answer,'yes');assert.ok(33.4>24+3*3);assert.ok(14>24.7-3*4.4&&37<24.7+3*4.4);assert.equal(get('u1').parts[2].answer,'no');
 near(answer('outlier','z'),(371.2-400.432)/9.481107768,1e-9);assert.equal(sourcePlot('height200').exceptional.length,0);assert.equal(get('height200').parts[0].answer,'reject');
});
test('lessons and bank cover every goal with separate error feedback, prescribed rounding and unchanged old versions',()=>{
 assert.equal(plotLessonTasks.length,43);assert.equal(plotRequired.length,35);assert.equal(plotPre.length,8);assert.equal(plotMini.length,12);assert.equal(plotFinal.length,7);assert.equal(normalPlotTasks.length,16);
 for(const task of normalPlotTasks){validateTask(task);assert.deepEqual(instantiate(task.id,'plot-quality'),task);assert.deepEqual(task.prerequisites,['norm.1','norm.2']);assert.ok(task.hints.length>=2);}
 for(const task of plotLessonTasks)for(const p of task.parts)assert.equal(gradePart(p,p.answer).status,'correct',task.id+':'+p.id);
 for(const [id] of Object.entries(goals).filter(([,g])=>g.module==='norm.4'))assert.ok(normalPlotTasks.some(t=>t.goals.includes(id)),id);
 for(const [id,part,rounded] of [['carrots','sd','9,4811'],['volume','sd','0,05552'],['volume','p','0,3930'],['model-p','model','0,3201'],['outlier','z','-3,083']])assert.equal(gradePart(get(id).parts.find(p=>p.id===part),rounded).status,'correct');
 assert.match(targetedFeedback(get('sample-sd'),get('sample-sd').parts[1],'4'),/variansen/);assert.match(targetedFeedback(get('carrots'),get('carrots').parts[1],'9.4692'),/Definitionsfejl/);assert.match(targetedFeedback(get('read-line'),get('read-line').parts[1],'0.25'),/Aksefejl/);assert.match(targetedFeedback(get('model-p'),get('model-p').parts[0],'0.3025'),/optalte andel/);
 for(const source of bank.filter(t=>t.module!=='norm.4')){const saved=instantiate(source.id,'legacy');assert.deepEqual(instantiate(source.id,'legacy',saved.version),saved);}
});
test('ten direct routes preserve prior modules and require the right bank prerequisites',()=>{
 assert.deepEqual(normalImplemented,['1','2','3','repetition','4']);assert.equal(plotSteps.length,10);for(const module of normalImplemented)for(const path of pagesForNormalModule(module))assert.equal(parseNormalRoute('#'+path).path,path);
 assert.equal(parseNormalRoute('#normalDistribution/4').path,'normalDistribution/4/start');assert.equal(parseNormalRoute('#normalDistribution/4/bad').step,'start');assert.equal(parseNormalRoute('#normalDistribution/5').step,'');
 const config={topics:['normalDistribution'],minutes:700,distribution:{short:50,medium:50,complex:50},onlyCompleted:true};assert.equal(composeSet({...config,completed:['norm.4']}).tasks.length,0);assert.equal(composeSet({...config,completed:['norm.1','norm.4']}).tasks.length,12);assert.equal(composeSet({...config,completed:['norm.1','norm.2','norm.4']}).tasks.length,43);assert.equal(composeSet({...config,onlyCompleted:false}).tasks.length,75);
});
