# Trigonometriske funktioner

Implementeret i `trig-*` og `tasks/bank/trigonometry.js` med emne-id `trigonometry`.

## Kilder og modulstruktur

Pensum/6. Trigonometriske funktioner:
- `1. Cosinus og sinus. Harmoniske svingninger.docx`: modul 1, enhedscirkel og radianer, parametre og grafer, differentiation, modelberegning og integral/rumfang.
- `2. Trigonometriske ligninger.docx`: modul 2, grader/radianer, begge løsningsgrene, perioder og intervalfiltrering, modeller og varighed.

Hvert modul har starttjek, teori, interaktiv graf med tabelalternativ, øvelser, modeller/CAS-noter og sluttjek. 28 opgaver (15 + 13) deles mellem modulerne og opgavebanken. Det er et udvalg med supplerende begrebsopgaver, ikke en digitalisering af alle kildearkenes opgaver. Der er separate felter for alle efterspurgte rødder; åbne forklaringer og CAS-noter vurderes ikke automatisk.

## Faglige rettelser

- Ark 1, opgave 8 indeholder en kvadratrod i Word-formlen: f(x)=sin(x)√cos(x). Formelstrukturen er kontrolleret i dokumentets XML; ren tekstudtrækning taber kvadratroden. Areal 2/3 og rumfang π/3 verificeres ved uafhængig numerisk integration.
- Ark 2, fjederopgave: højden måles i cm, ikke meter som i facitlisten. Varighed over 100 cm i [0;1,5] er cirka 0,592 sekunder.
- Amplitude er |A|; faseforskydning er −φ/ω. Konstant funktion har ingen mindste positive periode. Gentagne tangentialrødder tælles kun én gang; forskellige inkluderede endepunkter bevares.

## Konto, point og navigation

Svar og hints: `christian-matematik.trigonometry.1.v1` og `.2.v1`. CAS-noter har separate namespaces. Eksisterende kontolagring, pointtildeling og bankbelønninger genbruges. Ingen migration, nulstilling eller historisk genberegning.

Butikken viser optjente point og antal forskellige løste opgaver under trigonometri samt aktuel modulstatus. Redigerede svar kræver ny kontrol for at tælle i status; historiske point og gennemførelser bevares. Links findes i sidemenu, forside, personligt overblik og opgavevejleder.

## Validering

`npm run test:trigonometry`: faglige tests, build og browsertest med isoleret lokal testdatabase. Browsertesten løser alle 28 opgaver, kontrollerer genåbning på en anden klient, tilbagekaldelse af aktiv status, bevarede point, brugeradskillelse, navigation, tastaturbetjent graf og mobillayout.
