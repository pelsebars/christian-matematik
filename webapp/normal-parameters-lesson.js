import { bindLessonExercises } from './integral-exercises.js';
import { bindNormalNotes } from './normal-lesson-support.js';
import { parameterContent } from './normal-parameters-content.js';
import { parameterPre,parameterMini,parameterFinal } from './normal-parameters-exercises.js';
import { normalParameterTasks } from './tasks/bank/normal-parameters.js';
import { bindParameterGraphs } from './normal-parameters-graphs.js';
export const PARAMETERS_STORAGE_KEY='christian-matematik.normal.parameters.v1';
export const PARAMETERS_NOTES_KEY='christian-matematik.normal.parameters-notes.v1';
export const parameterLessonTasks=[...parameterPre,...parameterMini,...normalParameterTasks,...parameterFinal];
export const parameterRequired=[...parameterMini,...normalParameterTasks,...parameterFinal];
export function createParameterLesson(host,onStatus){
 host.innerHTML=parameterContent();
 bindLessonExercises(host,parameterLessonTasks,PARAMETERS_STORAGE_KEY,complete=>{
  const count=parameterRequired.filter(complete).length;
  const attempted=[...host.querySelectorAll('[data-int-card] input,[data-int-card] select')].some(el=>el.value!=='');
  const status=count===parameterRequired.length?'Gennemført':attempted?'I gang':'Ikke begyndt';
  host.querySelector('[data-parameter-pre-status]').textContent=`${parameterPre.filter(complete).length} af ${parameterPre.length} grundspørgsmål er korrekt kontrolleret.`;
  host.querySelector('[data-parameter-final-status]').textContent=`${parameterFinal.filter(complete).length} af ${parameterFinal.length} forståelsesspørgsmål er korrekte.`;
  host.querySelector('[data-parameter-next]').textContent=status==='Gennemført'?'De obligatoriske kontroller er gennemført. Gennemgå også dine forklaringer og din værktøjsdokumentation. Næste undervisningsgang er den særskilte B-repetition 10–11, som nu er åben.':`${count} af ${parameterRequired.length} obligatoriske øvelser er korrekt kontrolleret. Brug feedbacken til at vælge mellem grundregning, områdevalg og modelkontrol.`;
  onStatus(status,count,parameterRequired.length);
 },'parameter-basics');
 host.addEventListener('click',event=>{
  const jump=event.target.closest('[data-int-jump="parameter-basics"]');if(!jump)return;
  const suffix=jump.closest('[data-int-card]')?.dataset.intCard.split('.').at(-1);
  const map={sign:'sign',fraction:'fraction',tail:'tail',percent:'tail',equation:'equation',parameter:'parameter',cdf:'cdf',square:'square'};
  window.showMathView('normalDistribution/3/start');const basics=host.querySelector('#parameter-basics');basics.querySelector(`[data-parameter-basic="${map[suffix]||'tool'}"]`).open=true;basics.scrollIntoView({block:'start'});basics.focus({preventScroll:true});
 });
 bindNormalNotes(host,'parameter-notes',PARAMETERS_NOTES_KEY);bindParameterGraphs(host);
}
