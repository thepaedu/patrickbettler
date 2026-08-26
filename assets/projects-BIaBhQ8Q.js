import{p as s,M as i}from"./frontmatter-BEPeEzVZ.js";const d=`---\r
title: Pfändungsvollzugs-Termine Internet-Kalender \r
description: Abonnierbarer Internet-Kalender für Pfändungsvollzugs-Termine\r
 \r
cover: /images/platzhalter.jpg\r
\r
company: BK Solution AG\r
companyLogo: /images/logos/bk-solution-ag-logo.jpg\r
\r
date: 2026-01-15\r
tags: Vue.js, C#\r
---\r
\r
## Worum geht es\r
\r
In der bestehenden eVollzug App für den Anwender die Möglichkeit geben, dass er über die \r
Internetkalender abonnieren Funktion alle seine Pfändungstermine automatisiert im iCalendar\r
Format (.ics) exportieren und in gängige Kalenderanwendungen (z. B. Outlook, Google Kalender) \r
öffnen kann. \r
\r
## Tech-Stack\r
\r
- Vue 3\r
- Node.js\r
- ...\r
\r
## Herausforderungen\r
\r
Beschreibe hier kurz, was technisch spannend oder schwierig war.\r
`,l=`---\r
title: QA Dashboard\r
description: Dashbord zur Überwachung der Detektoren-Qualitätssicherung\r
 \r
cover: /images/platzhalter.jpg\r
\r
projectLogo: /images/logos/qa-dashboard-logo.png\r
\r
company: Bundesamt für Gesundheit Sektion Umwelt Radioaktivität\r
companyLogo: /images/logos/bundesamt-fuer-gesundheit-logo.jpg\r
\r
date: 2026-01-15\r
tags: Vue.js, Python FastAPI, Visual Basic Makro\r
---\r
\r
## Worum geht es\r
\r
Für die Qualitätssicherung von Germanium-Detektoren zur Messung von Gammastrahlung habe ich ein webbasiertes QA Dashboard entwickelt. Ein eigens entwickeltes Makro überträgt die Messdaten aus der Software InterWinner automatisch an eine Python FastAPI-Schnittstelle. Das von mir entwickelte UI visualisiert diese Daten übersichtlich in Grafiken und ermöglicht dadurch eine schnelle und intuitive Beurteilung der Messqualität sowie das Erkennen von Abweichungen.\r
\r
## Tech-Stack\r
\r
- Vue 3\r
- Node.js\r
- ...\r
\r
## Herausforderungen\r
\r
Beschreibe hier kurz, was technisch spannend oder schwierig war.\r
`,c=new i({html:!1,linkify:!0,typographer:!0}),g=Object.assign({"../content/projects/internet-calendar.md":d,"../content/projects/qa-dashboard.md":l});function u(){return Object.entries(g).map(([n,r])=>{const t=n.split("/").pop().replace(/\.md$/,""),{data:e,content:o}=s(r);return{slug:t,title:e.title||t,description:e.description||"",cover:e.cover||"",projectLogo:e.projectLogo||"",company:e.company||"",companyLogo:e.companyLogo||"",demoUrl:e.demoUrl||"",repoUrl:e.repoUrl||"",date:e.date||"",tags:e.tags?e.tags.split(",").map(a=>a.trim()):[],html:c.render(o)}}).sort((n,r)=>!n.date&&!r.date?0:n.date?r.date?new Date(r.date)-new Date(n.date):-1:1)}const m=u();function h(n){return m.find(r=>r.slug===n)}export{h as g,m as p};
