import {bindLessonExercises} from './integral-exercises.js';
import {bindNormalNotes} from './normal-lesson-support.js';
import {dynamicsContent} from './vector-dynamics-content.js';
import {dynamicsPre,dynamicsMini,dynamicsFinal} from './vector-dynamics-exercises.js';
import {vectorDynamicsTasks} from './tasks/bank/vector-dynamics.js';
import {bindDynamicsGraphs} from './vector-dynamics-graphs.js';
export const DYNAMICS_STORAGE_KEY='christian-matematik.vector.dynamics.v1';
export const DYNAMICS_NOTES_KEY='christian-matematik.vector.dynamics-notes.v1';
export const dynamicsLessonTasks=[...dynamicsPre,...dynamicsMini,...vectorDynamicsTasks,...dynamicsFinal];
export const dynamicsRequired=[...dynamicsMini,...vectorDynamicsTasks,...dynamicsFinal];
export function createDynamicsLesson(host,onStatus){
 host.innerHTML=dynamicsContent();
 bindLessonExercises(host,dynamicsLessonTasks,DYNAMICS_STORAGE_KEY,complete=>{
  const count=dynamicsRequired.filter(complete).length;
  const attempted=[...host.querySelectorAll('[data-int-card] input,[data-int-card] select')].some(e=>e.value!=='');
  const status=count===dynamicsRequired.length?'Gennemført':attempted?'I gang':'Ikke begyndt';
  host.querySelector('[data-dynamics-pre-status]').textContent=`${dynamicsPre.filter(complete).length} af ${dynamicsPre.length} forudsætninger er korrekt kontrolleret.`;
  host.querySelector('[data-dynamics-final-status]').textContent=`${dynamicsFinal.filter(complete).length} af ${dynamicsFinal.length} sluttjek er korrekt kontrolleret.`;
  host.querySelector('[data-dynamics-next]').textContent=status==='Gennemført'?'Modul 2’s obligatoriske kontroller er gennemført. Genbesøg opgaverne i blandet træning senere. B-repetition 12–13 er næste undervisningsgang og er planlagt.':`${count} af ${dynamicsRequired.length} obligatoriske øvelser er korrekt kontrolleret. Genbesøg de trin, der mangler.`;
  onStatus(status,count,dynamicsRequired.length);
 },'dynamics-basics');
 host.addEventListener('click',event=>{
  const jump=event.target.closest('[data-int-jump="dynamics-basics"]');if(!jump)return;
  const id=jump.closest('[data-int-card]').dataset.intCard.split('.').at(-1);
  window.showMathView('vectorFunctions/2/start');
  const help=host.querySelector('#dynamics-basics');help.querySelector(`[data-basic="${id}"]`).open=true;help.scrollIntoView({block:'start'});help.focus({preventScroll:true});
 });
 bindNormalNotes(host,'dynamics-notes',DYNAMICS_NOTES_KEY);
 bindDynamicsGraphs(host);
}
