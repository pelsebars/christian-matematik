import {bindLessonExercises} from './integral-exercises.js';
import {bindNormalNotes} from './normal-lesson-support.js';
import {measureContent} from './vector-measure-content.js';
import {measurePre,measureMini,measureFinal} from './vector-measure-exercises.js';
import {vectorMeasureTasks} from './tasks/bank/vector-measure.js';
import {bindMeasureGraphs} from './vector-measure-graphs.js';
export const MEASURE_STORAGE_KEY='christian-matematik.vector.measure.v1';
export const MEASURE_NOTES_KEY='christian-matematik.vector.measure-notes.v1';
export const measureLessonTasks=[...measurePre,...measureMini,...vectorMeasureTasks,...measureFinal];
export const measureRequired=[...measureMini,...vectorMeasureTasks,...measureFinal];
export function createMeasureLesson(host,onStatus){
 host.innerHTML=measureContent();
 bindLessonExercises(host,measureLessonTasks,MEASURE_STORAGE_KEY,complete=>{
  const count=measureRequired.filter(complete).length,attempted=[...host.querySelectorAll('[data-int-card] input,[data-int-card] select')].some(e=>e.value!==''),status=count===measureRequired.length?'Gennemført':attempted?'I gang':'Ikke begyndt';
  host.querySelector('[data-measure-pre-status]').textContent=`${measurePre.filter(complete).length} af ${measurePre.length} forudsætninger er korrekt kontrolleret.`;
  host.querySelector('[data-measure-final-status]').textContent=`${measureFinal.filter(complete).length} af ${measureFinal.length} sluttjek er korrekt kontrolleret.`;
  host.querySelector('[data-measure-next]').textContent=status==='Gennemført'?'Modul 3’s obligatoriske kontroller er gennemført. Genbesøg dine forklaringer og brug blandet træning. Fortsæt til opsamlingens blandede træning.':`${count} af ${measureRequired.length} obligatoriske øvelser er korrekt kontrolleret. Genbesøg de trin, der mangler.`;
  onStatus(status,count,measureRequired.length);
 },'measure-basics');
 host.addEventListener('click',event=>{const jump=event.target.closest('[data-int-jump="measure-basics"]');if(!jump)return;const id=jump.closest('[data-int-card]').dataset.intCard.split('.').at(-1);window.showMathView('vectorFunctions/3/start');const help=host.querySelector('#measure-basics');help.querySelector(`[data-measure-basic="${id}"]`).open=true;help.scrollIntoView({block:'start'});help.focus({preventScroll:true});});
 bindNormalNotes(host,'measure-notes',MEASURE_NOTES_KEY);bindMeasureGraphs(host);
}
