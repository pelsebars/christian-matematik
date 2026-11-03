import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {appServer} from '../server/http.js';
const {server}=appServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const requests=[];let fail=false,delay=0;
 await page.route('**/api/tutor',async route=>{requests.push(route.request().postDataJSON());if(delay)await new Promise(r=>setTimeout(r,delay));await route.fulfill({status:fail?503:200,json:fail?{message:'Prøv igen om lidt.'}:{reply:'Læg mærke til højest: du leder efter et maksimum. <img src=x onerror=alert(1)>',reading:requests.at(-1).image?'Hvornår er kuglen højest oppe?':'',references:[{id:'maximum'},{id:'invented',route:'javascript:alert(1)'}]}}).catch(()=>{});});
 await page.goto(`http://127.0.0.1:${server.address().port}/?preview=1#guide`);
 await page.locator('#guide-task').waitFor();
 const send=async text=>{await page.locator('#guide-task').fill(text);await page.locator('#guide-start').click();await page.locator('.guide-message.assistant').waitFor();};
 // Eight text and free-description flows, replacing the task each time.
 for(const task of ['Hvornår er kuglen højest?','Find arealet mellem to grafer.','X er normalfordelt. Find P(X<10).','Find en stamfunktion til x².','Noget med en kugle der flyver op.','Jeg har højder og skal finde en andel.','To vektorer og en vinkel, hvad gør jeg?','Min opgave viser en kurve, der gentager sig.']){
  await page.locator('#guide-new').click();await send(task);assert.equal(requests.at(-1).context,task);assert.equal(requests.at(-1).messages.length,1);
 }
 assert.equal(await page.locator('.guide-message img').count(),0);assert.equal(await page.locator('.guide-message details').count(),1);
 await page.locator('.guide-message summary').click();await page.locator('.guide-message a').click();await page.waitForURL(url=>url.hash==='#formulas');
 await page.evaluate(()=>window.showMathView('guide'));assert.equal(await page.locator('.guide-message.assistant').count(),1);
 await page.getByRole('button',{name:'Hvordan kommer jeg videre?',exact:true}).click();await page.waitForFunction(()=>document.querySelectorAll('.guide-message.assistant').length===2);assert.equal(requests.at(-1).messages.length,3);
 fail=true;await page.locator('#guide-message').fill('Der står faktisk lavest.');await page.locator('#guide-form button').click();await page.locator('#guide-retry').waitFor({state:'visible'});
 const failed=requests.at(-1);fail=false;await page.locator('#guide-retry').click();await page.waitForFunction(()=>document.querySelectorAll('.guide-message.assistant').length===3);assert.deepEqual(requests.at(-1),failed);
 // Four real image input flows (provider is mocked): upload, paste, replace, correction.
 const fixture=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=900;c.height=400;const x=c.getContext('2d');x.fillStyle='white';x.fillRect(0,0,900,400);x.fillStyle='black';x.font='30px sans-serif';x.fillText('h(t) = -5t² + 20t + 1',40,80);x.fillText('Hvornår er kuglen højest oppe?',40,140);return c.toDataURL('image/png').split(',')[1];});
 for(let i=0;i<4;i++){
  await page.locator('#guide-new').click();
  if(i===1){await page.locator('#guide-task').evaluate((el,b64)=>{const bytes=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));const dt=new DataTransfer();dt.items.add(new File([bytes],'task.png',{type:'image/png'}));el.dispatchEvent(new ClipboardEvent('paste',{clipboardData:dt,bubbles:true,cancelable:true}));},fixture);}
  else await page.locator('#guide-file').setInputFiles({name:'task.png',mimeType:'image/png',buffer:Buffer.from(fixture,'base64')});
  await page.waitForFunction(()=>document.querySelector('#guide-image-status').textContent.includes('klar.'));
  await page.locator('#guide-start').click();await page.locator('.guide-message.assistant').waitFor();assert.match(requests.at(-1).image,/^data:image\/jpeg;base64,/);assert.equal(await page.locator('#guide-reading').isVisible(),true);
  if(i===2){await page.locator('#guide-remove').click();assert.equal(await page.locator('.guide-message').count(),0);assert.equal(await page.locator('#guide-preview').isVisible(),false);}
  if(i===3){await page.locator('#guide-message').fill('Der står 30t, ikke 20t.');await page.locator('#guide-form button').click();await page.waitForFunction(()=>document.querySelectorAll('.guide-message.assistant').length===2);assert.match(requests.at(-1).messages.at(-1).content,/30t/);}
 }
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(350);await page.screenshot({path:'/tmp/matematik-guide-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(350);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:'/tmp/matematik-guide-mobile.png',fullPage:true});
 // Clearing during a request must not resurrect the old conversation.
 delay=1000;await page.locator('#guide-message').fill('Et hint mere');await page.locator('#guide-form button').click();await page.locator('#guide-new').click();await page.waitForTimeout(1200);assert.equal(await page.locator('.guide-message').count(),0);
 await page.reload();await page.locator('#guide-task').waitFor();assert.equal(await page.locator('#guide-task').inputValue(),'');assert.equal(await page.locator('#guide-preview').isVisible(),false);
 assert.deepEqual(errors,[]);console.log('Guide browser passed: 12 input flows, follow-up, theory/return, retry, correction, XSS, reset race, mobile and no persistence. Model replies mocked.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
