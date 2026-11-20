import{n as e,t}from"./BGqkB4GH.js";function n(e){return e?new Date(e).toLocaleDateString(`de-CH`,{year:`numeric`,month:`long`,day:`numeric`,timeZone:`UTC`}):``}var r=`---\r
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
`,i=`---\r
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
`,a=new e({html:!1,linkify:!0,typographer:!0}),o=Object.assign({"../../content/blog/ausbildung-abgeschlossen.md":r,"../../content/blog/willkommen.md":i});function s(){return Object.entries(o).map(([e,n])=>{let r=e.split(`/`).pop().replace(/\.md$/,``),{data:i,content:o}=t(n);return{slug:r,title:i.title||r,date:i.date||``,excerpt:i.excerpt||``,cover:i.cover||``,tags:i.tags?i.tags.split(`,`).map(e=>e.trim()):[],html:a.render(o)}}).sort((e,t)=>new Date(t.date)-new Date(e.date))}var c=s();function l(e){return c.find(t=>t.slug===e)}export{c as n,n as r,l as t};