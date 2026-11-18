import { accountStorage, flush, hasConflict } from './account/store.js';
import { escapeHTML as esc } from './tasks/math.js';
import { TERM_NAMESPACE, HOUR, LIMIT, termParts, freshTerm, elapsedTerm, lockedTerm, advanceTerm, termGrade, termTotal, termCharacter, validTerm } from './term-exam-model.js';
const root = document.querySelector('#termExamView');
let state = freshTerm(), warning = '';
try { const saved=JSON.parse(accountStorage.getItem(TERM_NAMESPACE)||'null'); if(saved) { if(!validTerm(saved)) throw Error(); state=saved; } }
catch { warning='Det gemte forsøg kunne ikke læses. Hent en kladde i sidemenuen, før du fortsætter.'; }
const clock = ms => { const seconds=Math.floor(ms/1000); return `${String(Math.floor(seconds/3600)).padStart(2,'0')}:${String(Math.floor(seconds/60)%60).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`; };
function persist() {
 try { accountStorage.setItem(TERM_NAMESPACE,JSON.stringify(state)); }
 catch { warning='Besvarelsen kunne ikke gemmes. Hold siden åben og hent en kladde.'; }
 root.querySelector('#termSave').textContent=warning||'Svar og tid gemmes automatisk. Se gemmestatus i sidemenuen.';
}
function resultHTML() {
 const total=termTotal(state), grades=termParts.map(p=>termGrade(p,state)), pending=grades.filter(g=>g.points===null).length;
 return `<h2>Afleveringsstatus</h2><p class="term-score">${total} / 250 point · ${Number((total/2.5).toFixed(1)).toLocaleString('da-DK')} % · Anslået karakter: ${termCharacter(total)}</p><p>Arbejdstid: ${clock(state.elapsed)} (timer:minutter:sekunder). Pauser er ikke medregnet.</p><p>Automatisk score: ${grades.reduce((n,g)=>n+(g.automatic||0),0)} point. ${grades.filter(g=>g.status==='overridden').length} delspørgsmål er vurderet manuelt.${pending?` ${pending} afventer gennemgang og tæller foreløbig som 0 point.`:''}</p><p>Prøvens point tæller også på din konto, når ændringerne er gemt. Manuelle rettelser ændrer kun forskellen i point.</p><details><summary>Om den anslåede karakter</summary><p>Vejledende pointgrænser baseret på 2019-tabellen, med midten af overlap som grænse: 0–17: −3 · 18–64: 00 · 65–81: 02 · 82–121: 4 · 122–171: 7 · 172–208: 10 · 209–250: 12.</p><p>Dette er et træningsresultat. Metode, forklaringer og mellemregninger skal også gennemgås.</p></details>`;
}
function reviewHTML(p) {
 const g=termGrade(p,state);
 const label = g.status==='overridden'?'Manuelt vurderet':g.points===null?'Afventer vurdering':g.points===10?'✓ Korrekt':g.status==='unanswered'?'Ubesvaret':'✕ Ikke godkendt automatisk';
 return `<p class="term-verdict" data-status="${g.status}">${label} · ${g.points ?? '—'} / 10 point</p><p><strong>Facit / tjek:</strong> ${esc(p.solution)}</p><label class="term-override"><input type="checkbox" data-full="${p.id}" ${state.manual[p.id]===10?'checked':''}> Godkend manuelt · 10 point</label><label>Manuelle delpoint <select data-manual="${p.id}" aria-label="Manuelle point ${p.id}"><option value="">Brug automatisk vurdering</option>${Array.from({length:11},(_,i)=>`<option value="${i}" ${state.manual[p.id]===i?'selected':''}>${i} / 10 point</option>`).join('')}</select></label>`;
}
function render() {
 const done=state.status==='finished';
 root.innerHTML=`<header class="page-intro"><p class="eyebrow">STX A · August 2026</p><h1>Termins opgave</h1><p>16 opgaver · 25 delspørgsmål · 250 point</p></header>
 <div class="term-toolbar" aria-label="Prøvens tid og kontrol"><div class="term-buttons"><button type="button" data-term="start">START</button><button type="button" data-term="pause">PAUSE</button><button type="button" data-term="finish">FÆRDIG</button></div><div class="term-clocks"><div><span>Del 1 · 2 timer</span><strong id="termClock1"></strong></div><div><span>Del 2 · 3 timer</span><strong id="termClock2"></strong></div><div><span>Samlet · 5 timer</span><strong id="termClockTotal"></strong></div></div><p id="termPhase" role="status"></p></div>
 <p id="termSave" role="status">${esc(warning||'Svar og tid gemmes automatisk. Se gemmestatus i sidemenuen.')}</p>
 <section class="term-result" ${done?'':'hidden'} aria-live="polite">${done?resultHTML():''}</section>
 <div class="term-info"><p>Læs opgaverne i dit opgavedokument. Alle opgaver kan besvares de første to timer. Derefter låses opgave 1–9. Efter fem timers arbejdstid afleveres automatisk. Tiden fortsætter, hvis du forlader siden; brug PAUSE for at stoppe tiden.</p><p>Skriv tal uden enheder. Komma og punktum accepteres. Brug ^ til potenser og * til gange. Ukendte formelnotationer kan vurderes manuelt efter aflevering. Tegninger og mellemregninger laves på papir eller i dit matematikprogram.</p></div>
 ${Array.from({length:16},(_,i)=>{const task=i+1;return `<section class="term-task"><h2>Opgave ${task} <small>${task<=9?'Del 1':'Del 2'}</small></h2>${task===10?'<p class="term-note">Bilaget Loebetider.xlsx er endnu ikke modtaget. Opgaven er klar til, at du får arket. Den indgår fortsat i prøvens 250 mulige point.</p>':''}${termParts.filter(p=>p.task===task).map(p=>`<div class="term-part" data-part="${p.id}"><fieldset data-answer-task="${task}"><legend>${p.id.split('.')[1]}) <span>10 point</span></legend><div class="term-fields">${p.labels.map((label,i)=>{const value=p.labels.length>1?state.answers[p.id]?.[i]:state.answers[p.id];return `<label>${esc(label)}${p.type==='text'?`<textarea data-answer="${p.id}" data-index="${i}" maxlength="4000" rows="3">${esc(value||'')}</textarea>`:`<input type="text" data-answer="${p.id}" data-index="${i}" maxlength="4000" autocomplete="off" spellcheck="false" value="${esc(value||'')}">`}</label>`;}).join('')}</div></fieldset><div class="term-review">${done?reviewHTML(p):''}</div></div>`).join('')}</section>`;}).join('')}`;
 updateControls();
}
function updateControls() {
 const elapsed=elapsedTerm(state), blocked=Boolean(warning)||hasConflict();
 root.querySelector('#termClock1').textContent=clock(Math.min(elapsed,2*HOUR));
 root.querySelector('#termClock2').textContent=clock(Math.max(0,elapsed-2*HOUR));
 root.querySelector('#termClockTotal').textContent=clock(elapsed);
 root.querySelector('[data-term="start"]').disabled=blocked||state.status!=='ready';
 const pause=root.querySelector('[data-term="pause"]'); pause.textContent=state.status==='paused'?'FORTSÆT':'PAUSE'; pause.disabled=blocked||!['running','paused'].includes(state.status);
 root.querySelector('[data-term="finish"]').disabled=blocked||!['running','paused'].includes(state.status);
 root.querySelector('#termPhase').textContent=state.status==='ready'?'Tryk START, når du er klar.':state.status==='finished'?'Afleveret · svarene er låst.':state.status==='paused'?'Pause · svarfelterne er låst.':elapsed>=2*HOUR?'Del 1 er låst. Du kan nu besvare opgave 10–16.':'Del 1 er i gang. Du kan besvare opgave 1–16.';
 root.querySelectorAll('[data-answer-task]').forEach(el=>{el.disabled=blocked||lockedTerm(state,Number(el.dataset.answerTask));});
 root.querySelectorAll('[data-full],[data-manual]').forEach(el=>{el.disabled=blocked;});
}
function tick() {
 const next=advanceTerm(state,'tick');
 if(next!==state) { state=next;persist();render();void flush(); }
 else updateControls();
}
root.addEventListener('input',e=>{
 const id=e.target.dataset.answer; if(!id)return;
 const p=termParts.find(p=>p.id===id);
 if(warning||hasConflict()||lockedTerm(state,p.task)) {tick();return;}
 if(p.labels.length>1) {const values=[...(state.answers[id]||p.labels.map(()=>''))];values[Number(e.target.dataset.index)]=e.target.value;state.answers[id]=values;}
 else state.answers[id]=e.target.value;
 persist();
});
root.addEventListener('click',e=>{
 const action=e.target.dataset.term;if(!action||warning||hasConflict())return;
 tick();
 if(action==='finish'&&!confirm('Aflever prøven nu? Alle svar låses, og du går til resultatet.'))return;
 state=advanceTerm(state,action==='pause'&&state.status==='paused'?'resume':action);
 persist();render();void flush();
 if(state.status==='finished')root.querySelector('.term-result').scrollIntoView({behavior:'smooth',block:'center'});
});
root.addEventListener('change',e=>{
 const id=e.target.dataset.manual||e.target.dataset.full;
 if(!id||state.status!=='finished'||warning||hasConflict())return;
 const previous=state.manual[id]??null;
 const value=e.target.dataset.full?(e.target.checked?10:null):(e.target.value===''?null:Number(e.target.value));
 if(value===null)delete state.manual[id];else state.manual[id]=value;
 state.reviewLog=[...(state.reviewLog||[]),{part:id,from:previous,to:value,at:Date.now()}].slice(-500);
 persist();
 root.querySelector(`[data-part="${id}"] .term-review`).innerHTML=reviewHTML(termParts.find(p=>p.id===id));
 root.querySelector('.term-result').innerHTML=resultHTML();
 void flush();
});
render();tick();setInterval(tick,1000);
window.addEventListener('account-conflict',updateControls);
window.addEventListener('focus',tick);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick();});
