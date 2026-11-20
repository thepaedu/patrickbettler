import{n as e,t}from"./BGqkB4GH.js";var n=`---\r
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
`,r=`---\r
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
`,i=new e({html:!1,linkify:!0,typographer:!0}),a=Object.assign({"../../content/projects/internet-calendar.md":n,"../../content/projects/qa-dashboard.md":r});function o(){return Object.entries(a).map(([e,n])=>{let r=e.split(`/`).pop().replace(/\.md$/,``),{data:a,content:o}=t(n);return{slug:r,title:a.title||r,description:a.description||``,cover:a.cover||``,projectLogo:a.projectLogo||``,company:a.company||``,companyLogo:a.companyLogo||``,demoUrl:a.demoUrl||``,repoUrl:a.repoUrl||``,date:a.date||``,tags:a.tags?a.tags.split(`,`).map(e=>e.trim()):[],html:i.render(o)}}).sort((e,t)=>!e.date&&!t.date?0:e.date?t.date?new Date(t.date)-new Date(e.date):-1:1)}var s=o();function c(e){return s.find(t=>t.slug===e)}export{s as n,c as t};