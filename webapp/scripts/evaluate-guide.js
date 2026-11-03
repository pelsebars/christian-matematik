// Usage: OPENAI_API_KEY=... OPENAI_TUTOR_MODEL=... node scripts/evaluate-guide.js [--holdout] [--images] [--repeats=3]
// No real database access. Outputs stay in ignored .test-data; never prints keys or raw API errors.
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {handleTutor} from '../server/tutor.js';
import {guideCases} from '../evaluation/guide-cases.js';
const env=process.env;
if(!env.OPENAI_API_KEY||!env.OPENAI_TUTOR_MODEL||env.OPENAI_API_KEY==='[SENSITIVE]'){
 console.error('Rigtig modelevaluering kræver en tilgængelig OPENAI_API_KEY og OPENAI_TUTOR_MODEL. Ingen modelkald foretaget.');process.exit(1);
}
const out=new URL('../.test-data/guide-evaluation/',import.meta.url);await mkdir(out,{recursive:true});
const cases=guideCases.filter(c=>!process.argv.includes('--holdout')||c.split==='holdout');
const repeats=Math.min(3,Math.max(1,Number(process.argv.find(a=>a.startsWith('--repeats='))?.split('=')[1]||1)));
let browser,page;
if(process.argv.includes('--images')){const {chromium}=await import('playwright');browser=await chromium.launch({headless:true});page=await browser.newPage({viewport:{width:1200,height:650}});}
const results=[];
try{
 for(let repeat=0;repeat<repeats;repeat++)for(const item of cases){
  let image;
  if(page){await page.setContent('<main style="font:28px/1.8 sans-serif;padding:60px;max-width:1000px"></main>');await page.locator('main').evaluate((el,t)=>el.textContent=t,item.context);image='data:image/png;base64,'+(await page.screenshot()).toString('base64');}
  const start=Date.now();
  const response=await handleTutor(new Request('http://localhost/api/tutor',{method:'POST',body:JSON.stringify({mode:'guide',context:image?'Se opgaven på billedet.':item.context,...(image?{image}:{}),messages:[{role:'user',content:'Jeg ved ikke, hvor jeg skal starte. Hjælp mig med at forstå opgaven.'}]})}),{query:async()=>({rowCount:1})},'local-evaluation',{env});
  const result=await response.json();const selected=(result.references||[]).map(c=>c.id);
  results.push({id:item.id,repeat,input:image?'rendered-image':'text',expected:item.expected,status:response.status,ms:Date.now()-start,referenceMatch:item.expected.length?item.expected.some(id=>selected.includes(id)):null,result,rubric:null});
  console.log(`${item.id}: HTTP ${response.status}, ${results.at(-1).ms} ms`);
  await writeFile(new URL('results.json',out),JSON.stringify(results,null,2));
 }
}finally{await browser?.close();}
console.log('Svar gemt i .test-data/guide-evaluation/results.json. Faglig rubric skal gennemgås; referenceMatch alene dokumenterer ikke kvalitet.');
