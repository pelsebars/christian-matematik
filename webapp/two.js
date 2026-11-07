import {twoModules,twoSteps,parseTwoRoute} from './two-plan.js';
import {twoContent} from './two-content.js';
import {twoTasks} from './tasks/bank/twoVariables.js';
import {bindLessonExercises} from './integral-exercises.js';
import {bindNormalNotes} from './normal-lesson-support.js';
import {bindTwoLab} from './two-lab.js';
import {setTwoProgress,twoProgressRows} from './two-progress.js';
const root=document.querySelector('#twoLesson');
const link=(path,label)=>`<a class="text-button" href="#${path}">${label}</a>`;
root.innerHTML=`<section class="lesson-section" id="two-overview"><h2>Fra flader til optimering</h2><p>Fire moduler følger pensumarkene om funktioner af to variable. Alle fire moduler er åbne. Træn funktionsværdier, kurver, gradienter, stationære punkter og optimering.</p><div class="module-roadmap">${twoModules.map(m=>`<article class="module-card"><p>Modul ${m.id} · <strong data-two-status="${m.id}">Ikke begyndt</strong></p><h3>${m.title}</h3><p>${m.summary}</p>${link(`twoVariables/${m.id}/start`,'Begynd eller fortsæt →')}</article>`).join('')}</div><p>Forudsætninger: indsættelse, simple ligninger og koordinater. Senere moduler bruger differentiation og ligningssystemer.</p></section><div id="two-session" hidden><nav aria-label="Tilbage til funktioner af to variable">${link('twoVariables','← Forløbsoversigt')}</nav><p data-two-location role="status"></p><nav class="vector-step-menu" aria-label="Trin i funktioner af to variable"></nav>${twoModules.map(m=>`<div id="two-module-${m.id}" hidden></div>`).join('')}<nav class="vector-page-controls" aria-label="Forrige og næste trin"></nav></div>`;
function status(){
 for(const row of twoProgressRows()){
  root.querySelector(`[data-two-status="${row.id}"]`).textContent=row.status;
  const summary=root.querySelector(`#two-module-${row.id} [data-two-summary]`);
  if(summary)summary.textContent=`${row.count} af ${row.total} opgaver korrekt kontrolleret · ${row.status}.`;
 }
 const route=parseTwoRoute(location.hash),row=twoProgressRows().find(r=>r.id===route?.module);
 if(row)root.querySelector('[data-two-location]').textContent=`Modul ${row.id} · ${row.status} · ${row.count} af ${row.total} opgaver korrekt kontrolleret`;
}
for(const m of twoModules){
 const host=root.querySelector('#two-module-'+m.id),tasks=twoTasks.filter(t=>t.module===`two.${m.id}`);
 host.innerHTML=twoContent(m.id);
 bindLessonExercises(host,tasks,`christian-matematik.twoVariables.${m.id}.v1`,complete=>{
  const count=tasks.filter(complete).length,attempted=[...host.querySelectorAll('form input,form select')].some(e=>e.value!=='');
  setTwoProgress(m.id,count===tasks.length?'Gennemført':attempted?'I gang':'Ikke begyndt',count,tasks.length);status();
 });
 bindNormalNotes(host,`two-notes-${m.id}`,`christian-matematik.twoVariables.notes${m.id}.v1`);
 bindTwoLab(host.querySelector('[data-two-lab]'),m.id);
}
function navigate(focus=false){
 const route=parseTwoRoute(location.hash);if(!route)return;
 if(location.hash!==`#${route.path}`)history.replaceState(null,'','#'+route.path);
 root.querySelector('#two-overview').hidden=!!route.module;root.querySelector('#two-session').hidden=!route.module;
 for(const m of twoModules){const host=root.querySelector('#two-module-'+m.id);host.hidden=m.id!==route.module;host.querySelectorAll('[data-two-step]').forEach(e=>e.hidden=e.dataset.twoStep!==route.step);}
 const subject=document.querySelector('[data-page=subject]');subject.classList.toggle('is-integral-session',!!route.module);subject.classList.toggle('is-integral-overview',!route.module);
 const m=twoModules.find(m=>m.id===route.module),title=m?`Modul ${m.id}: ${m.title}`:'Funktioner af to variable';
 document.querySelector('#subjectTitle').textContent=title;document.title=title+' · Christians matematik';
 document.querySelector('#subjectFormula').hidden=!!m;
 if(m){
  root.querySelector('.vector-step-menu').innerHTML=twoSteps.map(([step,label])=>`<a href="#twoVariables/${m.id}/${step}"${step===route.step?' aria-current="step"':''}>${label}</a>`).join('');
  const all=twoModules.flatMap(m=>twoSteps.map(([step])=>`twoVariables/${m.id}/${step}`)),i=all.indexOf(route.path);
  root.querySelector('.vector-page-controls').innerHTML=link(all[i-1]||'twoVariables','← Forrige')+link(all[i+1]||'twoVariables',i===all.length-1?'Forløbsoversigt →':'Næste →');
 }
 status();if(focus){window.scrollTo({top:0,behavior:'instant'});const h=document.querySelector('#subjectTitle');h.tabIndex=-1;h.focus({preventScroll:true});}
}
window.addEventListener('mathviewchange',e=>{if(e.detail.view==='twoVariables')navigate(e.detail.focus);});
window.openTwoSection=id=>window.showMathView(`twoVariables/${id.replace('two-module-','')}/teori`);
if(parseTwoRoute(location.hash))navigate();
