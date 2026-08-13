import{p as a,M as i}from"./frontmatter-BEPeEzVZ.js";const c=`---
title: Projekt-Name
description: Kurze Beschreibung, was das Projekt macht, für wen es gedacht ist und welches Problem es löst.
cover: /images/projekt-name.jpg
demoUrl: https://example.com
repoUrl: https://github.com/thepaedu/projekt-name
date: 2026-01-15
tags: Vue, Node.js
---

## Worum geht es

Hier beschreibst du im Detail, wie das Projekt entstanden ist, welches
Problem es löst und für wen es gedacht ist.

## Tech-Stack

- Vue 3
- Node.js
- ...

## Herausforderungen

Beschreibe hier kurz, was technisch spannend oder schwierig war.
`,d=`---
title: Weiteres Tool
description: Beschreibung des zweiten Projekts. Ersetze diese Platzhalter durch deine eigenen Apps und Tools.
demoUrl: ""
repoUrl: ""
date: 2026-02-20
tags: Python, CLI
---

## Worum geht es

Beschreibung, was dieses Tool macht.

## Tech-Stack

- Python
- ...
`,l=new i({html:!1,linkify:!0,typographer:!0}),p=Object.assign({"../content/projects/projekt-name.md":c,"../content/projects/weiteres-tool.md":d});function m(){return Object.entries(p).map(([t,n])=>{const r=t.split("/").pop().replace(/\.md$/,""),{data:e,content:s}=a(n);return{slug:r,title:e.title||r,description:e.description||"",cover:e.cover||"",demoUrl:e.demoUrl||"",repoUrl:e.repoUrl||"",date:e.date||"",tags:e.tags?e.tags.split(",").map(o=>o.trim()):[],html:l.render(s)}}).sort((t,n)=>!t.date&&!n.date?0:t.date?n.date?new Date(n.date)-new Date(t.date):-1:1)}const u=m();function g(t){return u.find(n=>n.slug===t)}export{g,u as p};
