import { createProportionalLesson } from './ode-proportional-lesson.js';
import { odeModules,odeGoals,odeLabel } from './ode-plan.js';
import { odeSteps,odeRoute,parseOdeRoute,stepsForOdeModule } from './ode-routes.js';
import { createOdeLesson } from './ode-lesson.js';
const root=document.querySelector('#odeLesson');
const link=(path,label,cls='text-button')=>`<a class="${cls}" href="#${path}">${label}</a>`;
root.innerHTML=`<div id="ode-overview"><section class="lesson-section"><h2>Fra ændringshastighed til løsningskurve</h2><p>Seks moduler og en særskilt B-repetition følger læseplanen fra 28. oktober til 3. november 2026. Modul 1 og 2 er åbne. De øvrige undervisningsgange og den afsluttende opsamling er planlagt.</p><p data-ode-overall role="status"></p><div class="module-roadmap">${odeModules.map(m=>`<article class="module-card ${['1','2'].includes(m.id)?'is-current':''}" id="ode-module-${m.id}"><div class="module-card-top"><span>${odeLabel(m)}</span><strong data-ode-status="${m.id}">${['1','2'].includes(m.id)?'Ikke begyndt':'Planlagt'}</strong></div><h3>${m.title}</h3><p>${m.summary}</p><p>${/^\d/.test(m.date)?m.date+' 2026':m.date}${m.pages?' · Bogside '+m.pages:''}</p>${link(odeRoute(m.id),['1','2'].includes(m.id)?'Begynd eller fortsæt modulet':'Se planen')}</article>`).join('')}</div></section><details class="ode-goal-map"><summary>Se hele læringsmålskortet</summary><p>U1–U7 er undervisningsbeskrivelsens faglige mål; K1–K6 er kernestoffet. A-mål præciserer kildearkene. B8–B9 hører til den særskilte repetition. Kontroller i senere moduler er planlagte.</p><div class="int-table" tabindex="0" role="region" aria-label="Læringsmålskort, rul vandret"><table><thead><tr><th>Læringsmål</th><th>Introduceres</th><th>Øves</th><th>Kontrolleres</th><th>Hjælpemidler</th></tr></thead><tbody>${odeGoals.map(g=>`<tr><th scope="row">${g[0]}</th>${g.slice(1).map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p>Undervisningsbeskrivelsen henviser til særskilte bevisfotokopier. De seks opgaveark indeholder ikke alle disse beviser. Modul 1 giver derfor egne korte begrundelser; senere bevisstof skal knyttes til tilgængelige kilder.</p></details></div>
 <div id="ode-session" hidden><nav class="ode-breadcrumb" aria-label="Tilbage til forløbet">${link(odeRoute(),'← Differentialligninger · forløbsoversigt')}</nav><p data-ode-location role="status"></p><nav class="ode-step-menu" aria-label="Trin i modul 1">${odeSteps.map(([id,title],i)=>link(odeRoute('1',id),`<span>${i+1}</span>${title}`)).join('')}</nav><div id="ode-module-one"></div><div id="ode-module-two"></div><section id="ode-planned" class="lesson-section" hidden></section><nav class="ode-page-controls" aria-label="Forrige og næste side"></nav></div>`;
const progress=new Map();
function updateProgress(id,status,count,total){
 progress.set(id,{status,count,total});
 root.querySelector(`[data-ode-status="${id}"]`).textContent=status;
 root.querySelector('[data-ode-overall]').textContent=[...progress].map(([id,p])=>`Modul ${id}: ${p.status.toLowerCase()} · ${p.count} af ${p.total} obligatoriske øvelser`).join(' · ');
 if(parseOdeRoute(window.location.hash)?.module===id)root.querySelector('[data-ode-location]').textContent=`Modul ${id} · ${status} · ${count} af ${total} obligatoriske øvelser`;
}
createOdeLesson(root.querySelector('#ode-module-one'),(...args)=>updateProgress('1',...args));
createProportionalLesson(root.querySelector('#ode-module-two'),(...args)=>updateProgress('2',...args));
function navigate(focus=false){
 const route=parseOdeRoute(window.location.hash);if(!route)return;
 if(route.path!==location.hash.slice(1))history.replaceState(null,'',`#${route.path}`);
 const overview=!route.module,one=route.module==='1',steps=stepsForOdeModule(route.module),implemented=steps.length>0;
 root.querySelector('#ode-overview').hidden=!overview;
 root.querySelector('#ode-session').hidden=overview;
 root.querySelector('#ode-module-one').hidden=!one;
 root.querySelector('#ode-module-two').hidden=route.module!=='2';
 root.querySelector('.ode-step-menu').hidden=!implemented;
 root.querySelector('.ode-step-menu').setAttribute('aria-label',`Trin i modul ${route.module}`);
 root.querySelector('.ode-step-menu').innerHTML=steps.map(([id,title],i)=>link(odeRoute(route.module,id),`<span>${i+1}</span>${title}`)).join('');
 root.querySelector('#ode-planned').hidden=overview||implemented;
 const subject=document.querySelector('[data-page="subject"]');
 subject.classList.toggle('is-integral-session',!overview);subject.classList.toggle('is-integral-overview',overview);
 const title=overview?'Differentialligninger':`${odeLabel(odeModules.find(m=>m.id===route.module))}: ${odeModules.find(m=>m.id===route.module).title}`;
 document.querySelector('#subjectTitle').textContent=title;
 document.querySelector('#subjectDescription').textContent=overview?'Forstå ændringshastighed, kontrollér løsninger og byg modeller ét modul ad gangen.':implemented?'Læs, regn og kontrollér ét trin ad gangen. Dine svar og hints gemmes på din konto.':'Planlagt undervisningsgang · teori, opgaver og kontroller er endnu ikke implementeret.';
 document.querySelector('#subjectFormula').hidden=!overview;
 document.title=`${title} · Christians matematik`;
 root.querySelectorAll('[data-ode-step]').forEach(panel=>panel.hidden=panel.dataset.odeStep!==route.step);
 root.querySelectorAll('.ode-step-menu a').forEach(a=>{if(a.hash===`#${route.path}`)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current');});
 const controls=root.querySelector('.ode-page-controls');
 if(implemented){
  const pages=steps.map(([id])=>odeRoute(route.module,id)),i=pages.indexOf(route.path);
  root.querySelector('[data-ode-location]').textContent=`Modul ${route.module} · ${progress.get(route.module).status} · Trin ${i+1} af ${pages.length}: ${steps[i][1]}`;
  controls.innerHTML=link(i?pages[i-1]:odeRoute(),i?'← Forrige trin':'← Forløbsoversigt')+link(i<pages.length-1?pages[i+1]:odeRoute(String(Number(route.module)+1)),i<pages.length-1?'Næste trin →':one?'Næste modul →':'Næste modul · planlagt →');
 }else if(!overview){
  const i=odeModules.findIndex(m=>m.id===route.module),m=odeModules[i];
  root.querySelector('[data-ode-location]').textContent=`${odeLabel(m)} · Planlagt`;
  root.querySelector('#ode-planned').innerHTML=`<h2>Plan for undervisningsgangen</h2><p><strong>Planlagt · ikke implementeret.</strong></p><p>${m.summary}</p><h3>Forudsætninger, der skal undersøges</h3><p>${m.prerequisites}</p><h3>Øvelser og kontrol, der skal udvikles</h3><p>${m.practice}</p><p>Der er endnu ingen opgaver eller personlige resultater på denne side.</p>${link(odeRoute(),'Tilbage til forløbsoversigten')}`;
  controls.innerHTML=link(odeRoute(odeModules[i-1].id),'← '+odeLabel(odeModules[i-1]))+(i<odeModules.length-1?link(odeRoute(odeModules[i+1].id),odeLabel(odeModules[i+1])+' →'):link(odeRoute(),'Forløbsoversigt →'));
 }
 if(focus){window.scrollTo({top:0,behavior:'instant'});const heading=document.querySelector('#subjectTitle');heading.tabIndex=-1;heading.focus({preventScroll:true});}
}
window.addEventListener('mathviewchange',event=>{if(event.detail.view==='differentialEquations')navigate(event.detail.focus);});
window.openOdeSection=id=>window.showMathView(odeRoute(id.replace('ode-module-','')));
if(parseOdeRoute(location.hash))navigate();
