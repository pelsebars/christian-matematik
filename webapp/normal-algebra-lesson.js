import {bindLessonExercises} from './integral-exercises.js';
import {bindNormalNotes} from './normal-lesson-support.js';
import {algebraContent} from './normal-algebra-content.js';
import {algebraPre,algebraMini,algebraFinal,algebraTracks,algebraTrackProgress} from './normal-algebra-exercises.js';
import {normalAlgebraTasks} from './tasks/bank/normal-algebra.js';
import {bindAlgebraGraphs} from './normal-algebra-graphs.js';
export const ALGEBRA_STORAGE_KEY='christian-matematik.normal.algebra.v1';
export const ALGEBRA_NOTES_KEY='christian-matematik.normal.algebra-notes.v1';
export const algebraLessonTasks=[...algebraPre,...algebraMini,...normalAlgebraTasks,...algebraFinal];
export function createAlgebraLesson(host,onStatus){
 host.innerHTML=algebraContent();
 bindLessonExercises(host,algebraLessonTasks,ALGEBRA_STORAGE_KEY,complete=>{
  const tracks=algebraTrackProgress(complete),count=tracks.filter(t=>t.mastered).length;
  for(const t of tracks){
   const attempted=[...t.pre,...t.practice,...t.final].some(task=>[...host.querySelector(`[data-int-card="${task.id}"]`).querySelectorAll('input,select')].some(el=>el.value!==''));
   t.status=t.mastered?'Gennemført':attempted?'I gang':'Ikke begyndt';
   host.querySelector(`[data-algebra-pre=${t.id}]`).textContent=`${t.preCount} af ${t.pre.length} grundspørgsmål er korrekt kontrolleret. ${t.fast?'Grundlaget er på plads. Prøv dette spors sluttjek direkte.':'Brug grundhjælpen ved de konkrete fejl, eller vælg træningen i dette spor.'}`;
   host.querySelector(`[data-algebra-final=${t.id}]`).textContent=`${t.finalCount} af ${t.final.length} slutkort er korrekt kontrolleret. ${t.label}: ${t.status.toLowerCase()}. ${t.mastered?'Gennemgå også din egen forklaring.':t.fast?'Sluttjekket er det næste nødvendige trin.':`${t.practiceCount} af ${t.practice.length} træningskort er korrekte. Hele træningen kan erstatte et bestået starttjek.`}`;
  }
  host.querySelector('[data-algebra-summary]').replaceChildren(...tracks.map(t=>{const p=document.createElement('p');p.dataset.algebraTrackStatus=t.id;p.textContent=`${t.label}: ${t.status}. Starttjek ${t.preCount}/${t.pre.length}; træning ${t.practiceCount}/${t.practice.length}; sluttjek ${t.finalCount}/${t.final.length}.`;return p;}));
  const started=tracks.some(t=>t.status!=='Ikke begyndt'),status=count===2?'Gennemført':started?'I gang':'Ikke begyndt';
  host.querySelector('[data-algebra-next]').textContent=count===2?'Begge spor er gennemført. Gennemgå dine forklaringer og kontroller. Næste undervisningsgang er Modul 4 om normalfordelingsplot, som endnu er planlagt.':`Fortsæt med ${tracks.filter(t=>!t.mastered).map(t=>t.label).join(' og ')}. Et gennemført spor kan springes over.`;
  onStatus(status,count,2);
 },'algebra-basics');
 host.addEventListener('click',event=>{
  const jump=event.target.closest('[data-int-jump="algebra-basics"]');
  if(jump){const suffix=jump.closest('[data-int-card]').dataset.intCard.split('.').at(-1);window.showMathView('normalDistribution/repetition/start');const basics=host.querySelector('#algebra-basics');basics.querySelector(`[data-algebra-basic="${suffix}"]`).open=true;basics.scrollIntoView({block:'start'});basics.focus({preventScroll:true});}
  const shortcut=event.target.closest('[data-algebra-shortcut]');if(shortcut){const track=algebraTracks.find(t=>t.id===shortcut.dataset.algebraShortcut);window.showMathView('normalDistribution/repetition/sluttjek');const target=host.querySelector('#algebra-final-'+track.id);target.scrollIntoView({block:'start'});target.focus({preventScroll:true});}
 });
 bindNormalNotes(host,'algebra-notes',ALGEBRA_NOTES_KEY);bindAlgebraGraphs(host);
}
