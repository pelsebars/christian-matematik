import { accountStorage } from './account/store.js';
export const normalSection=(title,body)=>`<section class="lesson-section"><h2>${title}</h2>${body}</section>`;
export const normalExample=(title,body)=>`<article class="example-card"><h3>${title}</h3>${body}</article>`;
export const normalImportant=text=>`<aside class="normal-important"><h3>Det vigtigste at forstå</h3><p>${text}</p></aside>`;
export function bindNormalNotes(host,id,key){
 const notes=host.querySelector('#'+id),warning=host.querySelector('[data-lesson-warning]');
 const warn=()=>{warning.hidden=false;warning.textContent='Værktøjsnoterne kunne ikke gemmes. Hold siden åben for at bevare dem.';};
 try{const saved=JSON.parse(accountStorage.getItem(key)||'{}');notes.value=typeof saved.text==='string'?saved.text:'';}catch{warn();}
 notes.addEventListener('input',()=>{try{accountStorage.setItem(key,JSON.stringify({text:notes.value}));}catch{warn();}});
}
