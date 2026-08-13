import MarkdownIt from "markdown-it";
import { p as parseFrontmatter } from "./frontmatter-gSYMYapg.js";
const __vite_glob_0_0 = "---\ntitle: Geschafft – Ausbildung zum Informatiker EFZ abgeschlossen\ndate: 2026-08-11\nexcerpt: Nach vier Jahren Ausbildung zum Informatiker Applikationsentwicklung EFZ und bestandener Berufsmaturität ein Rückblick und Dank an alle, die mich begleitet haben.\ncover: /images/patrick-bettler-informatiker-abschlussfeier.jpg\ntags: Ausbildung, Meilenstein\n---\n\nNach vier intensiven und lehrreichen Jahren habe ich meine\nAusbildung zum Informatiker Applikationsentwicklung EFZ erfolgreich\nabgeschlossen und gleichzeitig auch die Berufsmaturität bestanden.\n\nEin besonderer Dank gilt meinem Berufsbildner **Steven Utiger**, der mich\nüber die gesamte Ausbildungszeit begleitet und unterstützt hat. Ebenso\nmöchte ich mich herzlich bei meinem Vorgesetzten **Severin Gabriel** für\ndas Vertrauen und die Förderung bedanken. Ein grosses Dankeschön geht auch\nan **Michael Zihlmann**, der mich als Fachexperte bei meiner IPA begleitet\nhat.\n\nDanke auch an die **BK Solution AG**, bei der ich nicht nur viel\nfachliches Wissen sammeln durfte, sondern auch persönlich wachsen konnte.\n\nIch freue mich auf alles, was nun vor mir liegt.\n";
const __vite_glob_0_1 = "---\ntitle: Willkommen auf meiner neuen Webseite\ndate: 2026-01-10\nexcerpt: Ein kurzer Einblick, warum ich diese Seite gebaut habe und was hier künftig zu finden sein wird.\ntags: Vorstellung, Vue, Web\n---\n\nSchön, dass du hier bist! Auf dieser Seite werde ich künftig über Projekte,\nTools und Dinge schreiben, die mich als Informatiker beschäftigen.\n\n## Was dich erwartet\n\n- Einblicke in eigene Software-Projekte\n- Kurze technische Notizen und Learnings\n- Ein paar Bilder aus meinem Alltag\n\nIch freue mich, wenn du regelmäßig vorbeischaust.\n";
const md = new MarkdownIt({ html: false, linkify: true, typographer: true });
const modules = /* @__PURE__ */ Object.assign({
  "../content/blog/ausbildung-abgeschlossen.md": __vite_glob_0_0,
  "../content/blog/willkommen.md": __vite_glob_0_1
});
function loadPosts() {
  return Object.entries(modules).map(([path, raw]) => {
    const slug = path.split("/").pop().replace(/\.md$/, "");
    const { data, content } = parseFrontmatter(raw);
    return {
      slug,
      title: data.title || slug,
      date: data.date || "",
      excerpt: data.excerpt || "",
      cover: data.cover || "",
      tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
      html: md.render(content)
    };
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
}
const posts = loadPosts();
function getPost(slug) {
  return posts.find((p) => p.slug === slug);
}
export {
  getPost as g,
  posts as p
};
