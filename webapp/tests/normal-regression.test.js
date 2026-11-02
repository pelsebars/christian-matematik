import test from 'node:test';
import assert from 'node:assert/strict';
import {studentCDF,studentQuantile,intervalConclusion,linearRegression,sourceRegression,regressionSources,regressionPairs,reciprocalPairs,squaredPairs,transformedRegression,transformedPrediction,simulateIntervals} from '../normal-regression-math.js';
import {regressionSvg,slopeIntervalSvg,regressionDataFigure,coverageSvg} from '../normal-regression-figures.js';
import {regressionContent} from '../normal-regression-content.js';
import {regressionLessonTasks,regressionRequired} from '../normal-regression-lesson.js';
import {regressionTaskStep} from '../normal-regression-exercises.js';
import {normalRegressionTasks} from '../tasks/bank/normal-regression.js';
import {normalImplemented,regressionSteps,pagesForNormalModule,parseNormalRoute} from '../normal-routes.js';
import {normalData} from '../normal-data.js';
import {bank,instantiate} from '../tasks/bank/index.js';
import {validateTask} from '../tasks/schema.js';
import {gradePart,targetedFeedback} from '../tasks/grading.js';
import {goals} from '../tasks/catalog.js';
import {composeSet} from '../tasks/selection.js';
const near=(a,b,t=1e-9)=>assert.ok(Math.abs(a-b)<=t,`${a} versus ${b}`);
// Independent workbook calculations using centered sums and Simpson integration of t density.
export const reference={grain:[56,4.0253051948051946,72.61071428571428,5.491976458404836,.0454052952335698,3.9342730588173946,4.1163373307929945],flowers:[100,.8071794871794872,3.878287179487179,.4951550719363173,.1585765350327752,.49248951435843574,1.1218694600005386],phillips:[18,-.25123777824006654,3.7103557312252966,1.0783314448783925,.14754906554263245,-.5640278241791239,.06155226769899075],unibrew:[106,.024543643722906277,7.903410997042048,6.001219623842442,.0006539679730648261,.023246800691200758,.025840486754611796]};
test('finite sample Student quantiles match independent references including one degree of freedom',()=>{
 for(const [df,t] of [[1,1/Math.tan(Math.PI*.025)],[2,4.30265272969614],[16,2.11990529922184],[54,2.004879288187],[98,1.9844674545071],[104,1.98303752648292]]){near(studentQuantile(.975,df),t,2e-10);near(studentCDF(t,df),.975,2e-12);near(studentQuantile(.025,df),-t,2e-10);}
 for(const df of [1,2,16,100])for(const t of [-10,-1,0,1,10])near(studentCDF(t,df)+studentCDF(-t,df),1,2e-14);
 near(studentCDF(1,1),.75);assert.equal(studentQuantile(.5,16),0);
 for(const df of [0,-1,2.5,NaN])assert.throws(()=>studentCDF(1,df));for(const p of [0,1,NaN,-.1])assert.throws(()=>studentQuantile(p,16));
});
test('all original paired datasets retain exact pairings and reproduce independent slope intervals',()=>{
 for(const [key,[n,a,b,s,se,lo,hi]] of Object.entries(reference)){const before=structuredClone(normalData[key]),model=sourceRegression(key);assert.equal(model.n,n);near(model.slope,a,2e-12);near(model.intercept,b,2e-11);near(model.residualSD,s,2e-12);near(model.se,se,2e-12);near(model.lower,lo,2e-11);near(model.upper,hi,2e-11);assert.equal(model.df,n-2);near(model.margin,model.t*model.se);near(model.points.reduce((s,p)=>s+p.residual,0),0,1e-9);assert.deepEqual(normalData[key],before);assert.equal(model.points.length,n);for(const p of model.points){assert.deepEqual([p.x,p.y],regressionPairs[key][p.row-1]);near(p.residual,p.y-p.fitted);}}
 assert.deepEqual(regressionPairs.grain[0],[0,65.86]);assert.deepEqual(regressionPairs.grain.at(-1),[55,291.95]);assert.deepEqual(regressionPairs.phillips[0],[4,3.4]);assert.equal(sourceRegression('phillips').conclusion,'includes-zero');assert.equal(sourceRegression('flowers').conclusion,'positive');
});
test('regression residuals, degrees of freedom, units and centered computation handle special cases',()=>{
 const exact=linearRegression([[1,3],[2,5],[3,7]]);assert.equal(exact.slope,2);assert.equal(exact.intercept,1);assert.equal(exact.residualSD,0);assert.equal(exact.lower,2);assert.equal(exact.upper,2);
 const model=linearRegression([[1,3],[2,4],[3,8],[4,9]]);near(model.sse,1.8);near(model.residualSD,Math.sqrt(.9));assert.equal(model.df,2);assert.ok(model.points.some(p=>p.residual<0));
 const shifted=linearRegression([[1e9+1,3],[1e9+2,4],[1e9+3,8],[1e9+4,9]]);near(shifted.slope,model.slope);near(shifted.residualSD,model.residualSD);
 assert.equal(linearRegression([[1,3],[2,3],[3,3]]).r2,null);
 for(const values of [[],[[1,2],[2,3]],[[1,2],[1,3],[1,4]],[[1,2],[2,NaN],[3,5]],[[1,2,3],[2,3],[3,4]],null])assert.throws(()=>linearRegression(values));assert.throws(()=>sourceRegression('missing'));
});
test('zero is included on either interval endpoint and absence of zero separates both directions',()=>{
 for(const [lo,hi,expected] of [[.1,.4,'positive'],[-.4,-.1,'negative'],[-.1,.4,'includes-zero'],[-.4,0,'includes-zero'],[0,.4,'includes-zero'],[0,0,'includes-zero']])assert.equal(intervalConclusion(lo,hi),expected);
 assert.throws(()=>intervalConclusion(1,-1));assert.throws(()=>intervalConclusion(NaN,2));
});
test('source reciprocal and squared response regressions return to the original scale and respect domains',()=>{
 const reciprocal=transformedRegression(reciprocalPairs,'reciprocal'),squared=transformedRegression(squaredPairs,'squared');near(reciprocal.slope,4.939253153768071);near(reciprocal.intercept,9.384505699984164);near((50-reciprocal.intercept)/reciprocal.slope,8.223003161729213);near(transformedPrediction(reciprocal,8.223003161729213,'reciprocal'),.02);
 near(squared.slope,-17.751428571428576);near(squared.intercept,15.621619047619049);near(transformedPrediction(squared,.1,'squared'),3.721085351141007);
 assert.throws(()=>transformedPrediction(squared,1,'squared'));assert.throws(()=>transformedPrediction(reciprocal,-2,'reciprocal'));assert.throws(()=>transformedRegression([[1,0],[2,1],[3,2]],'reciprocal'));assert.throws(()=>transformedRegression(squaredPairs,'wrong'));
});
test('simulation generates real sample intervals reproducibly without forcing an exact coverage count',()=>{
 const simulation=simulateIntervals();assert.deepEqual(simulateIntervals(),simulation);assert.notDeepEqual(simulateIntervals({seed:2}),simulation);assert.equal(simulation.intervals.length,100);assert.equal(simulation.covered,simulation.intervals.filter(i=>i.lower<=2&&i.upper>=2).length);assert.ok(simulation.covered>=85&&simulation.covered<=100);assert.ok(simulation.intervals.some(i=>!i.covers));
 const wider=simulateIntervals({noise:6}),meanWidth=s=>s.intervals.reduce((v,i)=>v+i.upper-i.lower,0)/100;near(meanWidth(wider),2*meanWidth(simulation));assert.ok(meanWidth(simulateIntervals({n:60}))<meanWidth(simulation));
 for(const args of [{n:2},{noise:0},{count:301},{seed:1.5}])assert.throws(()=>simulateIntervals(args));
});
test('SVG plots retain every observation, finite coordinates, labelled axes and complete paired data',()=>{
 for(const key of Object.keys(regressionSources)){const model=sourceRegression(key);for(const mode of ['scatter','residual','qq']){const svg=regressionSvg(model,{...regressionSources[key],mode});assert.equal((svg.match(/<circle /g)||[]).length,model.n);assert.doesNotMatch(svg,/NaN|Infinity|id="/);assert.match(svg,/role="img"/);}const figure=regressionDataFigure(key);assert.equal((figure.match(/<tr>/g)||[]).length,model.n+1);assert.doesNotMatch(figure,/Facit|Konklusion|Fejlmargin/);assert.match(slopeIntervalSvg(model),/Nul er markeret/);const selected=regressionSvg(model,{mode:'qq',selected:2});assert.equal((selected.match(/r="5"/g)||[]).length,1);}
 assert.equal((coverageSvg(simulateIntervals()).match(/data-coverage=/g)||[]).length,100);
});
test('all new tasks cover their goals, source results, rounding and targeted mathematical misconceptions',()=>{
 assert.equal(normalRegressionTasks.length,18);assert.equal(regressionLessonTasks.length,48);assert.equal(regressionRequired.length,40);
 for(const t of normalRegressionTasks){validateTask(t);assert.deepEqual(instantiate(t.id,'regression-quality'),t);assert.ok(t.hints.length>=2);assert.ok(t.solution.length>100);}for(const t of regressionLessonTasks)for(const p of t.parts)assert.equal(gradePart(p,p.answer).status,'correct',t.id+' '+p.id);
 for(const [goal] of Object.entries(goals).filter(([,g])=>g.module==='norm.5'))assert.ok(normalRegressionTasks.some(t=>t.goals.includes(goal)),goal);
 const get=id=>normalRegressionTasks.find(t=>t.id==='norm5.'+id);
 for(const [key,ref] of Object.entries(reference)){const t=get(key);for(const [id,v] of [['a',ref[1]],['b',ref[2]],['lower',ref[5]],['upper',ref[6]]]){const part=t.parts.find(p=>p.id===id);if(part){near(Number(part.answer),v,1e-10);assert.equal(gradePart(part,v.toFixed(4).replace('.',',')).status,'correct');}}}
 assert.match(targetedFeedback(get('residual'),get('residual').parts[1],'-8'),/Fortegnsfejl/);assert.match(targetedFeedback(get('residual-spread'),get('residual-spread').parts[0],'9'),/kvadratroden/);
 assert.match(targetedFeedback(get('zero'),get('zero').parts[1],'yes'),/ikke.*sikkerhed/);assert.match(targetedFeedback(get('coverage'),get('coverage').parts[0],'parameter'),/Intervalfortolkning/);
 for(const old of bank.filter(t=>t.module!=='norm.5'))assert.deepEqual(instantiate(old.id,'legacy',old.version),instantiate(old.id,'legacy'));
});
test('twelve direct routes, independent progression and bank prerequisites integrate the sixth teaching session',()=>{
 assert.deepEqual(normalImplemented,['1','2','3','repetition','4','5']);assert.equal(regressionSteps.length,12);assert.equal(parseNormalRoute('#normalDistribution/5').path,'normalDistribution/5/start');assert.equal(parseNormalRoute('#normalDistribution/5/bad').step,'start');assert.equal(parseNormalRoute('#normalDistribution/opsamling').step,'');
 for(const t of regressionLessonTasks)assert.ok(pagesForNormalModule('5').includes('normalDistribution/5/'+regressionTaskStep(t)),t.id);
 const config={topics:['normalDistribution'],minutes:1000,distribution:{short:100,medium:100,complex:100},onlyCompleted:true};assert.equal(composeSet({...config,completed:['norm.5']}).tasks.length,0);assert.equal(composeSet({...config,completed:['norm.1','norm.4','norm.5']}).tasks.filter(t=>t.module==='norm.5').length,18);assert.equal(composeSet({...config,onlyCompleted:false}).tasks.length,93);
 const html=regressionContent();assert.equal((html.match(/data-normal-step=/g)||[]).length,12);assert.equal((html.match(/data-int-card=/g)||[]).length,48);assert.match(html,/Det vigtigste at forstå/);assert.doesNotMatch(html.replace(/<[^>]+>/g,' '),/sqrt|x\^2|N\(mu/);
});
