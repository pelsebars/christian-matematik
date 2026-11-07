import {renderExercises} from './integral-exercises.js';
import {twoTasks} from './tasks/bank/twoVariables.js';
import {theory as one} from './two-module1.js';
const theories={'1':one};
export function twoContent(module){
 const tasks=twoTasks.filter(t=>t.module===`two.${module}`),exercises=step=>renderExercises(tasks.filter(t=>t.step===step));
 return `<p data-lesson-warning class="int-warning" role="alert" hidden></p>
 <section class="lesson-section" data-two-step="start"><h2>Start med dit grundlag</h2><p>Prøv selv først. Brug teori og hints ved behov. Et besøg eller et vist facit tæller ikke som et korrekt svar.</p>${exercises('start')}</section>
 <section class="lesson-section" data-two-step="teori">${theories[module]}</section>
 <section class="lesson-section" data-two-step="udforsk"><h2>Undersøg sammenhængen</h2><p>Flyt én skyder ad gangen, og forklar ændringen. Grafen har en tabel som tekstalternativ. Denne undersøgelse giver ikke point i sig selv.</p><div data-two-lab></div></section>
 <section class="lesson-section" data-two-step="oevelser"><h2>Træn metoden</h2><p>Skriv tal med komma eller punktum. Vis mellemregninger på papir, og sammenlign med den gennemregnede løsning.</p>${exercises('oevelser')}</section>
 <section class="lesson-section" data-two-step="modeller"><h2>Modeller, enheder og CAS</h2><p>Angiv forskrift, domæne, enheder og dine CAS-kommandoer. Gem output, og kontrollér ved indsættelse. Skeln mellem lokal og global konklusion. Noterne er til din egen dokumentation og vurderes ikke automatisk.</p><label for="two-notes-${module}">Mine beregninger og CAS-noter</label><textarea id="two-notes-${module}" rows="5"></textarea>${exercises('modeller')}</section>
 <section class="lesson-section" data-two-step="slut"><h2>Sluttjek</h2><p>Prøv uden hints, og vend tilbage til de trin, du vil træne mere.</p>${exercises('slut')}<p data-two-summary role="status"></p><a class="text-button" href="#tasks">Fortsæt i opgavebanken →</a></section>`;
}
