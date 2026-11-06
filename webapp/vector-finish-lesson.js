import {bindLessonExercises} from './integral-exercises.js';
import {bindNormalNotes} from './normal-lesson-support.js';
import {finishContent} from './vector-finish-content.js';
import {finishPre,finishMini,finishFinal} from './vector-finish-exercises.js';
import {vectorFinishTasks,finishAreas} from './tasks/bank/vector-finish.js';
import {bindFinishGraphs} from './vector-finish-graphs.js';
export const VECTOR_FINISH_STORAGE_KEY='christian-matematik.vector.finish.v1';
export const VECTOR_FINISH_NOTES_KEY='christian-matematik.vector.finish-notes.v1';
export const vectorFinishLessonTasks=[...finishPre,...finishMini,...vectorFinishTasks,...finishFinal];
export const vectorFinishRequired=[...finishMini,...vectorFinishTasks,...finishFinal];
export const vectorFinishAreaStatus=complete=>finishAreas.map(([id,label,route])=>{const tasks=vectorFinishRequired.filter(t=>t.goals.includes('vfend.'+id));return{id,label,route,count:tasks.filter(complete).length,total:tasks.length};});
export function createVectorFinishLesson(host,onStatus){
 host.innerHTML=finishContent();bindLessonExercises(host,vectorFinishLessonTasks,VECTOR_FINISH_STORAGE_KEY,complete=>{
  const count=vectorFinishRequired.filter(complete).length,attempted=[...host.querySelectorAll('[data-int-card] input,[data-int-card] select')].some(e=>e.value!==''),status=count===vectorFinishRequired.length?'Gennemført':attempted?'I gang':'Ikke begyndt';
  host.querySelector('[data-vector-finish-pre]').textContent=`${finishPre.filter(complete).length} af seks startspørgsmål er korrekt kontrolleret.`;
  host.querySelector('[data-vector-finish-final]').textContent=`${finishFinal.filter(complete).length} af seks slutkort er korrekt kontrolleret.`;
  host.querySelector('[data-vector-finish-summary]').textContent=`Opsamling: ${status.toLowerCase()} · ${count} af ${vectorFinishRequired.length} obligatoriske aktiviteter korrekt kontrolleret. Brug områderne nedenfor til dit næste øvepunkt.`;
  host.querySelector('[data-vector-finish-areas]').innerHTML='<h3>Dine seks faglige områder</h3><ul>'+vectorFinishAreaStatus(complete).map(a=>`<li data-vector-finish-area="${a.id}"><strong>${a.label}:</strong> ${a.count} af ${a.total} kontroller korrekte. ${a.count===a.total?'På plads i denne opsamling.':`<a href="#vectorFunctions/${a.route}">Genbesøg grundlaget</a>`}</li>`).join('')+'</ul>';onStatus(status,count,vectorFinishRequired.length);
 },'vector-finish-basics');
 bindNormalNotes(host,'vector-finish-notes',VECTOR_FINISH_NOTES_KEY);bindFinishGraphs(host);
 host.addEventListener('click',event=>{const jump=event.target.closest('[data-int-jump="vector-finish-basics"]');if(!jump)return;const id=jump.closest('[data-int-card]').dataset.intCard.split('.').at(-1);window.showMathView('vectorFunctions/opsamling/start');const help=host.querySelector('#vector-finish-basics');help.querySelector(`[data-vector-finish-basic="${id}"]`).open=true;help.scrollIntoView({block:'start'});help.focus({preventScroll:true});});
}
