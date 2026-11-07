import {trigModules,trigSteps,parseTrigRoute} from './trig-plan.js';
import {trigContent} from './trig-content.js';
import {trigTasks} from './tasks/bank/trigonometry.js';
import {bindLessonExercises} from './integral-exercises.js';
import {bindNormalNotes} from './normal-lesson-support.js';
import {bindTrigGraph} from './trig-graphs.js';
import {setTrigProgress,trigProgressRows} from './trig-progress.js';
const root=document.querySelector('#trigLesson');
const link=(path,label)=>`<a class="text-button" href="#${path}">${label}</a>`;
root.innerHTML=`<section class="lesson-section" id="trig-overview"><h2>Fra enhedscirkel til periodiske modeller</h2><p>To moduler følger pensumarkene om trigonometriske funktioner. Træn radianer, svingninger og ligninger, og forbind dem med differential- og integralregning. Begge moduler er åbne.</p><div class="module-roadmap">${trigModules.map(m=>`<article class="module-card"><p>Modul ${m.id} · <strong data-trig-status="${m.id}">Ikke begyndt</strong></p><h3>${m.title}</h3><p>${m.summary}</p>${link(`trigonometry/${m.id}/start`,'Begynd eller fortsæt →')}</article>`).join('')}</div><p>Forudsætninger: indsættelse, simple ligninger og koordinater. Modellerne bruger også produktreglen, kædereglen og bestemte integraler.</p></section><div id="trig-session" hidden><nav aria-label="Tilbage til trigonometri">${link('trigonometry','← Forløbsoversigt')}</nav><p data-trig-location role="status"></p><nav class="vector-step-menu" aria-label="Trin i trigonometri"></nav>${trigModules.map(m=>`<div id="trig-module-${m.id}" hidden></div>`).join('')}<nav class="vector-page-controls" aria-label="Forrige og næste trin"></nav></div>`;
function status(){
 for(const row of trigProgressRows()){
  root.querySelector(`[data-trig-status="${row.id}"]`).textContent=row.status;
  const summary=root.querySelector(`#trig-module-${row.id} [data-trig-summary]`);
  if(summary)summary.textContent=`${row.count} af ${row.total} opgaver korrekt kontrolleret · ${row.status}.`;
 }
 const route=parseTrigRoute(location.hash),row=trigProgressRows().find(r=>r.id===route?.module);
 if(row)root.querySelector('[data-trig-location]').textContent=`Modul ${row.id} · ${row.status} · ${row.count} af ${row.total} opgaver korrekt kontrolleret`;
}
for(const m of trigModules){
 const host=root.querySelector('#trig-module-'+m.id),tasks=trigTasks.filter(t=>t.module===`trig.${m.id}`);
 host.innerHTML=trigContent(m.id);
 bindLessonExercises(host,tasks,`christian-matematik.trigonometry.${m.id}.v1`,complete=>{
  const count=tasks.filter(complete).length,attempted=[...host.querySelectorAll('form input,form select')].some(e=>e.value!=='');
  setTrigProgress(m.id,count===tasks.length?'Gennemført':attempted?'I gang':'Ikke begyndt',count,tasks.length);status();
 });
 bindNormalNotes(host,`trig-notes-${m.id}`,`christian-matematik.trigonometry.notes${m.id}.v1`);
 bindTrigGraph(host.querySelector('[data-trig-lab]'),m.id);
}
function navigate(focus=false){
 const route=parseTrigRoute(location.hash);if(!route)return;
 if(location.hash!==`#${route.path}`)history.replaceState(null,'','#'+route.path);
 root.querySelector('#trig-overview').hidden=!!route.module;root.querySelector('#trig-session').hidden=!route.module;
 for(const m of trigModules){const host=root.querySelector('#trig-module-'+m.id);host.hidden=m.id!==route.module;host.querySelectorAll('[data-trig-step]').forEach(e=>e.hidden=e.dataset.trigStep!==route.step);}
 const subject=document.querySelector('[data-page=subject]');subject.classList.toggle('is-integral-session',!!route.module);subject.classList.toggle('is-integral-overview',!route.module);
 const m=trigModules.find(m=>m.id===route.module),title=m?`Modul ${m.id}: ${m.title}`:'Trigonometriske funktioner';
 document.querySelector('#subjectTitle').textContent=title;document.title=title+' · Christians matematik';
 document.querySelector('#subjectFormula').hidden=!!m;
 if(m){
  root.querySelector('.vector-step-menu').innerHTML=trigSteps.map(([step,label])=>`<a href="#trigonometry/${m.id}/${step}"${step===route.step?' aria-current="step"':''}>${label}</a>`).join('');
  const all=trigModules.flatMap(m=>trigSteps.map(([step])=>`trigonometry/${m.id}/${step}`)),i=all.indexOf(route.path);
  root.querySelector('.vector-page-controls').innerHTML=link(all[i-1]||'trigonometry','← Forrige')+link(all[i+1]||'trigonometry',i===all.length-1?'Forløbsoversigt →':'Næste →');
 }
 status();if(focus){window.scrollTo({top:0,behavior:'instant'});const h=document.querySelector('#subjectTitle');h.tabIndex=-1;h.focus({preventScroll:true});}
}
window.addEventListener('mathviewchange',e=>{if(e.detail.view==='trigonometry')navigate(e.detail.focus);});
window.openTrigSection=id=>window.showMathView(`trigonometry/${id.replace('trig-module-','')}/teori`);
if(parseTrigRoute(location.hash))navigate();
