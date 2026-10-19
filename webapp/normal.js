import { normalModules,normalGoals,normalLabel } from './normal-plan.js';
import { normalRoute,parseNormalRoute,normalImplemented,stepsForNormalModule,pagesForNormalModule } from './normal-routes.js';
import { createNormalLesson } from './normal-lesson.js';
import { createStandardLesson } from './normal-standard-lesson.js';
import { createParameterLesson } from './normal-parameters-lesson.js';
const root=document.querySelector('#normalLesson');
const link=(path,label,cls='text-button')=>`<a class="${cls}" href="#${path}">${label}</a>`;
const ready=id=>normalImplemented.includes(id);
const hostId=id=>({'1':'normal-module-one','2':'normal-module-two','3':'normal-module-three'}[id]);
root.innerHTML=`<div id="normal-overview"><section class="lesson-section"><h2>Fra målinger til sandsynligheder</h2><p>Fem moduler og en særskilt B-repetition følger læseplanen fra 4. til 9. november 2026. Modul 1–3 er åbne. De øvrige undervisningsgange og den afsluttende opsamling er planlagt.</p><p data-normal-overall role="status"></p><div class="module-roadmap">${normalModules.map(m=>`<article class="module-card ${ready(m.id)?'is-current':''}" id="normal-module-${m.id}"><div class="module-card-top"><span>${normalLabel(m)}</span><strong data-normal-status="${m.id}">${ready(m.id)?'Ikke begyndt':'Planlagt'}</strong></div><h3>${m.title}</h3><p>${m.summary}</p><p>${/^\d/.test(m.date)?m.date+' 2026':m.date}${m.pages?' · Bogside '+m.pages:''}</p>${link(normalRoute(m.id),ready(m.id)?'Begynd eller fortsæt modul '+m.id:'Se planen')}</article>`).join('')}</div></section><details class="normal-goal-map"><summary>Se hele læringsmålskortet</summary><p>U1–U7 er undervisningsbeskrivelsens faglige mål; K1–K6 er kernestoffet. A-mål præciserer kildearkene. B10–B11 hører til den særskilte repetition. Binomialfordeling og kombinatorik er endnu ikke tilstrækkeligt dækket i appen; B8–9 er planlagt i det tidligere forløb. Kontroller i senere moduler er planlagte.</p><div class="int-table" tabindex="0" role="region" aria-label="Læringsmålskort, rul vandret"><table><thead><tr><th>Læringsmål</th><th>Introduceres</th><th>Øves</th><th>Kontrolleres</th><th>Hjælpemidler</th><th>Datasæt eller eksempel</th></tr></thead><tbody>${normalGoals.map(g=>`<tr><th scope="row">${g[0]}</th>${g.slice(1).map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p>Undervisningsbeskrivelsen henviser til særskilte bevisfotokopier. De fem opgaveark indeholder ikke alle disse beviser. Appens korte forklaringer er ikke en gengivelse af de separate beviser.</p></details></div>
 <div id="normal-session" hidden><nav class="normal-breadcrumb" aria-label="Tilbage til forløbet">${link(normalRoute(),'← Normalfordeling · forløbsoversigt')}</nav><p data-normal-location role="status"></p><nav class="normal-step-menu" aria-label="Trin i undervisningsmodulet"></nav>${normalImplemented.map(id=>`<div id="${hostId(id)}" hidden></div>`).join('')}<section id="normal-planned" class="lesson-section" hidden></section><nav class="normal-page-controls" aria-label="Forrige og næste side"></nav></div>`;
const progress=new Map(normalImplemented.map(id=>[id,{status:'Ikke begyndt',count:0,total:0}]));
function showStatus(){
 for(const [id,p] of progress)root.querySelector(`[data-normal-status="${id}"]`).textContent=p.status;
 const completed=[...progress.values()].filter(p=>p.status==='Gennemført').length;
 root.querySelector('[data-normal-overall]').textContent=`Samlet: ${completed} af 6 undervisningsgange gennemført. ${[...progress].map(([id,p])=>`Modul ${id}: ${p.status.toLowerCase()}, ${p.count} af ${p.total} obligatoriske øvelser`).join(' · ')}. De tre øvrige undervisningsgange og opsamlingen er planlagt.`;
 const route=parseNormalRoute(location.hash),p=progress.get(route?.module);
 if(p){const steps=stepsForNormalModule(route.module),i=steps.findIndex(s=>s[0]===route.step);root.querySelector('[data-normal-location]').textContent=`Modul ${route.module} · ${p.status} · ${p.count} af ${p.total} øvelser · Trin ${i+1} af ${steps.length}: ${steps[i]?.[1]||''}`;}
}
for(const [id,create] of [['1',createNormalLesson],['2',createStandardLesson],['3',createParameterLesson]])create(root.querySelector('#'+hostId(id)),(status,count,total)=>{progress.set(id,{status,count,total});showStatus();});
function navigate(focus=false){
 const route=parseNormalRoute(location.hash);if(!route)return;
 if(route.path!==location.hash.slice(1))history.replaceState(null,'',`#${route.path}`);
 const overview=!route.module,implemented=ready(route.module);
 root.querySelector('#normal-overview').hidden=!overview;root.querySelector('#normal-session').hidden=overview;
 for(const id of normalImplemented)root.querySelector('#'+hostId(id)).hidden=id!==route.module;
 root.querySelector('.normal-step-menu').hidden=!implemented;
 root.querySelector('#normal-planned').hidden=overview||implemented;
 const subject=document.querySelector('[data-page="subject"]');subject.classList.toggle('is-integral-session',!overview);subject.classList.toggle('is-integral-overview',overview);
 const module=normalModules.find(m=>m.id===route.module),title=overview?'Normalfordeling':`${normalLabel(module)}: ${module.title}`;
 document.querySelector('#subjectTitle').textContent=title;
 document.querySelector('#subjectDescription').textContent=overview?'Forstå variation, kurver og sandsynligheder ét trin ad gangen.':implemented?'Læs, regn og kontrollér ét trin ad gangen. Dine svar og hints gemmes på din konto.':'Planlagt undervisningsgang · teori, opgaver og kontroller er endnu ikke implementeret.';
 document.querySelector('#subjectFormula').hidden=!overview;document.title=`${title} · Christians matematik`;
 const controls=root.querySelector('.normal-page-controls');
 if(implemented){
  const host=root.querySelector('#'+hostId(route.module)),steps=stepsForNormalModule(route.module),pages=pagesForNormalModule(route.module),i=pages.indexOf(route.path);
  host.querySelectorAll('[data-normal-step]').forEach(panel=>panel.hidden=panel.dataset.normalStep!==route.step);
  root.querySelector('.normal-step-menu').innerHTML=steps.map(([id,title],index)=>link(normalRoute(route.module,id),`<span>${index+1}</span>${title}`)).join('');
  root.querySelector('.normal-step-menu').setAttribute('aria-label','Trin i modul '+route.module);
  root.querySelectorAll('.normal-step-menu a').forEach(a=>{if(a.hash===`#${route.path}`)a.setAttribute('aria-current','step');});
  const moduleIndex=normalModules.indexOf(module),previous=normalModules[moduleIndex-1],next=normalModules[moduleIndex+1];
  const previousPath=i?pages[i-1]:previous?pagesForNormalModule(previous.id).at(-1)||normalRoute(previous.id):normalRoute();
  const nextPath=i<pages.length-1?pages[i+1]:ready(next?.id)?pagesForNormalModule(next.id)[0]:normalRoute(next?.id||'');
  controls.innerHTML=link(previousPath,i?'← Forrige trin':previous?'← Forrige modul':'← Forløbsoversigt')+link(nextPath,i<pages.length-1?'Næste trin →':ready(next?.id)?'Næste modul →':'Næste modul · planlagt →');
  showStatus();
 }else if(!overview){
  const i=normalModules.indexOf(module);
  root.querySelector('[data-normal-location]').textContent=`${normalLabel(module)} · Planlagt`;
  root.querySelector('#normal-planned').innerHTML=`<h2>Plan for undervisningsgangen</h2><p><strong>Planlagt · ikke implementeret.</strong></p><p>${module.summary}</p><h3>Forudsætninger, der skal undersøges</h3><p>${module.prerequisites}</p><h3>Øvelser og kontrol, der skal udvikles</h3><p>${module.practice}</p><p>Der er endnu ingen opgaver eller personlige resultater på denne side.</p>${link(normalRoute(),'Tilbage til forløbsoversigten')}`;
  controls.innerHTML=link(normalRoute(normalModules[i-1].id),'← '+normalLabel(normalModules[i-1]))+(i<normalModules.length-1?link(normalRoute(normalModules[i+1].id),normalLabel(normalModules[i+1])+' →'):link(normalRoute(),'Forløbsoversigt →'));
 }
 if(focus){window.scrollTo({top:0,behavior:'instant'});const heading=document.querySelector('#subjectTitle');heading.tabIndex=-1;heading.focus({preventScroll:true});}
}
window.addEventListener('mathviewchange',event=>{if(event.detail.view==='normalDistribution')navigate(event.detail.focus);});
window.openNormalSection=id=>window.showMathView(normalRoute(id.replace('normal-module-','')));
if(parseNormalRoute(location.hash))navigate();
