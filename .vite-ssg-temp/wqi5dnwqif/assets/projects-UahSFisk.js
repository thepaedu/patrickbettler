import MarkdownIt from "markdown-it";
import { p as parseFrontmatter } from "./frontmatter-gSYMYapg.js";
const __vite_glob_0_0 = "---\ntitle: Projekt-Name\ndescription: Kurze Beschreibung, was das Projekt macht, für wen es gedacht ist und welches Problem es löst.\ncover: /images/projekt-name.jpg\ndemoUrl: https://example.com\nrepoUrl: https://github.com/thepaedu/projekt-name\ndate: 2026-01-15\ntags: Vue, Node.js\n---\n\n## Worum geht es\n\nHier beschreibst du im Detail, wie das Projekt entstanden ist, welches\nProblem es löst und für wen es gedacht ist.\n\n## Tech-Stack\n\n- Vue 3\n- Node.js\n- ...\n\n## Herausforderungen\n\nBeschreibe hier kurz, was technisch spannend oder schwierig war.\n";
const __vite_glob_0_1 = '---\ntitle: Weiteres Tool\ndescription: Beschreibung des zweiten Projekts. Ersetze diese Platzhalter durch deine eigenen Apps und Tools.\ndemoUrl: ""\nrepoUrl: ""\ndate: 2026-02-20\ntags: Python, CLI\n---\n\n## Worum geht es\n\nBeschreibung, was dieses Tool macht.\n\n## Tech-Stack\n\n- Python\n- ...\n';
const md = new MarkdownIt({ html: false, linkify: true, typographer: true });
const modules = /* @__PURE__ */ Object.assign({
  "../content/projects/projekt-name.md": __vite_glob_0_0,
  "../content/projects/weiteres-tool.md": __vite_glob_0_1
});
function loadProjects() {
  return Object.entries(modules).map(([path, raw]) => {
    const slug = path.split("/").pop().replace(/\.md$/, "");
    const { data, content } = parseFrontmatter(raw);
    return {
      slug,
      title: data.title || slug,
      description: data.description || "",
      cover: data.cover || "",
      demoUrl: data.demoUrl || "",
      repoUrl: data.repoUrl || "",
      date: data.date || "",
      tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
      html: md.render(content)
    };
  }).sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date) - new Date(a.date);
  });
}
const projects = loadProjects();
function getProject(slug) {
  return projects.find((p) => p.slug === slug);
}
export {
  getProject as g,
  projects as p
};
