import { guideReference } from './guide-curriculum.js';
const root=document.querySelector('#guideView');
root.innerHTML=`<header class="guide-heading"><p class="eyebrow">Et sted at begynde</p><h1>Hjælp mig med at forstå en opgave</h1><p>Vis opgaven, eller beskriv den med dine egne ord. Vi finder tegnene, der peger dig i den rigtige retning.</p></header>
<div class="guide-layout"><section class="guide-source" aria-labelledby="guide-source-title"><h2 id="guide-source-title">Din opgave</h2>
<label for="guide-task">Indsæt opgaven, eller fortæl hvad den handler om</label><textarea id="guide-task" rows="6" maxlength="12000" placeholder="Jeg har en opgave om … men jeg ved ikke, hvor jeg skal starte."></textarea>
<label class="guide-upload" for="guide-file">Vælg et foto eller skærmbillede<input id="guide-file" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif"></label><p class="guide-hint">Du kan også indsætte et billede med Ctrl+V / ⌘V. Ét billede ad gangen, højst 15 MB. Beskær gerne til den relevante opgave.</p>
<figure id="guide-preview" hidden><img alt="Dit billede af opgaven"><figcaption>Tjek, at tekst og symboler er tydelige.</figcaption><button type="button" class="text-button" id="guide-remove">Fjern billede</button></figure>
<p id="guide-image-status" role="status"></p><button type="button" class="primary-button" id="guide-start">Hjælp mig i gang →</button>
<details id="guide-reading" hidden><summary>Sådan læste hjælperen billedet</summary><p></p><span>Er noget forkert? Ret opgaveteksten ovenfor, eller skriv rettelsen i samtalen.</span></details>
<p class="guide-hint">Opgave og samtale bliver i denne fane, mens du besøger teorien. De forsvinder, når du genindlæser eller vælger Ny opgave. Når du sender, behandles indholdet af vores AI-udbyder, OpenAI.</p><button type="button" class="secondary-button" id="guide-new">Ny opgave / ryd samtalen</button></section>
<section class="guide-conversation" aria-labelledby="guide-conversation-title"><h2 id="guide-conversation-title">Find en retning</h2><div id="guide-empty"><span aria-hidden="true">↗</span><h3>Du behøver ikke kende emnet</h3><p>Vi begynder med, hvad opgaven spørger om, og hvilke ord eller oplysninger du skal lægge mærke til.</p></div>
<div id="guide-messages" role="log" aria-label="Samtale om din opgave" aria-live="polite"></div><p id="guide-status" role="status"></p><button type="button" class="secondary-button" id="guide-retry" hidden>Prøv igen</button>
<div id="guide-followup" hidden><div class="guide-shortcuts"><button type="button" data-guide-prompt="Forklar det med enklere ord.">Forklar enklere</button><button type="button" data-guide-prompt="Vis de konkrete tegn i opgaven, som peger på emnet.">Vis mig tegnene</button><button type="button" data-guide-prompt="Hvordan kommer jeg videre? Hjælp mig med at vælge metode og tage første skridt.">Hvordan kommer jeg videre?</button><button type="button" data-guide-prompt="Jeg vil gerne have en guidet gennemgang af opgaven, ét trin ad gangen.">Guid mig gennem opgaven</button></div>
<form id="guide-form"><label for="guide-message">Spørg videre, eller ret noget i opgaven</label><textarea id="guide-message" rows="3" maxlength="2000" placeholder="Jeg forstår ikke helt …" required></textarea><button type="submit" class="primary-button">Send</button></form></div></section></div>`;
const $=selector=>root.querySelector(selector);
let messages=[],image=null,busy=false,converting=false,version=0,controller=null,pending=null;
function controls() {
 root.querySelectorAll('button, input').forEach(el=>el.disabled=busy||converting);
 $('#guide-new').disabled=false;
 $('#guide-task').disabled=busy||converting;
 $('#guide-message').disabled=busy;
}
function clearConversation() {
 controller?.abort(); version++; messages=[]; pending=null;busy=false;
 $('#guide-messages').replaceChildren(); $('#guide-empty').hidden=false; $('#guide-followup').hidden=true;
 $('#guide-reading').hidden=true; $('#guide-reading p').textContent=''; $('#guide-status').textContent=''; $('#guide-retry').hidden=true;
 $('#guide-message').value=''; controls();
}
function reset() {
 clearConversation(); converting=false;image=null;$('#guide-task').value='';$('#guide-file').value='';$('#guide-preview').hidden=true;
 $('#guide-preview img').removeAttribute('src');$('#guide-image-status').textContent='';controls();$('#guide-task').focus();
}
$('#guide-new').onclick=reset;
$('#guide-remove').onclick=()=>{clearConversation(); image=null;$('#guide-file').value='';$('#guide-preview').hidden=true;$('#guide-preview img').removeAttribute('src');};
async function attach(file) {
 if(busy||converting||!file)return;
 if(file.size>15*1024*1024){$('#guide-image-status').textContent='Billedet er større end 15 MB. Vælg et mindre udsnit.';return;}
 if(!/^image\/(jpeg|png|webp|heic|heif)$/.test(file.type)){$('#guide-image-status').textContent='Vælg et foto som JPEG, PNG eller WebP. En PDF skal først tages som skærmbillede.';return;}
 clearConversation(); image=null;$('#guide-preview').hidden=true;$('#guide-preview img').removeAttribute('src'); const current=version; converting=true;controls();$('#guide-image-status').textContent='Gør billedet klar…';
 const url=URL.createObjectURL(file);
 try {
  const img=new Image();img.src=url;await img.decode();
  if(current!==version)return;
  if(img.naturalWidth*img.naturalHeight>60000000)throw Error('Billedet har for høj opløsning. Vælg et mindre udsnit.');
  const scale=Math.min(1,2200/Math.max(img.naturalWidth,img.naturalHeight));const canvas=document.createElement('canvas');
  canvas.width=Math.round(img.naturalWidth*scale);canvas.height=Math.round(img.naturalHeight*scale);
  const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
  let data=canvas.toDataURL('image/jpeg',.9);
  if(data.length>2800000)data=canvas.toDataURL('image/jpeg',.72);
  if(data.length>2800000)throw Error('Vælg et mindre udsnit, så symbolerne stadig er tydelige.');
  image=data;$('#guide-preview img').src=data;$('#guide-preview').hidden=false;
  $('#guide-image-status').textContent='Billedet er klar. Tryk Hjælp mig i gang.';
 } catch(error) {
  if(current===version)$('#guide-image-status').textContent=error.name==='EncodingError'?'Browseren kan ikke læse billedformatet. Tag et skærmbillede, eller vælg JPEG, PNG eller WebP.':error.message;
 } finally {URL.revokeObjectURL(url);if(current===version){converting=false;controls();}}
}
$('#guide-file').onchange=event=>attach(event.target.files[0]);
root.addEventListener('paste',event=>{const file=[...event.clipboardData.items].find(item=>item.type.startsWith('image/'))?.getAsFile();if(file){event.preventDefault();attach(file);}});
function message(role,text,references=[]) {
 const article=document.createElement('article');article.className=`guide-message ${role}`;
 const label=document.createElement('strong');label.textContent=role==='user'?'Dig':'Hjælper';const p=document.createElement('p');p.textContent=text;article.append(label,p);
 for(const ref of references){
  const c=guideReference(ref.id);if(!c)continue;
  const details=document.createElement('details');const summary=document.createElement('summary');summary.textContent=`Relevant teori: ${c.title}`;
  const explanation=document.createElement('p');explanation.textContent=c.theory;details.append(summary,explanation);
  if(c.route){const link=document.createElement('a');link.href=`#${c.route}`;link.textContent='Åbn forklaringen i appen →';link.onclick=event=>{event.preventDefault();window.showMathView(c.route);if(c.section)requestAnimationFrame(()=>document.getElementById(c.section)?.scrollIntoView({behavior:'smooth'}));};details.append(link);}
  else {const note=document.createElement('p');note.className='guide-hint';note.textContent='Emnet er i dit pensum, men har endnu ikke et selvstændigt modul i appen.';details.append(note);}
  article.append(details);
 }
 $('#guide-messages').append(article);$('#guide-empty').hidden=true;
 if(role==='assistant'&&!root.hidden)requestAnimationFrame(()=>article.scrollIntoView({behavior:'smooth',block:'nearest'}));
}
async function send(text,retry=false) {
 if(busy||converting)return;
 const context=$('#guide-task').value.trim() || (image?'Se opgaven i billedet.':'');
 if(!context){$('#guide-status').textContent='Vis et billede, eller beskriv først opgaven.';$('#guide-task').focus();return;}
 if(!retry){
  if(!text?.trim())return;
  if(messages.at(-1)?.role==='user'){messages.pop();$('#guide-messages').lastElementChild?.remove();}
  messages.push({role:'user',content:text.trim()});message('user',text.trim());$('#guide-message').value='';
  pending={mode:'guide',context,...(image?{image}:{}),messages:messages.slice(-24)};
 }
 if(!pending)return;
 busy=true;controls();$('#guide-retry').hidden=true;$('#guide-status').textContent='Finder tegnene i opgaven…';
 if(!root.hidden&&window.innerWidth<=850)$('#guide-status').scrollIntoView({behavior:'smooth',block:'center'});
 controller=new AbortController();const activeController=controller;const current=version;const timer=setTimeout(()=>activeController.abort(),55000);
 try {
  const response=await fetch('/api/tutor',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(pending),signal:activeController.signal});
  const data=await response.json().catch(()=>({}));
  if(current!==version)return;
  if(!response.ok||typeof data.reply!=='string')throw Error(data.message||'Hjælperen kunne ikke svare. Prøv igen om lidt.');
  messages.push({role:'assistant',content:data.reply});message('assistant',data.reply,Array.isArray(data.references)?data.references:[]);
  if(data.reading){$('#guide-reading').hidden=false;$('#guide-reading p').textContent=data.reading;}
  $('#guide-status').textContent='';pending=null;
 }catch(error){if(current===version){$('#guide-status').textContent=error.name==='AbortError'?'Svaret tog for lang tid. Din opgave er bevaret; prøv igen.':error.message;$('#guide-retry').hidden=false;}}
 finally{clearTimeout(timer);if(current===version){busy=false;controls();$('#guide-followup').hidden=false;}}
}
$('#guide-start').onclick=()=>{
 clearConversation();
 send('Hjælp mig med at forstå opgaven. Hvad skal jeg lægge mærke til, og hvilket emne peger det på?');
};
$('#guide-form').onsubmit=event=>{event.preventDefault();send($('#guide-message').value);};
$('#guide-retry').onclick=()=>send(null,true);
root.querySelectorAll('[data-guide-prompt]').forEach(button=>button.onclick=()=>send(button.dataset.guidePrompt));
// State is deliberately memory-only: images and conversations are never written to account storage.
