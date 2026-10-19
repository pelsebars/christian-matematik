import { bindLessonExercises } from './integral-exercises.js';
import { bindNormalNotes } from './normal-lesson-support.js';
import { standardContent } from './normal-standard-content.js';
import { standardPre,standardMini,standardFinal } from './normal-standard-exercises.js';
import { normalStandardTasks } from './tasks/bank/normal-standard.js';
import { bindStandardLabs } from './normal-standard-graphs.js';
export const STANDARD_STORAGE_KEY='christian-matematik.normal.standard.v1';
export const STANDARD_NOTES_KEY='christian-matematik.normal.standard-notes.v1';
export const standardLessonTasks=[...standardPre,...standardMini,...normalStandardTasks,...standardFinal];
export const standardRequired=[...standardMini,...normalStandardTasks,...standardFinal];
export function createStandardLesson(host,onStatus){
 host.innerHTML=standardContent();
 bindLessonExercises(host,standardLessonTasks,STANDARD_STORAGE_KEY,complete=>{
  const count=standardRequired.filter(complete).length;
  const attempted=[...host.querySelectorAll('[data-int-card] input,[data-int-card] select')].some(el=>el.value!=='');
  const status=count===standardRequired.length?'Gennemført':attempted?'I gang':'Ikke begyndt';
  host.querySelector('[data-standard-pre-status]').textContent=`${standardPre.filter(complete).length} af ${standardPre.length} grundspørgsmål er korrekt kontrolleret. Brug grundhjælpen ved de konkrete spørgsmål.`;
  host.querySelector('[data-standard-final-status]').textContent=`${standardFinal.filter(complete).length} af ${standardFinal.length} forståelsesspørgsmål er korrekte.`;
  host.querySelector('[data-standard-next]').textContent=status==='Gennemført'?'De obligatoriske kontroller er gennemført. Gennemgå også din egen forklaring og værktøjsdokumentation. Modul 3 om ukendte modelparametre er næste trin og er åbent.':`${count} af ${standardRequired.length} obligatoriske øvelser er korrekt kontrolleret. Øv de ubesvarede opgaver og brug feedbacken til at skelne regnefejl fra begrebsfejl.`;
  onStatus(status,count,standardRequired.length);
 },'standard-basics');
 host.addEventListener('click',event=>{
  const jump=event.target.closest('[data-int-jump="standard-basics"]');if(!jump)return;
  const suffix=jump.closest('[data-int-card]')?.dataset.intCard.split('.').at(-1);
  const map={sign:'sign',negative:'sign',fraction:'fraction',decimal:'decimal',parameter:'parameter',complement:'area',area:'area',equation:'equation'};
  window.showMathView('normalDistribution/2/start');
  const basics=host.querySelector('#standard-basics');basics.querySelector(`[data-standard-basic="${map[suffix]||'tool'}"]`).open=true;basics.scrollIntoView({block:'start'});basics.focus({preventScroll:true});
 });
 bindNormalNotes(host,'standard-notes',STANDARD_NOTES_KEY);
 bindStandardLabs(host);
}
