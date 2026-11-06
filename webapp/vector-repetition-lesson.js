import {bindLessonExercises} from './integral-exercises.js';
import {bindNormalNotes} from './normal-lesson-support.js';
import {repetitionContent} from './vector-repetition-content.js';
import {repetitionPre,repetitionMini,repetitionFinal,repetitionTracks,repetitionTrackProgress} from './vector-repetition-exercises.js';
import {vectorRepetitionTasks} from './tasks/bank/vector-repetition.js';
import {bindRepetitionGraphs} from './vector-repetition-graphs.js';
export const REPETITION_STORAGE_KEY='christian-matematik.vector.repetition.v1';
export const REPETITION_NOTES_KEY='christian-matematik.vector.repetition-notes.v1';
export const repetitionLessonTasks=[...repetitionPre,...repetitionMini,...vectorRepetitionTasks,...repetitionFinal];
export function createRepetitionLesson(host,onStatus){
 host.innerHTML=repetitionContent();
 bindLessonExercises(host,repetitionLessonTasks,REPETITION_STORAGE_KEY,complete=>{
  const tracks=repetitionTrackProgress(complete);
  for(const track of tracks){
   const attempted=[...track.pre,...track.practice,...track.final].some(t=>[...host.querySelector(`[data-int-card="${t.id}"]`).querySelectorAll('input,select')].some(el=>el.value!==''));
   track.status=track.mastered?'Gennemført':attempted?'I gang':'Ikke begyndt';
   host.querySelector(`[data-repetition-pre="${track.id}"]`).textContent=`${track.preCount} af ${track.pre.length} startkort er korrekt kontrolleret. ${track.fast?'Grundlaget er på plads. Genvejen til dette spors sluttjek er åben.':'Brug grundhjælpen ved de konkrete fejl og genopbyg sporet. Genvejen åbner ved fire korrekte startkort.'}`;
   host.querySelector(`[data-repetition-shortcut="${track.id}"]`).disabled=!track.fast;
   host.querySelector(`[data-repetition-final="${track.id}"]`).textContent=`${track.finalCount} af ${track.final.length} slutkort er korrekt kontrolleret. ${track.label}: ${track.status.toLowerCase()}. ${track.fast?'Starttjekket giver adgang til den korte vej.':`${track.practiceCount} af ${track.practice.length} træningskort er korrekte. Hele træningen kan erstatte et bestået starttjek.`}`;
  }
  host.querySelector('[data-repetition-summary]').replaceChildren(...tracks.map(t=>{const p=document.createElement('p');p.dataset.repetitionTrackStatus=t.id;p.textContent=`${t.label}: ${t.status}. Starttjek ${t.preCount} af ${t.pre.length}; træning ${t.practiceCount} af ${t.practice.length}; sluttjek ${t.finalCount} af ${t.final.length}.`;return p;}));
  const count=tracks.filter(t=>t.mastered).length,status=count===2?'Gennemført':tracks.some(t=>t.status!=='Ikke begyndt')?'I gang':'Ikke begyndt';
  host.querySelector('[data-repetition-next]').textContent=count===2?'Begge repetitionsspor er gennemført. Gennemgå dine forklaringer og kontroller. Modul 3 om areal og kurvelængde er næste undervisningsgang og er nu åben.':`Fortsæt med ${tracks.filter(t=>!t.mastered).map(t=>t.label).join(' og ')}. Et gennemført spor behøver ikke gentages.`;
  onStatus(status,count,2);
 },'repetition-basics');
 host.addEventListener('click',e=>{
  const jump=e.target.closest('[data-int-jump="repetition-basics"]');
  if(jump){const suffix=jump.closest('[data-int-card]').dataset.intCard.split('.').at(-1);window.showMathView('vectorFunctions/repetition/start');const help=host.querySelector('#repetition-basics');help.querySelector(`[data-repetition-basic="${suffix}"]`).open=true;help.scrollIntoView({block:'start'});help.focus({preventScroll:true});}
  const shortcut=e.target.closest('[data-repetition-shortcut]');if(shortcut&&!shortcut.disabled){window.showMathView('vectorFunctions/repetition/sluttjek');const target=host.querySelector('#repetition-final-'+shortcut.dataset.repetitionShortcut);requestAnimationFrame(()=>requestAnimationFrame(()=>{target.scrollIntoView({block:'start'});target.focus({preventScroll:true});}));}
 });
 bindNormalNotes(host,'repetition-notes',REPETITION_NOTES_KEY);bindRepetitionGraphs(host);
}
