import {polarModules,polarSteps,parsePolarRoute} from './polar-plan.js';
import {polarContent} from './polar-content.js';
import {polarTasks} from './tasks/bank/polar.js';
import {bindLessonExercises} from './integral-exercises.js';
import {bindNormalNotes} from './normal-lesson-support.js';
import {bindPolarGraph} from './polar-graphs.js';
import {setPolarProgress,polarProgressRows} from './polar-progress.js';
const root=document.querySelector('#polarLesson');
const link=(path,label)=>`<a class="text-button" href="#${path}">${label}</a>`;
root.innerHTML=`<section class="lesson-section" id="polar-overview"><h2>Et punkt beskrevet med afstand og vinkel</h2><p>Et kort modul om polære koordinater: omregn mellem afstand og vinkel og de sædvanlige koordinater. Træn kvadranter, vinkelmål og en enkel model.</p><div class="module-roadmap">${polarModules.map(m=>`<article class="module-card"><p>Modul ${m.id} · <strong data-polar-status="${m.id}">Ikke begyndt</strong></p><h3>${m.title}</h3><p>${m.summary}</p>${link(`polarCoordinates/${m.id}/start`,'Begynd eller fortsæt →')}</article>`).join('')}</div><p>Forudsætninger: koordinatsystemet, Pythagoras, sinus og cosinus. Alle trin er åbne.</p></section><div id="polar-session" hidden><nav aria-label="Tilbage til polære koordinater">${link('polarCoordinates','← Forløbsoversigt')}</nav><p data-polar-location role="status"></p><nav class="vector-step-menu" aria-label="Trin i polære koordinater"></nav>${polarModules.map(m=>`<div id="polar-module-${m.id}" hidden></div>`).join('')}<nav class="vector-page-controls" aria-label="Forrige og næste trin"></nav></div>`;
function status(){
 for(const row of polarProgressRows()){
  root.querySelector(`[data-polar-status="${row.id}"]`).textContent=row.status;
  const summary=root.querySelector(`#polar-module-${row.id} [data-polar-summary]`);
  if(summary)summary.textContent=`${row.count} af ${row.total} opgaver korrekt kontrolleret · ${row.status}.`;
 }
 const route=parsePolarRoute(location.hash),row=polarProgressRows().find(r=>r.id===route?.module);
 if(row)root.querySelector('[data-polar-location]').textContent=`Modul ${row.id} · ${row.status} · ${row.count} af ${row.total} opgaver korrekt kontrolleret`;
}
for(const m of polarModules){
 const host=root.querySelector('#polar-module-'+m.id),tasks=polarTasks.filter(t=>t.module===`polar.${m.id}`);
 host.innerHTML=polarContent(m.id);
 bindLessonExercises(host,tasks,`christian-matematik.polarCoordinates.${m.id}.v1`,complete=>{
  const count=tasks.filter(complete).length,attempted=[...host.querySelectorAll('form input,form select')].some(e=>e.value!=='');
  setPolarProgress(m.id,count===tasks.length?'Gennemført':attempted?'I gang':'Ikke begyndt',count,tasks.length);status();
 });
 bindNormalNotes(host,`polar-notes-${m.id}`,`christian-matematik.polarCoordinates.notes${m.id}.v1`);
 bindPolarGraph(host.querySelector('[data-polar-lab]'),m.id);
}
function navigate(focus=false){
 const route=parsePolarRoute(location.hash);if(!route)return;
 if(location.hash!==`#${route.path}`)history.replaceState(null,'','#'+route.path);
 root.querySelector('#polar-overview').hidden=!!route.module;root.querySelector('#polar-session').hidden=!route.module;
 for(const m of polarModules){const host=root.querySelector('#polar-module-'+m.id);host.hidden=m.id!==route.module;host.querySelectorAll('[data-polar-step]').forEach(e=>e.hidden=e.dataset.polarStep!==route.step);}
 const subject=document.querySelector('[data-page=subject]');subject.classList.toggle('is-integral-session',!!route.module);subject.classList.toggle('is-integral-overview',!route.module);
 const m=polarModules.find(m=>m.id===route.module),title=m?`Modul ${m.id}: ${m.title}`:'Polære koordinater';
 document.querySelector('#subjectTitle').textContent=title;document.title=title+' · Christians matematik';
 document.querySelector('#subjectFormula').hidden=!!m;
 if(m){
  root.querySelector('.vector-step-menu').innerHTML=polarSteps.map(([step,label])=>`<a href="#polarCoordinates/${m.id}/${step}"${step===route.step?' aria-current="step"':''}>${label}</a>`).join('');
  const all=polarModules.flatMap(m=>polarSteps.map(([step])=>`polarCoordinates/${m.id}/${step}`)),i=all.indexOf(route.path);
  root.querySelector('.vector-page-controls').innerHTML=link(all[i-1]||'polarCoordinates','← Forrige')+link(all[i+1]||'polarCoordinates',i===all.length-1?'Forløbsoversigt →':'Næste →');
 }
 status();if(focus){window.scrollTo({top:0,behavior:'instant'});const h=document.querySelector('#subjectTitle');h.tabIndex=-1;h.focus({preventScroll:true});}
}
window.addEventListener('mathviewchange',e=>{if(e.detail.view==='polarCoordinates')navigate(e.detail.focus);});
window.openPolarSection=id=>window.showMathView(`polarCoordinates/${id.replace('polar-module-','')}/teori`);
if(parsePolarRoute(location.hash))navigate();
