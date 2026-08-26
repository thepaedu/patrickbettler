import{p as s,M as l}from"./frontmatter-BEPeEzVZ.js";const c=`---\r
title: Geschafft – Ausbildung zum Informatiker EFZ abgeschlossen\r
date: 2026-08-11\r
excerpt: Nach vier Jahren Ausbildung zum Informatiker Applikationsentwicklung EFZ und bestandener Berufsmaturität ein Rückblick und Dank an alle, die mich begleitet haben.\r
cover: /images/patrick-bettler-informatiker-abschlussfeier.jpg\r
tags: Ausbildung\r
---\r
\r
Nach vier intensiven und lehrreichen Jahren habe ich meine\r
Ausbildung zum Informatiker Applikationsentwicklung EFZ erfolgreich\r
abgeschlossen und gleichzeitig auch die Berufsmaturität bestanden.\r
\r
Ein besonderer Dank gilt meinem Berufsbildner **Steven Utiger**, der mich\r
über die gesamte Ausbildungszeit begleitet und unterstützt hat. Ebenso\r
möchte ich mich herzlich bei meinem Vorgesetzten **Severin Gabriel** für\r
das Vertrauen und die Förderung bedanken. Ein grosses Dankeschön geht auch\r
an **Michael Zihlmann**, der mich als Fachexperte bei meiner IPA begleitet\r
hat.\r
\r
Danke auch an die **BK Solution AG**, bei der ich nicht nur viel\r
fachliches Wissen sammeln durfte, sondern auch persönlich wachsen konnte.\r
\r
Ich freue mich auf alles, was nun vor mir liegt.\r
`,u=`---\r
title: Willkommen auf meiner neuen Webseite\r
date: 2026-01-10\r
excerpt: Ein kurzer Einblick, warum ich diese Seite gebaut habe und was hier künftig zu finden sein wird.\r
tags: Vorstellung, Vue, Web\r
---\r
\r
Schön, dass du hier bist! Auf dieser Seite werde ich künftig über Projekte,\r
Tools und Dinge schreiben, die mich als Informatiker beschäftigen.\r
\r
## Was dich erwartet\r
\r
- Einblicke in eigene Software-Projekte\r
- Kurze technische Notizen und Learnings\r
- Ein paar Bilder aus meinem Alltag\r
\r
Ich freue mich, wenn du regelmäßig vorbeischaust.\r
`,o=new l({html:!1,linkify:!0,typographer:!0}),h=Object.assign({"../content/blog/ausbildung-abgeschlossen.md":c,"../content/blog/willkommen.md":u});function d(){return Object.entries(h).map(([n,r])=>{const t=n.split("/").pop().replace(/\.md$/,""),{data:e,content:i}=s(r);return{slug:t,title:e.title||t,date:e.date||"",excerpt:e.excerpt||"",cover:e.cover||"",tags:e.tags?e.tags.split(",").map(a=>a.trim()):[],html:o.render(i)}}).sort((n,r)=>new Date(r.date)-new Date(n.date))}const g=d();function b(n){return g.find(r=>r.slug===n)}export{b as g,g as p};
