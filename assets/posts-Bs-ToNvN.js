import{p as s,M as l}from"./frontmatter-BEPeEzVZ.js";const c=`---
title: Geschafft – Ausbildung zum Informatiker EFZ abgeschlossen
date: 2026-08-11
excerpt: Nach vier Jahren Ausbildung zum Informatiker Applikationsentwicklung EFZ und bestandener Berufsmaturität ein Rückblick und Dank an alle, die mich begleitet haben.
cover: /images/patrick-bettler-informatiker-abschlussfeier.jpg
tags: Ausbildung, Meilenstein
---

Nach vier intensiven und lehrreichen Jahren habe ich meine
Ausbildung zum Informatiker Applikationsentwicklung EFZ erfolgreich
abgeschlossen und gleichzeitig auch die Berufsmaturität bestanden.

Ein besonderer Dank gilt meinem Berufsbildner **Steven Utiger**, der mich
über die gesamte Ausbildungszeit begleitet und unterstützt hat. Ebenso
möchte ich mich herzlich bei meinem Vorgesetzten **Severin Gabriel** für
das Vertrauen und die Förderung bedanken. Ein grosses Dankeschön geht auch
an **Michael Zihlmann**, der mich als Fachexperte bei meiner IPA begleitet
hat.

Danke auch an die **BK Solution AG**, bei der ich nicht nur viel
fachliches Wissen sammeln durfte, sondern auch persönlich wachsen konnte.

Ich freue mich auf alles, was nun vor mir liegt.
`,u=`---
title: Willkommen auf meiner neuen Webseite
date: 2026-01-10
excerpt: Ein kurzer Einblick, warum ich diese Seite gebaut habe und was hier künftig zu finden sein wird.
tags: Vorstellung, Vue, Web
---

Schön, dass du hier bist! Auf dieser Seite werde ich künftig über Projekte,
Tools und Dinge schreiben, die mich als Informatiker beschäftigen.

## Was dich erwartet

- Einblicke in eigene Software-Projekte
- Kurze technische Notizen und Learnings
- Ein paar Bilder aus meinem Alltag

Ich freue mich, wenn du regelmäßig vorbeischaust.
`,o=new l({html:!1,linkify:!0,typographer:!0}),h=Object.assign({"../content/blog/ausbildung-abgeschlossen.md":c,"../content/blog/willkommen.md":u});function d(){return Object.entries(h).map(([n,t])=>{const i=n.split("/").pop().replace(/\.md$/,""),{data:e,content:r}=s(t);return{slug:i,title:e.title||i,date:e.date||"",excerpt:e.excerpt||"",cover:e.cover||"",tags:e.tags?e.tags.split(",").map(a=>a.trim()):[],html:o.render(r)}}).sort((n,t)=>new Date(t.date)-new Date(n.date))}const g=d();function b(n){return g.find(t=>t.slug===n)}export{b as g,g as p};
