import {bindLessonExercises} from './integral-exercises.js';
import {bindNormalNotes} from './normal-lesson-support.js';
import {regressionContent} from './normal-regression-content.js';
import {regressionPre,regressionMini,regressionFinal} from './normal-regression-exercises.js';
import {normalRegressionTasks} from './tasks/bank/normal-regression.js';
import {bindRegressionGraphs} from './normal-regression-graphs.js';
export const REGRESSION_STORAGE_KEY='christian-matematik.normal.regression.v1';
export const REGRESSION_NOTES_KEY='christian-matematik.normal.regression-notes.v1';
export const regressionLessonTasks=[...regressionPre,...regressionMini,...normalRegressionTasks,...regressionFinal];
export const regressionRequired=[...regressionMini,...normalRegressionTasks,...regressionFinal];
export function createRegressionLesson(host,onStatus){
 host.innerHTML=regressionContent();
 bindLessonExercises(host,regressionLessonTasks,REGRESSION_STORAGE_KEY,complete=>{
  const count=regressionRequired.filter(complete).length,attempted=[...host.querySelectorAll('[data-int-card] input,[data-int-card] select')].some(el=>el.value!=='');
  const status=count===regressionRequired.length?'Gennemført':attempted?'I gang':'Ikke begyndt';
  host.querySelector('[data-regression-pre-status]').textContent=`${regressionPre.filter(complete).length} af ${regressionPre.length} grundspørgsmål er korrekt kontrolleret.`;
  host.querySelector('[data-regression-final-status]').textContent=`${regressionFinal.filter(complete).length} af ${regressionFinal.length} slutkort er korrekt kontrolleret.`;
  host.querySelector('[data-regression-next]').textContent=status==='Gennemført'?'Alle obligatoriske kontroller er gennemført. Gennemgå også dine egne begrundelser og værktøjsnoter. Fortsæt med blandede opgaver; den særskilte opsamling er planlagt.':`${count} af ${regressionRequired.length} obligatoriske øvelser er korrekt kontrolleret. Brug feedbacken til at vælge grundregning, modelkontrol eller intervalfortolkning.`;
  onStatus(status,count,regressionRequired.length);
 },'regression-basics');
 host.addEventListener('click',event=>{const jump=event.target.closest('[data-int-jump="regression-basics"]');if(!jump)return;const suffix=jump.closest('[data-int-card]').dataset.intCard.split('.').at(-1);window.showMathView('normalDistribution/5/start');const basics=host.querySelector('#regression-basics'),detail=basics.querySelector(`[data-regression-basic="${suffix}"]`);if(detail)detail.open=true;basics.scrollIntoView({block:'start'});basics.focus({preventScroll:true});});
 bindNormalNotes(host,'regression-notes',REGRESSION_NOTES_KEY);bindRegressionGraphs(host);
}
