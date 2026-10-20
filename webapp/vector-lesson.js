import {bindLessonExercises} from './integral-exercises.js';
import {bindNormalNotes} from './normal-lesson-support.js';
import {vectorContent} from './vector-content.js';
import {vectorPre,vectorMini,vectorFinal} from './vector-exercises.js';
import {vectorTasks} from './tasks/bank/vector.js';
import {bindVectorGraph} from './vector-graphs.js';
export const VECTOR_STORAGE_KEY='christian-matematik.vector.introduction.v1';
export const VECTOR_NOTES_KEY='christian-matematik.vector.notes.v1';
export const vectorLessonTasks=[...vectorPre,...vectorMini,...vectorTasks,...vectorFinal];
export const vectorRequired=[...vectorMini,...vectorTasks,...vectorFinal];
export function createVectorLesson(host,onStatus){
 host.innerHTML=vectorContent();
 bindLessonExercises(host,vectorLessonTasks,VECTOR_STORAGE_KEY,complete=>{
  const count=vectorRequired.filter(complete).length;
  const attempted=[...host.querySelectorAll('[data-int-card] input,[data-int-card] select')].some(el=>el.value!=='');
  const status=count===vectorRequired.length?'Gennemført':attempted?'I gang':'Ikke begyndt';
  host.querySelector('[data-vector-pre-status]').textContent=`${vectorPre.filter(complete).length} af ${vectorPre.length} grundspørgsmål er korrekt kontrolleret.`;
  host.querySelector('[data-vector-final-status]').textContent=`${vectorFinal.filter(complete).length} af ${vectorFinal.length} sluttjek er korrekt kontrolleret.`;
  host.querySelector('[data-vector-next]').textContent=status==='Gennemført'?'De obligatoriske kontroller i Modul 1 er gennemført. Genbesøg opgaverne i blandet træning senere. Modul 2 er næste trin og er åbent.':`${count} af ${vectorRequired.length} obligatoriske øvelser er korrekt kontrolleret. Genbesøg de trin, der mangler.`;
  onStatus(status,count,vectorRequired.length);
 },'vector-basics');
 host.addEventListener('click',event=>{
  const jump=event.target.closest('[data-int-jump="vector-basics"]');if(!jump)return;
  const basic=jump.closest('[data-int-card]').dataset.intCard.split('.').at(-1);
  window.showMathView('vectorFunctions/1/start');
  const help=host.querySelector('#vector-basics');help.querySelector(`[data-basic="${basic}"]`).open=true;help.scrollIntoView({block:'start'});help.focus({preventScroll:true});
 });
 bindNormalNotes(host,'vector-notes',VECTOR_NOTES_KEY);
 bindVectorGraph(host);
}
