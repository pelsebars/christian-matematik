import { normalModules,normalGoals,normalLabel } from './normal-plan.js';
import { normalSteps,normalRoute,parseNormalRoute,normalPages } from './normal-routes.js';
import { createNormalLesson } from './normal-lesson.js';
const root=document.querySelector('#normalLesson');
const link=(path,label,cls='text-button')=>`<a class="${cls}" href="#${path}">${label}</a>`;
root.innerHTML=`<div id="normal-overview"><section class="lesson-section"><h2>Fra målinger til sandsynligheder</h2><p>Fem moduler og en særskilt B-repetition følger læseplanen fra 4. til 9. november 2026. Modul 1 er åbent. De øvrige undervisningsgange og den afsluttende opsamling er planlagt.</p><p data-normal-overall role="status"></p><div class="module-roadmap">${normalModules.map(m=>`<article class="module-card ${m.id==='1'?'is-current':''}" id="normal-module-${m.id}"><div class="module-card-top"><span>${normalLabel(m)}</span><strong data-normal-status="${m.id}">${m.id==='1'?'Ikke begyndt':'Planlagt'}</strong></div><h3>${m.title}</h3><p>${m.summary}</p><p>${/^\d/.test(m.date)?m.date+' 2026':m.date}${m.pages?' · Bogside '+m.pages:''}</p>${link(normalRoute(m.id),m.id==='1'?'Begynd eller fortsæt modul 1':'Se planen')}</article>`).join('')}</div></section><details class="normal-goal-map"><summary>Se hele læringsmålskortet</summary><p>U1–U7 er undervisningsbeskrivelsens faglige mål; K1–K6 er kernestoffet. A-mål præciserer kildearkene. B10–B11 hører til den særskilte repetition. Binomialfordeling og kombinatorik er endnu ikke tilstrækkeligt dækket i appen; B8–9 er planlagt i det tidligere forløb. Kontroller i senere moduler er planlagte.</p><div class="int-table" tabindex="0" role="region" aria-label="Læringsmålskort, rul vandret"><table><thead><tr><th>Læringsmål</th><th>Introduceres</th><th>Øves</th><th>Kontrolleres</th><th>Hjælpemidler</th><th>Datasæt eller eksempel</th></tr></thead><tbody>${normalGoals.map(g=>`<tr><th scope="row">${g[0]}</th>${g.slice(1).map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p>Undervisningsbeskrivelsen henviser til særskilte bevisfotokopier. De fem opgaveark indeholder ikke alle disse beviser. Modul 1 giver derfor egne korte begrundelser; senere bevisstof skal knyttes til tilgængelige kilder.</p></details></div>
 <div id="normal-session" hidden><nav class="normal-breadcrumb" aria-label="Tilbage til forløbet">${link(normalRoute(),'← Normalfordeling · forløbsoversigt')}</nav><p data-normal-location role="status"></p><nav class="normal-step-menu" aria-label="Trin i modul 1">${normalSteps.map(([id,title],i)=>link(normalRoute('1',id),`<span>${i+1}</span>${title}`)).join('')}</nav><div id="normal-module-one"></div><section id="normal-planned" class="lesson-section" hidden></section><nav class="normal-page-controls" aria-label="Forrige og næste side"></nav></div>`;
let moduleStatus='Ikke begyndt',countProgress=0,totalProgress=27;
createNormalLesson(root.querySelector('#normal-module-one'),(status,count,total)=>{
 moduleStatus=status;countProgress=count;totalProgress=total;
 root.querySelector('[data-normal-status="1"]').textContent=status;
 root.querySelector('[data-normal-overall]').textContent=`Modul 1: ${status.toLowerCase()} · ${count} af ${total} obligatoriske øvelser. Samlet: ${status==='Gennemført'?1:0} af 6 undervisningsgange gennemført. De fem øvrige er planlagt; opsamlingen kommer derefter.`;
 const location=root.querySelector('[data-normal-location]');
 if(parseNormalRoute(window.location.hash)?.module==='1')location.textContent=`Modul 1 · ${moduleStatus} · ${count} af ${total} obligatoriske øvelser`;
});
function navigate(focus=false){
 const route=parseNormalRoute(window.location.hash);if(!route)return;
 if(route.path!==location.hash.slice(1))history.replaceState(null,'',`#${route.path}`);
 const overview=!route.module,one=route.module==='1';
 root.querySelector('#normal-overview').hidden=!overview;
 root.querySelector('#normal-session').hidden=overview;
 root.querySelector('#normal-module-one').hidden=!one;
 root.querySelector('.normal-step-menu').hidden=!one;
 root.querySelector('#normal-planned').hidden=overview||one;
 const subject=document.querySelector('[data-page="subject"]');
 subject.classList.toggle('is-integral-session',!overview);subject.classList.toggle('is-integral-overview',overview);
 const title=overview?'Normalfordeling':`${normalLabel(normalModules.find(m=>m.id===route.module))}: ${normalModules.find(m=>m.id===route.module).title}`;
 document.querySelector('#subjectTitle').textContent=title;
 document.querySelector('#subjectDescription').textContent=overview?'Forstå variation, kurver og sandsynligheder ét trin ad gangen.':one?'Læs, regn og kontrollér ét trin ad gangen. Dine svar og hints gemmes på din konto.':'Planlagt undervisningsgang · teori, opgaver og kontroller er endnu ikke implementeret.';
 document.querySelector('#subjectFormula').hidden=!overview;
 document.title=`${title} · Christians matematik`;
 root.querySelectorAll('[data-normal-step]').forEach(panel=>panel.hidden=panel.dataset.normalStep!==route.step);
 root.querySelectorAll('.normal-step-menu a').forEach(a=>{if(a.hash===`#${route.path}`)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current');});
 const controls=root.querySelector('.normal-page-controls');
 if(one){
  const i=normalPages.indexOf(route.path);
  root.querySelector('[data-normal-location]').textContent=`Modul 1 · ${moduleStatus} · ${countProgress} af ${totalProgress} øvelser · Trin ${i+1} af ${normalPages.length}: ${normalSteps[i][1]}`;
  controls.innerHTML=link(i?normalPages[i-1]:normalRoute(),i?'← Forrige trin':'← Forløbsoversigt')+link(i<normalPages.length-1?normalPages[i+1]:normalRoute('2'),i<normalPages.length-1?'Næste trin →':'Næste modul · planlagt →');
 }else if(!overview){
  const i=normalModules.findIndex(m=>m.id===route.module),m=normalModules[i];
  root.querySelector('[data-normal-location]').textContent=`${normalLabel(m)} · Planlagt`;
  root.querySelector('#normal-planned').innerHTML=`<h2>Plan for undervisningsgangen</h2><p><strong>Planlagt · ikke implementeret.</strong></p><p>${m.summary}</p><h3>Forudsætninger, der skal undersøges</h3><p>${m.prerequisites}</p><h3>Øvelser og kontrol, der skal udvikles</h3><p>${m.practice}</p><p>Der er endnu ingen opgaver eller personlige resultater på denne side.</p>${link(normalRoute(),'Tilbage til forløbsoversigten')}`;
  controls.innerHTML=link(normalRoute(normalModules[i-1].id),'← '+normalLabel(normalModules[i-1]))+(i<normalModules.length-1?link(normalRoute(normalModules[i+1].id),normalLabel(normalModules[i+1])+' →'):link(normalRoute(),'Forløbsoversigt →'));
 }
 if(focus){window.scrollTo({top:0,behavior:'instant'});const heading=document.querySelector('#subjectTitle');heading.tabIndex=-1;heading.focus({preventScroll:true});}
}
window.addEventListener('mathviewchange',event=>{if(event.detail.view==='normalDistribution')navigate(event.detail.focus);});
window.openNormalSection=id=>window.showMathView(normalRoute(id.replace('normal-module-','')));
if(parseNormalRoute(location.hash))navigate();
