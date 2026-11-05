import {bindLessonExercises} from './integral-exercises.js';
import {bindNormalNotes} from './normal-lesson-support.js';
import {finishContent} from './normal-finish-content.js';
import {finishPre,finishMini,finishFinal} from './normal-finish-exercises.js';
import {normalFinishTasks,finishAreas} from './tasks/bank/normal-finish.js';
import {bindFinishGraphs} from './normal-finish-graphs.js';
export const NORMAL_FINISH_STORAGE_KEY='christian-matematik.normal.finish.v1';
export const NORMAL_FINISH_NOTES_KEY='christian-matematik.normal.finish-notes.v1';
export const normalFinishLessonTasks=[...finishPre,...finishMini,...normalFinishTasks,...finishFinal];
export const normalFinishRequired=[...finishMini,...normalFinishTasks,...finishFinal];
export const normalFinishAreaStatus=complete=>finishAreas.map(([id,label,route])=>{const tasks=normalFinishRequired.filter(t=>t.goals.includes('normend.'+id));return{id,label,route,count:tasks.filter(complete).length,total:tasks.length};});
export function createNormalFinishLesson(host,onStatus){
 host.innerHTML=finishContent();
 bindLessonExercises(host,normalFinishLessonTasks,NORMAL_FINISH_STORAGE_KEY,complete=>{
  const count=normalFinishRequired.filter(complete).length,attempted=[...host.querySelectorAll('[data-int-card] input,[data-int-card] select')].some(el=>el.value!==''),status=count===normalFinishRequired.length?'Gennemført':attempted?'I gang':'Ikke begyndt';
  host.querySelector('[data-normal-finish-pre]').textContent=`${finishPre.filter(complete).length} af seks startspørgsmål er korrekt kontrolleret.`;
  host.querySelector('[data-normal-finish-final]').textContent=`${finishFinal.filter(complete).length} af seks slutkort er korrekt kontrolleret.`;
  host.querySelector('[data-normal-finish-summary]').textContent=`Opsamling: ${status.toLowerCase()} · ${count} af ${normalFinishRequired.length} obligatoriske aktiviteter korrekt kontrolleret. ${status==='Gennemført'?'Gennemgå også egne begrundelser og værktøjsnoter.':'Brug områderne nedenfor til at vælge næste repetition.'}`;
  host.querySelector('[data-normal-finish-areas]').innerHTML='<h3>Dine seks faglige områder</h3><ul>'+normalFinishAreaStatus(complete).map(a=>`<li data-normal-finish-area="${a.id}"><strong>${a.label}:</strong> ${a.count} af ${a.total} kontroller korrekte. ${a.count===a.total?'På plads i denne opsamling.':`<a href="#normalDistribution/${a.route}">Genbesøg grundlaget</a>`}</li>`).join('')+'</ul>';
  onStatus(status,count,normalFinishRequired.length);
 },'normal-finish-basics');
 bindNormalNotes(host,'normal-finish-notes',NORMAL_FINISH_NOTES_KEY);bindFinishGraphs(host);
 host.addEventListener('click',event=>{const jump=event.target.closest('[data-int-jump="normal-finish-basics"]');if(!jump)return;window.showMathView('normalDistribution/opsamling/start');const basics=host.querySelector('#normal-finish-basics');basics.querySelectorAll('details').forEach(d=>d.open=true);basics.scrollIntoView({block:'start'});basics.focus({preventScroll:true});});
}
