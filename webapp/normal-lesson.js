import { bindLessonExercises } from './integral-exercises.js';
import { accountStorage } from './account/store.js';
import { normalContent } from './normal-content.js';
import { normalPre,normalMini,normalFinal } from './normal-exercises.js';
import { normalTasks } from './tasks/bank/normal.js';
import { bindNormalGraphs } from './normal-graphs.js';
export const NORMAL_STORAGE_KEY='christian-matematik.normal.introduction.v1';
const NOTES_KEY='christian-matematik.normal.notes.v1';
export const normalLessonTasks=[...normalPre,...normalMini,...normalTasks,...normalFinal];
export const normalRequired=[...normalMini,...normalTasks,...normalFinal];
export function createNormalLesson(host,onStatus){
 host.innerHTML=normalContent();
 bindLessonExercises(host,normalLessonTasks,NORMAL_STORAGE_KEY,complete=>{
  const count=normalRequired.filter(complete).length;
  const attempted=[...host.querySelectorAll('input:not([type=range]),select:not([data-normal-value]),textarea')].some(el=>el.closest('[data-int-card]')&&el.value!=='');
  const status=count===normalRequired.length?'Gennemført':attempted?'I gang':'Ikke begyndt';
  host.querySelector('[data-normal-pre-status]').textContent=`${normalPre.filter(complete).length} af ${normalPre.length} grundspørgsmål er kontrolleret korrekt.`;
  host.querySelector('[data-normal-final-status]').textContent=`${normalFinal.filter(complete).length} af ${normalFinal.length} forståelsesspørgsmål er korrekte.`;
  host.querySelector('[data-normal-next]').textContent=status==='Gennemført'?'De obligatoriske kontroller er gennemført. Gennemgå også din egen forklaring og værktøjsdokumentation. Næste modul er planlagt.':`${count} af ${normalRequired.length} obligatoriske øvelser er korrekt kontrolleret. Fortsæt med ubesvarede opgaver, eller gentag det trin, der driller.`;
  onStatus(status,count,normalRequired.length);
 },'normal-basics');
 host.addEventListener('click',e=>{
  const jump=e.target.closest('[data-int-jump="normal-basics"]');if(!jump)return;
  const suffix=jump.closest('[data-int-card]')?.dataset.intCard.split('.').at(-1);
  const map={percent:'percent',interval:'interval',function:'function',area:'area',power:'power',root:'power',mean:'mean',probability:'probability',equation:'equation',tool:'tool'};
  window.showMathView('normalDistribution/1/start');
  const basics=host.querySelector('#normal-basics');basics.querySelector(`[data-basic="${map[suffix]||'probability'}"]`).open=true;basics.scrollIntoView({block:'start'});basics.focus({preventScroll:true});
 });
 const notes=host.querySelector('#normal-notes'),warning=host.querySelector('[data-lesson-warning]');
 const warn=()=>{warning.hidden=false;warning.textContent='Værktøjsnoterne kunne ikke gemmes. Hold siden åben for at bevare dem.';};
 try{notes.value=JSON.parse(accountStorage.getItem(NOTES_KEY)||'{}').text||'';}catch{warn();}
 notes.addEventListener('input',()=>{try{accountStorage.setItem(NOTES_KEY,JSON.stringify({text:notes.value}));}catch{warn();}});
 bindNormalGraphs(host);
}
