# Matematik: udgivelse og databevaring

- Produktionsappen er https://christian-matematik-webapp.vercel.app. Vercel bygger `webapp` fra Git-branch `main`.
- Railway-projektet `22f5b364-56f7-4134-ad89-699aecc5d142` bruges til PostgreSQL. Postgres-servicen og dens volumen indeholder konti, besvarelser, point og køb; bevar dem.
- Railway-appservicen `christian-matematik` er frakoblet Git med vilje. Tilslut den ikke igen for at rette en gammel buildfejl.
- Før en udgivelse: gennemgå hele `git status`, også nye filer. Udgiv ikke en delvis Git-version, hvis den aktive app afhænger af lokale, ikke-committede filer. Bevar andre igangværende ændringer og afklar afhængigheder.
- Brug Git som kilde til produktion. Direkte CLI-deploy af ikke-committede funktioner må ikke efterlade produktionen foran Git.
- Kør relevante tests og build. Efter push: kontrollér Vercel-resultatet samt de berørte filer/funktioner på produktionsadressen. Railways historiske fejlede app-build er ikke Vercels status.
- Nulstil aldrig databasen eller genberegn/slet point og køb som en del af frontendgendannelse.
