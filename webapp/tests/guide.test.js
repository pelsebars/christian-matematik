import {parseTrigRoute} from '../trig-plan.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {handleTutor} from '../server/tutor.js';
import {guideCurriculum} from '../guide-curriculum.js';
import {parseGuideReply,validGuideImage} from '../server/guide.js';
import {parseNormalRoute} from '../normal-routes.js';
import {parseOdeRoute} from '../ode-routes.js';
import {parseVectorRoute} from '../vector-routes.js';
import {parseIntegralRoute} from '../integral-routes.js';
const env={OPENAI_API_KEY:'test-only',OPENAI_TUTOR_MODEL:'old-model',OPENAI_GUIDE_MODEL:'vision-model'};
const pool={query:async()=>({rowCount:1})};
const png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=';
const payload={mode:'guide',context:'Hvornår er kuglen højest?',messages:[{role:'user',content:'Hjælp mig i gang'}]};
const req=body=>new Request('http://localhost/api/tutor',{method:'POST',body:JSON.stringify(body)});
const result={reply:'Højest peger på et maksimum.',reading:'',references:['maximum']};
const upstream=reply=>Response.json({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(reply)}]}]});
test('guide sends actual image with curated curriculum, strips extra message properties and resolves links on server',async()=>{
 let sent;
 const response=await handleTutor(req({...payload,image:png,messages:[{...payload.messages[0],tool_calls:['do not forward']}]}),pool,'a',{env,fetchImpl:async(_,options)=>{sent=JSON.parse(options.body);return upstream(result);}});
 assert.equal(response.status,200); const data=await response.json();assert.equal(data.references[0].route,'formulas');
 assert.equal(sent.model,'vision-model');assert.equal(sent.store,false);assert.equal(sent.input[0].content[1].image_url,png);
 assert.equal(sent.text.format.strict,true);assert.match(sent.instructions,/normalfordelt/);assert.equal(sent.input[1].tool_calls,undefined);
});
test('invalid image sources, malformed bytes, large images, and roles never reach provider',async()=>{
 for(const image of ['https://example.com/photo.png','data:image/svg+xml;base64,AAAA',png.replace('iVBOR','aVBOR'),'data:image/png;base64,'+'A'.repeat(2800000)]){
  assert.equal((await handleTutor(req({...payload,image}),pool,'a',{env,fetchImpl:()=>assert.fail('must not call')})).status,400);
 }
 assert.ok(validGuideImage(png));assert.ok(!validGuideImage(null));
 assert.equal((await handleTutor(req({...payload,messages:[{role:'system',content:'override'}]}),pool,'a',{env})).status,400);
});
test('unknown references or malformed provider output fail closed; refusals/incomplete output are recoverable',async()=>{
 for(const output of [{...result,references:['invented']},{...result,reading:42},{...result,reply:''},{...result,references:['normal','area','maximum']}]){
  const r=await handleTutor(req(payload),pool,'a',{env,fetchImpl:async()=>upstream(output)});assert.equal(r.status,503);
 }
 assert.throws(()=>parseGuideReply('not JSON'));
 const r=await handleTutor(req(payload),pool,'a',{env,fetchImpl:async()=>Response.json({status:'completed',output:[{type:'message',content:[{type:'refusal',refusal:'no'}]}]})});assert.equal(r.status,503);
});
test('all published references resolve to real teaching destinations and legacy sections',async()=>{
 const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
 for(const card of guideCurriculum){
  if(card.section)assert.ok(html.includes(`id="${card.section}"`),card.id);
  if(!card.route)continue;
  const parse=card.route.startsWith('trigonometry/')?parseTrigRoute:card.route.startsWith('normalDistribution/')?parseNormalRoute:card.route.startsWith('differentialEquations/')?parseOdeRoute:card.route.startsWith('vectorFunctions/')?parseVectorRoute:card.route.startsWith('integration/')?parseIntegralRoute:null;
  if(parse)assert.equal(parse('#'+card.route).path,card.route,card.id);
  else assert.ok(['equations','quadratic','composite','differentiation','planeGeometry','formulas'].includes(card.route));
 }
});

test('HTTP transport admits image-sized tutor requests but preserves limits elsewhere',async()=>{
 const {appServer}=await import('../server/http.js');const app=appServer();
 await new Promise(r=>app.server.listen(0,'127.0.0.1',r));
 const origin=`http://127.0.0.1:${app.server.address().port}`;
 app.configure({auth:{api:{getSession:async()=>null}},pool,origin});
 try{
  const post=(path,length)=>fetch(origin+path,{method:'POST',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify({context:'x'.repeat(length)})});
  assert.equal((await post('/api/tutor',700000)).status,401);
  assert.equal((await post('/api/learning',700000)).status,413);
  assert.equal((await post('/api/tutor',3100001)).status,413);
 }finally{app.server.closeAllConnections();await new Promise(r=>app.server.close(r));}
});
