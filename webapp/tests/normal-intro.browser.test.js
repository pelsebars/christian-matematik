import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {extname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {normalIntroSteps,normalImplemented,pagesForNormalModule,parseNormalRoute} from '../normal-routes.js';
import {normalIntroForModule} from '../normal-intro-content.js';
import {normalModules} from '../normal-plan.js';
import {introBellFigure,introAreaFigure,introIntervalFigure} from '../normal-intro-figures.js';

const pages=pagesForNormalModule('intro');
assert.equal(pages.length,15);
assert.deepEqual(normalImplemented,['1','2','3','repetition','4','5','opsamling']);
assert.equal(parseNormalRoute('#normalDistribution/intro').path,pages[0]);
assert.equal(parseNormalRoute('#normalDistribution/intro/unknown').path,pages[0]);
for(const path of [...pages,...normalModules.flatMap(m=>pagesForNormalModule(m.id))])assert.equal(parseNormalRoute('#'+path).path,path);
// Check the visual explanation itself: changing centre moves the peak; more
// spread lowers it. All area modes retain exactly the same density curve.
const lastCurve=svg=>[...svg.matchAll(/<path d="(M[^"]+)"[^>]*stroke="#176489"/g)].at(-1)[1];
const peak=curve=>[...curve.matchAll(/[ML]([\d.]+) ([\d.]+)/g)].map(m=>[+m[1],+m[2]]).reduce((best,p)=>p[1]<best[1]?p:best);
const center=peak(lastCurve(introBellFigure('center'))),shift=peak(lastCurve(introBellFigure('shift'))),wide=peak(lastCurve(introBellFigure('wide')));
assert.ok(shift[0]>center[0]);assert.equal(shift[1],center[1]);assert.equal(wide[0],center[0]);assert.ok(wide[1]>center[1]);
for(const mode of ['left','right','between'])assert.equal(lastCurve(introAreaFigure(mode)),lastCurve(introBellFigure('center')));
for(const render of [introBellFigure,introAreaFigure,introIntervalFigure]){assert.throws(()=>render('bad'));assert.doesNotMatch(render(),/NaN|Infinity/);}

const dir=resolve(fileURLToPath(new URL('../dist/',import.meta.url)));
const server=createServer(async(req,res)=>{try{const request=decodeURIComponent(new URL(req.url,'http://localhost').pathname),path=resolve(dir,'.'+(request==='/'?'/index.html':request));if(!path.startsWith(dir+'/'))throw Error();res.setHeader('Content-Type',{'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'}[extname(path)]||'text/plain');res.end(await readFile(path));}catch{res.statusCode=404;res.end('Not found');}});
await new Promise(done=>server.listen(0,'127.0.0.1',done));
const url=`http://127.0.0.1:${server.address().port}`,browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'}),errors=[];
try{
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'}),page=await context.newPage();page.setDefaultTimeout(15000);
  page.on('pageerror',e=>errors.push(e.message));
  const go=async path=>{await page.evaluate(path=>window.showMathView(path),path);await page.waitForURL('**/*#'+path);};
  // The shared app remembers the current route; reading must not change any
  // answer, completion, note or reward storage alongside that resume marker.
  const storage=()=>page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([key])=>key!=='christian-matematik.resume.v1')));
  const fits=async label=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${name}: ${label}`);
  await page.goto(url+'/?preview=1#normalDistribution');
  await page.locator('.normal-intro-entry').waitFor({state:'visible'});
  const before=await storage();
  await page.locator('.normal-intro-entry a').click();await page.locator('#normal-introduction [data-normal-step=start]').waitFor({state:'visible'});
  const intro=page.locator('#normal-introduction');
  assert.equal(await intro.locator('form,input,select,[data-int-card]').count(),0);
  assert.equal(await intro.locator('.normal-intro-formula[open]').count(),0);
  assert.equal(await page.locator('.normal-step-menu').isVisible(),false);
  for(let index=0;index<pages.length;index++){
   await go(pages[index]);const panel=intro.locator(`[data-normal-step="${normalIntroSteps[index][0]}"]`);await panel.waitFor({state:'visible'});
   assert.equal(await page.locator('[data-normal-step]:visible').count(),1);
   assert.match(await page.locator('[data-normal-location]').innerText(),new RegExp(`Afsnit ${index+1} af ${pages.length}`));
   assert.equal(await intro.locator('[data-intro-link][aria-current=step]').getAttribute('href'),'#'+pages[index]);
   await fits(pages[index]);
   for(const detail of await panel.locator('.normal-intro-formula').all()){await detail.locator('summary').click();await fits(pages[index]+' formula');}
   await page.locator('.normal-page-controls a').last().click();
   await page.waitForURL('**/*#'+(pages[index+1]||'normalDistribution/1/start'));
  }
  await page.locator('#normal-module-one [data-normal-step=start]').waitFor({state:'visible'});
  await page.locator('.normal-page-controls a').first().click();await intro.locator('[data-normal-step=overblik]').waitFor({state:'visible'});
  await page.reload();await intro.locator('[data-normal-step=overblik]').waitFor({state:'visible'});
  await go('normalDistribution/intro/formelkort');const reference=intro.locator('.normal-scale-overview');await reference.waitFor({state:'visible'});
  assert.equal(await reference.locator('.normal-scale-curve').count(),3);
  for(const [label,summary] of [['Under centrum',/960 mL.*−2/],['Ved centrum',/1000 mL.*0/],['Over centrum',/1040 mL.*2/]]){
   await reference.getByRole('button',{name:label,exact:true}).press('Enter');assert.match(await reference.locator('[data-scale-summary]').textContent(),summary);assert.equal(await reference.locator('[aria-pressed=true]').count(),1);await fits('scale overview '+label);
  }
  const downloadPromise=page.waitForEvent('download');await reference.locator('[data-scale-download]').click();const download=await downloadPromise;
  assert.equal(download.suggestedFilename(),'normalfordeling-fra-x-til-z-og-tilbage.svg');const svg=await readFile(await download.path(),'utf8');assert.match(svg,/z = \(x − μ\) \/ σ/);assert.match(svg,/x = 1040 mL/);assert.match(svg,/Φ⁻¹\(p\)/);
  assert.equal(await page.evaluate(svg=>new DOMParser().parseFromString(svg,'image/svg+xml').querySelector('parsererror')?.textContent||'',svg),'','download must be valid standalone SVG/XML');
  await reference.screenshot({path:`/tmp/matematik-normal-formelkort-${name}.png`});
  await intro.locator('.normal-intro-outline summary').click();await intro.getByRole('link',{name:'2 Målinger og klokken',exact:true}).click();
  await intro.locator('[data-normal-step=maalinger]').waitFor({state:'visible'});assert.equal(await intro.locator('.normal-intro-outline').getAttribute('open'),null);
  const bell=intro.locator('[data-intro-visual=bell]'),oldBell=await bell.locator('[data-intro-canvas]').innerHTML();
  await bell.getByRole('button',{name:'Flyt centrum',exact:true}).press('Enter');assert.notEqual(await bell.locator('[data-intro-canvas]').innerHTML(),oldBell);assert.match(await bell.locator('[data-intro-explanation]').textContent(),/samme bredde/);
  await bell.getByRole('button',{name:'Større spredning',exact:true}).click();assert.match(await bell.locator('[data-intro-explanation]').textContent(),/bredere og lavere/);assert.equal(await bell.locator('[aria-pressed=true]').count(),1);
  await go('normalDistribution/intro/areal');const area=intro.locator('[data-intro-visual=area]'),oldArea=await area.locator('[data-intro-canvas]').innerHTML();
  await area.getByRole('button',{name:'Over en grænse',exact:true}).click();assert.notEqual(await area.locator('[data-intro-canvas]').innerHTML(),oldArea);assert.match(await area.locator('[data-intro-explanation]').textContent(),/til højre/);
  await area.getByRole('button',{name:'Mellem to grænser',exact:true}).click();assert.match(await area.locator('[data-intro-explanation]').textContent(),/imellem/);
  await page.screenshot({path:`/tmp/matematik-normal-intro-area-${name}.png`,fullPage:true});
  await go('normalDistribution/intro/interval');const interval=intro.locator('[data-intro-visual=interval]');
  for(const [label,meaning] of [['Helt over nul',/voksende/],['Helt under nul',/aftagende/],['Nul er med',/beviser hverken/]]){await interval.getByRole('button',{name:label,exact:true}).click();assert.match(await interval.locator('[data-intro-explanation]').textContent(),meaning);assert.equal(await interval.locator('[aria-pressed=true]').count(),1);}
  await page.screenshot({path:`/tmp/matematik-normal-intro-interval-${name}.png`,fullPage:true});
  for(const [module,step] of Object.entries(normalIntroForModule)){
   await go(`normalDistribution/${module}/start`);await page.locator('[data-normal-intro-return]').waitFor({state:'visible'});
   const returnLink=page.locator('[data-normal-intro-return] a');assert.equal(await returnLink.getAttribute('href'),`#normalDistribution/intro/${step}`);await returnLink.click();await intro.locator(`[data-normal-step=${step}]`).waitFor({state:'visible'});
  }
  for(const link of await intro.locator('.normal-intro-onward a').all()){const href=await link.getAttribute('href');assert.equal(parseNormalRoute(href).path,href.slice(1));}
  const mathProblems=await intro.locator('math').evaluateAll(nodes=>nodes.flatMap(m=>[...(m.namespaceURI!=='http://www.w3.org/1998/Math/MathML'?['namespace']:[]),...[...m.querySelectorAll('mfrac,msup,msub,mover')].filter(el=>el.children.length!==2).map(el=>el.outerHTML)]));assert.deepEqual(mathProblems,[]);
  assert.deepEqual(await storage(),before,'reading and illustrations must not write answers or award points');
  await go('normalDistribution');await page.locator('#normal-overview').waitFor({state:'visible'});assert.match(await page.locator('[data-normal-overall]').innerText(),/0 af 6/);assert.equal(await page.locator('[data-normal-status]').count(),7);for(const text of await page.locator('[data-normal-status]').allTextContents())assert.equal(text,'Ikke begyndt');
  assert.equal(await page.locator('#normal-overview .module-card').count(),7);
  if(name==='mobile')await page.locator('#menuButton').click();const submenu=page.locator('#nav-modules-normalDistribution');if(!await submenu.isVisible())await page.locator('[aria-controls=nav-modules-normalDistribution]').click();
  await submenu.getByRole('link',{name:'Start Forstå idéerne · helt fra bunden',exact:true}).click();await intro.locator('[data-normal-step=start]').waitFor({state:'visible'});
  await page.screenshot({path:`/tmp/matematik-normal-intro-start-${name}.png`,fullPage:true});await context.close();
  console.log(`${name}: ${pages.length} sections, formulas, illustrations, direct links, reload, keyboard, mobile layout and unchanged learning data passed`);
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close();await new Promise(done=>server.close(done));}
