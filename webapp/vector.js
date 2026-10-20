import {vectorModules,vectorGoals,vectorLabel} from './vector-plan.js';
import {vectorRoute,parseVectorRoute,vectorImplemented,stepsForVectorModule,pagesForVectorModule} from './vector-routes.js';
import {createVectorLesson} from './vector-lesson.js';
import {createDynamicsLesson} from './vector-dynamics-lesson.js';
const root=document.querySelector('#vectorLesson');
const link=(route,label,cls='text-button')=>`<a class="${cls}" href="#${route}">${label}</a>`;
const ready=id=>vectorImplemented.includes(id);
const hostId=id=>({'1':'vector-module-one','2':'vector-module-two'}[id]);
root.innerHTML=`<div id="vector-overview"><section class="lesson-section"><h2>Fra en parameter til en bane</h2><p>Tre moduler og én særskilt B-repetition følger læseplanen. Modul 1 og 2 er åbne. Repetitionen og Modul 3 er planlagt. Opsamlingen er et afsluttende overblik og tæller ikke som en undervisningsgang.</p><p data-vector-overall role="status"></p><div class="module-roadmap">${vectorModules.map(m=>`<article class="module-card ${ready(m.id)?'is-current':''} ${m.id==='repetition'?'vector-repetition':''}"><div class="module-card-top"><span>${vectorLabel(m)}</span><strong data-vector-status="${m.id}">${ready(m.id)?'Ikke begyndt':'Planlagt'}</strong></div><h3>${m.title}</h3><p>${m.summary}</p><p>${m.date}${m.pages?' · Bogside '+m.pages:''}</p>${link(vectorRoute(m.id,m.id==='opsamling'?'':'start'),ready(m.id)?'Begynd eller fortsæt modul '+m.id:'Se planen')}</article>`).join('')}</div></section><details class="vector-goal-map"><summary>Se hele læringsmålskortet</summary><p>U1–U5 og K1–K4 følger undervisningsbeskrivelsen side 7. A-målene konkretiserer kildearkene. B12–B13 hører til den særskilte repetition. Modul 1 og 2 er implementeret. Kontroller i repetitionen og Modul 3 er planlagte.</p><div class="int-table" tabindex="0" role="region" aria-label="Læringsmålskort, rul vandret"><table><thead><tr><th>Læringsmål</th><th>Introduceres</th><th>Øves</th><th>Kontrolleres</th><th>Hjælpemidler og kilde</th></tr></thead><tbody>${vectorGoals.map(g=>`<tr><th scope="row">${g[0]}</th>${g.slice(1).map(s=>`<td>${s}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p>Grundbogens beviser er ifølge undervisningsbeskrivelsen ikke med i dette emne. Vi arbejder med begreber, begrundelser og kontroller. Kildearkets opgave om største afstand placeres i optimeringssporet, hvor metoden fagligt hører til.</p></details></div><div id="vector-session" hidden><nav class="vector-breadcrumb" aria-label="Tilbage til forløbet">${link(vectorRoute(),'← Vektorfunktioner · forløbsoversigt')}</nav><p data-vector-location role="status"></p><nav class="vector-step-menu" aria-label="Trin i undervisningsgangen"></nav>${vectorImplemented.map(id=>`<div id="${hostId(id)}" hidden></div>`).join('')}<section id="vector-planned" class="lesson-section" hidden></section><nav class="vector-page-controls" aria-label="Forrige og næste side"></nav></div>`;
const progress=new Map(vectorImplemented.map(id=>[id,{status:'Ikke begyndt',count:0,total:0}]));
function showStatus(){
 for(const [id,p] of progress)root.querySelector(`[data-vector-status="${id}"]`).textContent=p.status;
 const completed=[...progress.values()].filter(p=>p.status==='Gennemført').length;
 root.querySelector('[data-vector-overall]').textContent=`${completed} af 4 undervisningsgange gennemført. ${[...progress].map(([id,p])=>`Modul ${id}: ${p.status.toLowerCase()}, ${p.count} af ${p.total} obligatoriske øvelser`).join(' · ')}. Repetitionen, Modul 3 og opsamlingen er planlagte.`;
 const route=parseVectorRoute(location.hash),p=progress.get(route?.module);
 if(p){const steps=stepsForVectorModule(route.module),i=steps.findIndex(s=>s[0]===route.step);root.querySelector('[data-vector-location]').textContent=`Modul ${route.module} · ${p.status} · ${p.count} af ${p.total} øvelser · Trin ${i+1} af ${steps.length}: ${steps[i]?.[1]||''}`;}
}
for(const [id,create] of [['1',createVectorLesson],['2',createDynamicsLesson]])create(root.querySelector('#'+hostId(id)),(status,count,total)=>{progress.set(id,{status,count,total});showStatus();});
function navigate(focus=false){
 const route=parseVectorRoute(location.hash);if(!route)return;
 if(route.path!==location.hash.slice(1))history.replaceState(null,'','#'+route.path);
 const overview=!route.module,implemented=ready(route.module),module=vectorModules.find(m=>m.id===route.module);
 root.querySelector('#vector-overview').hidden=!overview;root.querySelector('#vector-session').hidden=overview;
 for(const id of vectorImplemented)root.querySelector('#'+hostId(id)).hidden=id!==route.module;
 root.querySelector('.vector-step-menu').hidden=!implemented;root.querySelector('#vector-planned').hidden=overview||implemented;
 const subject=document.querySelector('[data-page=subject]');subject.classList.toggle('is-integral-session',!overview);subject.classList.toggle('is-integral-overview',overview);
 const title=overview?'Vektorfunktioner':`${vectorLabel(module)}: ${module.title}`;
 document.querySelector('#subjectTitle').textContent=title;document.title=title+' · Christians matematik';
 document.querySelector('#subjectDescription').textContent=overview?'Forstå parameter, position og bevægelse ét trin ad gangen.':implemented?'Læs, regn og kontrollér ét trin ad gangen. Svar, hints og noter gemmes på din konto.':'Planlagt · undervisning, opgaver og kontroller er endnu ikke implementeret.';
 document.querySelector('#subjectFormula').hidden=!overview;
 const controls=root.querySelector('.vector-page-controls');
 if(implemented){
  const steps=stepsForVectorModule(route.module),pages=pagesForVectorModule(route.module),host=root.querySelector('#'+hostId(route.module));
  host.querySelectorAll('[data-vector-step]').forEach(p=>p.hidden=p.dataset.vectorStep!==route.step);
  const menu=root.querySelector('.vector-step-menu');menu.setAttribute('aria-label','Trin i Modul '+route.module);
  menu.innerHTML=steps.map(([id,label],i)=>`<a href="#${vectorRoute(route.module,id)}"${id===route.step?' aria-current="step"':''}><span>${i+1}</span>${label}</a>`).join('');
  const i=pages.indexOf(route.path),index=vectorModules.indexOf(module),prev=vectorModules[index-1],next=vectorModules[index+1];
  const before=i?pages[i-1]:prev?pagesForVectorModule(prev.id).at(-1)||vectorRoute(prev.id,'start'):vectorRoute();
  const after=i<pages.length-1?pages[i+1]:next?vectorRoute(next.id,next.id==='opsamling'?'':'start'):vectorRoute();
  controls.innerHTML=link(before,i?'← Forrige trin':prev?'← '+vectorLabel(prev):'← Forløbsoversigt')+link(after,i<pages.length-1?'Næste trin →':next?vectorLabel(next)+(ready(next.id)?' →':' · planlagt →'):'Forløbsoversigt →');showStatus();
 }else if(!overview){
  root.querySelector('[data-vector-location]').textContent=vectorLabel(module)+' · Planlagt';
  root.querySelector('#vector-planned').innerHTML=`<h2>Plan for ${module.id==='opsamling'?'opsamlingen':'undervisningsgangen'}</h2><p><strong>Planlagt · ikke implementeret.</strong></p><p>${module.date}${module.pages?' · Bogside '+module.pages:''}.</p><p>${module.summary}</p><h3>Forudsætninger</h3><p>${module.prerequisites}</p><h3>Indhold og kontroller, der skal udvikles</h3><p>${module.practice}</p><p>Der er endnu ingen øvelser eller personlige resultater på denne side.</p>${link(vectorRoute(),'Tilbage til forløbsoversigten')}`;
  const i=vectorModules.indexOf(module),prev=vectorModules[i-1],next=vectorModules[i+1];
  controls.innerHTML=link(pagesForVectorModule(prev.id).at(-1)||vectorRoute(prev.id,'start'),'← '+vectorLabel(prev))+(next?link(vectorRoute(next.id,next.id==='opsamling'?'':'start'),vectorLabel(next)+' →'):link(vectorRoute(),'Forløbsoversigt →'));
 }
 if(focus){window.scrollTo({top:0,behavior:'instant'});const h=document.querySelector('#subjectTitle');h.tabIndex=-1;h.focus({preventScroll:true});}
}
window.addEventListener('mathviewchange',event=>{if(event.detail.view==='vectorFunctions')navigate(event.detail.focus);});
window.openVectorSection=id=>window.showMathView(vectorRoute(id.replace('vector-module-',''),'start'));
if(parseVectorRoute(location.hash))navigate();
