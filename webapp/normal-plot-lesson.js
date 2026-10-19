import {bindLessonExercises} from './integral-exercises.js';
import {bindNormalNotes} from './normal-lesson-support.js';
import {plotContent} from './normal-plot-content.js';
import {plotPre,plotMini,plotFinal} from './normal-plot-exercises.js';
import {normalPlotTasks} from './tasks/bank/normal-plots.js';
import {bindPlotGraphs} from './normal-plot-graphs.js';
export const PLOT_STORAGE_KEY='christian-matematik.normal.plots.v1';
export const PLOT_NOTES_KEY='christian-matematik.normal.plot-notes.v1';
export const plotLessonTasks=[...plotPre,...plotMini,...normalPlotTasks,...plotFinal];
export const plotRequired=[...plotMini,...normalPlotTasks,...plotFinal];
export function createPlotLesson(host,onStatus){
 host.innerHTML=plotContent();
 bindLessonExercises(host,plotLessonTasks,PLOT_STORAGE_KEY,complete=>{
  const count=plotRequired.filter(complete).length,attempted=[...host.querySelectorAll('[data-int-card] input,[data-int-card] select')].some(el=>el.value!=='');
  const status=count===plotRequired.length?'Gennemført':attempted?'I gang':'Ikke begyndt';
  host.querySelector('[data-plot-pre-status]').textContent=`${plotPre.filter(complete).length} af ${plotPre.length} grundspørgsmål er korrekt kontrolleret.`;
  host.querySelector('[data-plot-final-status]').textContent=`${plotFinal.filter(complete).length} af ${plotFinal.length} slutkort er korrekt kontrolleret.`;
  host.querySelector('[data-plot-next]').textContent=status==='Gennemført'?'De obligatoriske kontroller er gennemført. Gennemgå også din egen plotforklaring, modelkonklusion og værktøjsdokumentation. Modul 5 om konfidensinterval for hældningen er næste trin og er endnu planlagt.':`${count} af ${plotRequired.length} obligatoriske øvelser er korrekt kontrolleret. Brug feedbacken til at vælge mellem grundregning, akser, mønstervurdering og modeltolkning.`;
  onStatus(status,count,plotRequired.length);
 },'plot-basics');
 host.addEventListener('click',event=>{const jump=event.target.closest('[data-int-jump="plot-basics"]');if(!jump)return;const suffix=jump.closest('[data-int-card]').dataset.intCard.split('.').at(-1);window.showMathView('normalDistribution/4/start');const basics=host.querySelector('#plot-basics');basics.querySelector(`[data-plot-basic=${suffix}]`).open=true;basics.scrollIntoView({block:'start'});basics.focus({preventScroll:true});});
 bindNormalNotes(host,'plot-notes',PLOT_NOTES_KEY);bindPlotGraphs(host);
}
