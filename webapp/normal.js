import { normalModules,normalGoals,normalLabel } from './normal-plan.js';
import { normalRoute,parseNormalRoute,normalImplemented,stepsForNormalModule,pagesForNormalModule } from './normal-routes.js';
import { createNormalLesson } from './normal-lesson.js';
import { createStandardLesson } from './normal-standard-lesson.js';
import { createParameterLesson } from './normal-parameters-lesson.js';
import { createAlgebraLesson } from './normal-algebra-lesson.js';
import { createPlotLesson } from './normal-plot-lesson.js';
import { createRegressionLesson } from './normal-regression-lesson.js';
import { createNormalFinishLesson } from './normal-finish-lesson.js';
import { normalIntroContent,normalIntroForModule } from './normal-intro-content.js';
import { bindNormalIntro } from './normal-intro-figures.js';
const root=document.querySelector('#normalLesson');
const introModule={id:'intro',title:'Forstå normalfordeling og regression · helt fra begyndelsen'};
const link=(path,label,cls='text-button')=>`<a class="${cls}" href="#${path}">${label}</a>`;
const ready=id=>normalImplemented.includes(id);
const hostId=id=>({'intro':'normal-introduction','1':'normal-module-one','2':'normal-module-two','3':'normal-module-three','repetition':'normal-repetition','4':'normal-module-four','5':'normal-module-five','opsamling':'normal-course-finish'}[id]);
root.innerHTML=`<div id="normal-overview"><section class="lesson-section normal-intro-entry"><p class="normal-intro-kicker">Start her · forklaringen med ord</p><h2>Forstå idéerne før regningen</h2><p>En rolig gennemgang fra mælkekartoner og klokkeform til regression og konfidensintervaller. Følg samme rækkefølge som modulerne, med hverdagseksempler, figurer og formler forklaret i ord. Ingen regneopgaver.</p>${link(normalRoute('intro','start'),'Begynd den rolige introduktion','primary-button')}</section><section class="lesson-section"><h2>Fra målinger til sandsynligheder</h2><p>Fem moduler og en særskilt B-repetition følger læseplanen fra 4. til 9. november 2026. Modul 1–5 og B-repetition 10–11 er åbne. Den afsluttende opsamling er også åben.</p><p data-normal-overall role="status"></p><div class="module-roadmap">${normalModules.map(m=>`<article class="module-card ${ready(m.id)?'is-current':''}" id="normal-module-${m.id}"><div class="module-card-top"><span>${normalLabel(m)}</span><strong data-normal-status="${m.id}">${ready(m.id)?'Ikke begyndt':'Planlagt'}</strong></div><h3>${m.title}</h3><p>${m.summary}</p><p>${/^\d/.test(m.date)?m.date+' 2026':m.date}${m.pages?' · Bogside '+m.pages:''}</p>${link(normalRoute(m.id),ready(m.id)?'Begynd eller fortsæt '+normalLabel(m).toLowerCase():'Se planen')}</article>`).join('')}</div></section><details class="normal-goal-map"><summary>Se hele læringsmålskortet</summary><p>U1–U7 er undervisningsbeskrivelsens faglige mål; K1–K6 er kernestoffet. A-mål præciserer kildearkene. B10–B11 hører til den særskilte repetition. Binomialfordeling og kombinatorik øves i B8–9 i differentialligningsforløbet. Opsamlingen samler metodevalg, fortolkning og målrettet repetition.</p><div class="int-table" tabindex="0" role="region" aria-label="Læringsmålskort, rul vandret"><table><thead><tr><th>Læringsmål</th><th>Introduceres</th><th>Øves</th><th>Kontrolleres</th><th>Hjælpemidler</th><th>Datasæt eller eksempel</th></tr></thead><tbody>${normalGoals.map(g=>`<tr><th scope="row">${g[0]}</th>${g.slice(1).map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p>Undervisningsbeskrivelsen henviser til særskilte bevisfotokopier. De fem opgaveark indeholder ikke alle disse beviser. Appens korte forklaringer er ikke en gengivelse af de separate beviser.</p></details></div>
 <div id="normal-session" hidden><nav class="normal-breadcrumb" aria-label="Tilbage til forløbet">${link(normalRoute(),'← Normalfordeling · forløbsoversigt')}</nav><p data-normal-location role="status"></p><p data-normal-intro-return hidden><a>Læs den rolige forklaring til dette modul</a></p><nav class="normal-step-menu" aria-label="Trin i undervisningsgangen"></nav><div id="normal-introduction" hidden>${normalIntroContent()}</div>${normalImplemented.map(id=>`<div id="${hostId(id)}" hidden></div>`).join('')}<section id="normal-planned" class="lesson-section" hidden></section><nav class="normal-page-controls" aria-label="Forrige og næste side"></nav></div>`;
bindNormalIntro(root.querySelector('#normal-introduction'));
const progress=new Map(normalImplemented.map(id=>[id,{status:'Ikke begyndt',count:0,total:0}]));
function showStatus(){
 for(const [id,p] of progress)root.querySelector(`[data-normal-status="${id}"]`).textContent=p.status;
 const completed=[...progress].filter(([id,p])=>id!=='opsamling'&&p.status==='Gennemført').length;
 root.querySelector('[data-normal-overall]').textContent=`Samlet: ${completed} af 6 undervisningsgange gennemført. ${[...progress].map(([id,p])=>`${normalLabel(normalModules.find(m=>m.id===id))}: ${p.status.toLowerCase()}, ${p.count} af ${p.total} ${id==='repetition'?'spor':'obligatoriske øvelser'}`).join(' · ')}. Opsamlingen har sin egen status.`;
 const route=parseNormalRoute(location.hash),p=progress.get(route?.module);
 if(p){const steps=stepsForNormalModule(route.module),i=steps.findIndex(s=>s[0]===route.step);root.querySelector('[data-normal-location]').textContent=`${normalLabel(normalModules.find(m=>m.id===route.module))} · ${p.status} · ${p.count} af ${p.total} ${route.module==='repetition'?'spor':'øvelser'} · Trin ${i+1} af ${steps.length}: ${steps[i]?.[1]||''}`;}
 else if(route?.module==='intro'){const steps=stepsForNormalModule('intro'),i=steps.findIndex(s=>s[0]===route.step);root.querySelector('[data-normal-location]').textContent=`Introduktion · Afsnit ${i+1} af ${steps.length}: ${steps[i][1]}`;}
}
for(const [id,create] of [['1',createNormalLesson],['2',createStandardLesson],['3',createParameterLesson],['repetition',createAlgebraLesson],['4',createPlotLesson],['5',createRegressionLesson],['opsamling',createNormalFinishLesson]])create(root.querySelector('#'+hostId(id)),(status,count,total)=>{progress.set(id,{status,count,total});showStatus();});
let renderedNormalPath=null;
function navigate(focus=false){
 const route=parseNormalRoute(location.hash);if(!route)return;
 const routeChanged=route.path!==renderedNormalPath;renderedNormalPath=route.path;
 if(route.path!==location.hash.slice(1))history.replaceState(null,'',`#${route.path}`);
 const overview=!route.module,isIntro=route.module==='intro',implemented=isIntro||ready(route.module);
 root.querySelector('#normal-overview').hidden=!overview;root.querySelector('#normal-session').hidden=overview;
 for(const id of ['intro',...normalImplemented])root.querySelector('#'+hostId(id)).hidden=id!==route.module;
 root.querySelector('.normal-step-menu').hidden=isIntro||!implemented;
 const introReturn=root.querySelector('[data-normal-intro-return]');introReturn.hidden=overview||isIntro||!implemented;
 if(!introReturn.hidden)introReturn.querySelector('a').href='#'+normalRoute('intro',normalIntroForModule[route.module]);
 root.querySelector('#normal-planned').hidden=overview||implemented;
 const subject=document.querySelector('[data-page="subject"]');subject.classList.toggle('is-integral-session',!overview);subject.classList.toggle('is-integral-overview',overview);
 const module=isIntro?introModule:normalModules.find(m=>m.id===route.module),title=overview?'Normalfordeling':isIntro?introModule.title:`${normalLabel(module)}: ${module.title}`;
 document.querySelector('#subjectTitle').textContent=title;
 document.querySelector('#subjectDescription').textContent=overview?'Forstå variation, kurver og sandsynligheder ét trin ad gangen.':isIntro?'Idéerne med ord, hverdagseksempler og figurer. Læs ét afsnit ad gangen, uden regneopgaver.':implemented?'Læs, regn og kontrollér ét trin ad gangen. Dine svar og hints gemmes på din konto.':'Planlagt undervisningsgang · teori, opgaver og kontroller er endnu ikke implementeret.';
 document.querySelector('#subjectFormula').hidden=!overview;document.title=`${title} · Christians matematik`;
 const controls=root.querySelector('.normal-page-controls');
 if(implemented){
  const host=root.querySelector('#'+hostId(route.module)),steps=stepsForNormalModule(route.module),pages=pagesForNormalModule(route.module),i=pages.indexOf(route.path);
  host.querySelectorAll('[data-normal-step]').forEach(panel=>panel.hidden=panel.dataset.normalStep!==route.step);
  root.querySelector('.normal-step-menu').innerHTML=isIntro?'':steps.map(([id,title],index)=>link(normalRoute(route.module,id),`<span>${index+1}</span>${title}`)).join('');
  root.querySelector('.normal-step-menu').setAttribute('aria-label',isIntro?'Trin i introduktionen':'Trin i '+normalLabel(module).toLowerCase());
  root.querySelectorAll('.normal-step-menu a').forEach(a=>{if(a.hash===`#${route.path}`)a.setAttribute('aria-current','step');});
  if(isIntro){host.querySelectorAll('[data-intro-link]').forEach(a=>{if(a.hash===`#${route.path}`)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current');});if(routeChanged)host.querySelector('.normal-intro-outline').open=false;}
  const moduleIndex=normalModules.indexOf(module),previous=normalModules[moduleIndex-1],next=normalModules[moduleIndex+1];
  const previousPath=i?pages[i-1]:previous?pagesForNormalModule(previous.id).at(-1)||normalRoute(previous.id):route.module==='1'?normalRoute('intro','overblik'):normalRoute();
  const nextPath=i<pages.length-1?pages[i+1]:isIntro?normalRoute('1','start'):ready(next?.id)?pagesForNormalModule(next.id)[0]:normalRoute(next?.id||'');
  const previousLabel=i?(isIntro?'← Forrige afsnit':'← Forrige trin'):previous?(previous.id==='repetition'?'← Forrige undervisningsgang':'← Forrige modul'):route.module==='1'?'← Introduktion':'← Forløbsoversigt';
  const nextLabel=i<pages.length-1?(isIntro?'Næste afsnit →':'Næste trin →'):isIntro?'Begynd Modul 1 →':!next?'Forløbsoversigt →':next.id==='opsamling'?'Opsamling →':ready(next?.id)?(next.id==='repetition'?'Næste undervisningsgang →':'Næste modul →'):'Næste modul · planlagt →';
  controls.innerHTML=link(previousPath,previousLabel)+link(nextPath,nextLabel);
  showStatus();
 }else if(!overview){
  const i=normalModules.indexOf(module);
  root.querySelector('[data-normal-location]').textContent=`${normalLabel(module)} · Planlagt`;
  root.querySelector('#normal-planned').innerHTML=`<h2>Plan for undervisningsgangen</h2><p><strong>Planlagt · ikke implementeret.</strong></p><p>${module.summary}</p><h3>Forudsætninger, der skal undersøges</h3><p>${module.prerequisites}</p><h3>Øvelser og kontrol, der skal udvikles</h3><p>${module.practice}</p><p>Der er endnu ingen opgaver eller personlige resultater på denne side.</p>${link(normalRoute(),'Tilbage til forløbsoversigten')}`;
  controls.innerHTML=link(pagesForNormalModule(normalModules[i-1].id).at(-1)||normalRoute(normalModules[i-1].id),'← '+normalLabel(normalModules[i-1]))+(i<normalModules.length-1?link(normalRoute(normalModules[i+1].id),normalLabel(normalModules[i+1])+' →'):link(normalRoute(),'Forløbsoversigt →'));
 }
 if(focus&&routeChanged){window.scrollTo({top:0,behavior:'instant'});const heading=document.querySelector('#subjectTitle');heading.tabIndex=-1;heading.focus({preventScroll:true});}
}
window.addEventListener('mathviewchange',event=>{if(event.detail.view==='normalDistribution')navigate(event.detail.focus);else renderedNormalPath=null;});
window.openNormalSection=id=>window.showMathView(normalRoute(id.replace('normal-module-','')));
if(parseNormalRoute(location.hash))navigate();
