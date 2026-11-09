import test from 'node:test';
import assert from 'node:assert/strict';
import {normalScaleModel,normalScaleCurve,normalScaleOverviewSvg} from '../normal-scale-overview.js';
const near=(a,b,t=1e-10)=>assert.ok(Math.abs(a-b)<t,`${a} versus ${b}`);

test('the reference chart standardizes signed distances and returns to the same original value',()=>{
 for(const mean of [-40,0,1000])for(const sd of [.2,20,37])for(const z of [-2,0,2]){
  const m=normalScaleModel({mean,sd,z});near(m.value,mean+sd*z);near(m.z,z);near(m.returned,m.value);assert.equal(Math.sign(m.z),Math.sign(m.value-mean));
 }
 for(const [z,value] of [[-2,960],[0,1000],[2,1040]])assert.equal(normalScaleModel({z}).returned,value);
});
test('standardization preserves the left probability and first quartile on both scales',()=>{
 for(const [z,p] of [[-2,.0227501319481792],[0,.5],[2,.9772498680518208]]){
  const m=normalScaleModel({z});near(m.p,p);near(m.quartileZ,-.6744897501960817);near(m.quartile,986.5102049960784);
  assert.match(normalScaleCurve(m),/Første kvartil er 986,51 mL/);assert.match(normalScaleCurve(m,true),/Første kvartil er −0,674/);
 }
});
test('the spread arrow spans one standard deviation and the standalone chart includes both conversion directions',()=>{
 const m=normalScaleModel(),svg=normalScaleCurve(m),spread=svg.match(/data-scale-spread="" d="M([\d.]+) 36H([\d.]+)/);
 near(Number(spread[2])-Number(spread[1]),500/7);assert.match(svg,/σ = 20 mL/);assert.match(normalScaleCurve(m,true),/σ = 1/);
 const file=normalScaleOverviewSvg({z:-2});assert.match(file,/xmlns="http:\/\/www.w3.org\/2000\/svg"/);assert.match(file,/z = \(x − μ\) \/ σ/);assert.match(file,/x = μ \+ σ · z/);assert.match(file,/x = 960 mL/);assert.match(file,/z = −2/);assert.match(file,/Φ⁻¹\(p\)/);assert.doesNotMatch(file,/NaN|Infinity|<script|<foreignObject/);
 assert.match(normalScaleCurve(normalScaleModel({z:0})),/μ = x/);assert.match(normalScaleCurve(normalScaleModel({z:0}),true),/0 = z/);
});
test('the reference model rejects invalid scales and unsupported positions',()=>{
 for(const options of [{sd:0},{sd:-1},{sd:NaN},{mean:Infinity},{z:NaN},{z:4}])assert.throws(()=>normalScaleModel(options),RangeError);
});
