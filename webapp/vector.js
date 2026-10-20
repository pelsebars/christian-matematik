import {vectorModules,vectorGoals,vectorLabel} from './vector-plan.js';
import {vectorRoute,parseVectorRoute,vectorSteps,vectorPages} from './vector-routes.js';
import {createVectorLesson} from './vector-lesson.js';
const root=document.querySelector('#vectorLesson');
const link=(route,label,cls='text-button')=>`<a class="${cls}" href="#${route}">${label}</a>`;
root.innerHTML=`<div id="vector-overview"><section class="lesson-section"><h2>Fra en parameter til en bane</h2><p>Tre moduler og én særskilt B-repetition følger læseplanen. Modul 1 er åbent. Modul 2, repetitionen og Modul 3 er planlagt. Opsamlingen er et afsluttende overblik og tæller ikke som en undervisningsgang.</p><p data-vector-overall role="status"></p><div class="module-roadmap">${vectorModules.map(m=>`<article class="module-card ${m.id==='1'?'is-current':''} ${m.id==='repetition'?'vector-repetition':''}"><div class="module-card-top"><span>${vectorLabel(m)}</span><strong data-vector-status="${m.id}">${m.id==='1'?'Ikke begyndt':'Planlagt'}</strong></div><h3>${m.title}</h3><p>${m.summary}</p><p>${m.date}${m.pages?' · Bogside '+m.pages:''}</p>${link(vectorRoute(m.id,m.id==='opsamling'?'':'start'),m.id==='1'?'Begynd eller fortsæt modul 1':'Se planen')}</article>`).join('')}</div></section><details class="vector-goal-map"><summary>Se hele læringsmålskortet</summary><p>U1–U5 og K1–K4 følger undervisningsbeskrivelsen side 7. A-målene konkretiserer kildearkene. B12–B13 hører til den særskilte repetition. Alle kontroller i senere undervisningsgange er planlagte.</p><div class="int-table" tabindex="0" role="region" aria-label="Læringsmålskort, rul vandret"><table><thead><tr><th>Læringsmål</th><th>Introduceres</th><th>Øves</th><th>Kontrolleres</th><th>Hjælpemidler og kilde</th></tr></thead><tbody>${vectorGoals.map(g=>`<tr><th scope="row">${g[0]}</th>${g.slice(1).map(s=>`<td>${s}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p>Grundbogens beviser er ifølge undervisningsbeskrivelsen ikke med i dette emne. Vi arbejder med begreber, begrundelser og kontroller. Kildearkets opgave om største afstand placeres i optimeringssporet, hvor metoden fagligt hører til.</p></details></div><div id="vector-session" hidden><nav class="vector-breadcrumb" aria-label="Tilbage til forløbet">${link(vectorRoute(),'← Vektorfunktioner · forløbsoversigt')}</nav><p data-vector-location role="status"></p><nav class="vector-step-menu" aria-label="Trin i Modul 1"></nav><div id="vector-module-one" hidden></div><section id="vector-planned" class="lesson-section" hidden></section><nav class="vector-page-controls" aria-label="Forrige og næste side"></nav></div>`;
let progress={status:'Ikke begyndt',count:0,total:30};
function showStatus(){
 root.querySelector('[data-vector-status="1"]').textContent=progress.status;
 root.querySelector('[data-vector-overall]').textContent=`${progress.status==='Gennemført'?1:0} af 4 undervisningsgange gennemført. Modul 1: ${progress.status.toLowerCase()}, ${progress.count} af ${progress.total} obligatoriske øvelser. De tre øvrige undervisningsgange er planlagte.`;
 const route=parseVectorRoute(location.hash);if(route?.module==='1'){
  const i=vectorPages.indexOf(route.path);root.querySelector('[data-vector-location]').textContent=`Modul 1 · ${progress.status} · ${progress.count} af ${progress.total} øvelser · Trin ${i+1} af ${vectorSteps.length}: ${vectorSteps[i]?.[1]||''}`;
 }
}
createVectorLesson(root.querySelector('#vector-module-one'),(status,count,total)=>{progress={status,count,total};showStatus();});
function navigate(focus=false){
 const route=parseVectorRoute(location.hash);if(!route)return;
 if(route.path!==location.hash.slice(1))history.replaceState(null,'','#'+route.path);
 const overview=!route.module,implemented=route.module==='1',module=vectorModules.find(m=>m.id===route.module);
 root.querySelector('#vector-overview').hidden=!overview;root.querySelector('#vector-session').hidden=overview;
 root.querySelector('#vector-module-one').hidden=!implemented;root.querySelector('.vector-step-menu').hidden=!implemented;root.querySelector('#vector-planned').hidden=overview||implemented;
 const subject=document.querySelector('[data-page=subject]');subject.classList.toggle('is-integral-session',!overview);subject.classList.toggle('is-integral-overview',overview);
 const title=overview?'Vektorfunktioner':`${vectorLabel(module)}: ${module.title}`;
 document.querySelector('#subjectTitle').textContent=title;document.title=title+' · Christians matematik';
 document.querySelector('#subjectDescription').textContent=overview?'Forstå parameter, position og bevægelse ét trin ad gangen.':implemented?'Læs, regn og kontrollér ét trin ad gangen. Svar, hints og noter gemmes på din konto.':'Planlagt · undervisning, opgaver og kontroller er endnu ikke implementeret.';
 document.querySelector('#subjectFormula').hidden=!overview;
 const controls=root.querySelector('.vector-page-controls');
 if(implemented){
  root.querySelectorAll('[data-vector-step]').forEach(p=>p.hidden=p.dataset.vectorStep!==route.step);
  root.querySelector('.vector-step-menu').innerHTML=vectorSteps.map(([id,label],i)=>`<a href="#${vectorRoute('1',id)}"${id===route.step?' aria-current="step"':''}><span>${i+1}</span>${label}</a>`).join('');
  const i=vectorPages.indexOf(route.path);
  controls.innerHTML=link(i?vectorPages[i-1]:vectorRoute(),i?'← Forrige trin':'← Forløbsoversigt')+link(i<vectorPages.length-1?vectorPages[i+1]:vectorRoute('2','start'),i<vectorPages.length-1?'Næste trin →':'Modul 2 · planlagt →');showStatus();
 }else if(!overview){
  root.querySelector('[data-vector-location]').textContent=vectorLabel(module)+' · Planlagt';
  root.querySelector('#vector-planned').innerHTML=`<h2>Plan for ${module.id==='opsamling'?'opsamlingen':'undervisningsgangen'}</h2><p><strong>Planlagt · ikke implementeret.</strong></p><p>${module.date}${module.pages?' · Bogside '+module.pages:''}.</p><p>${module.summary}</p><h3>Forudsætninger</h3><p>${module.prerequisites}</p><h3>Indhold og kontroller, der skal udvikles</h3><p>${module.practice}</p><p>Der er endnu ingen øvelser eller personlige resultater på denne side.</p>${link(vectorRoute(),'Tilbage til forløbsoversigten')}`;
  const i=vectorModules.indexOf(module),prev=vectorModules[i-1],next=vectorModules[i+1];
  controls.innerHTML=link(prev.id==='1'?vectorPages.at(-1):vectorRoute(prev.id,'start'),'← '+vectorLabel(prev))+(next?link(vectorRoute(next.id,next.id==='opsamling'?'':'start'),vectorLabel(next)+' →'):link(vectorRoute(),'Forløbsoversigt →'));
 }
 if(focus){window.scrollTo({top:0,behavior:'instant'});const h=document.querySelector('#subjectTitle');h.tabIndex=-1;h.focus({preventScroll:true});}
}
window.addEventListener('mathviewchange',event=>{if(event.detail.view==='vectorFunctions')navigate(event.detail.focus);});
window.openVectorSection=id=>window.showMathView(vectorRoute(id.replace('vector-module-',''),'start'));
if(parseVectorRoute(location.hash))navigate();
