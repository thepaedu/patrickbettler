import { mergeProps, unref, withCtx, createBlock, createCommentVNode, createVNode, openBlock, toDisplayString, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { useHead } from "@unhead/vue";
import { G as GlassCard } from "./GlassCard-aEeyZ8gA.js";
import { w as withBase } from "./url--vFYoE6g.js";
import { _ as _export_sfc } from "../main.mjs";
import "@unhead/vue/server";
import "vue-router";
const projects = [
  {
    title: "Projekt-Name",
    description: "Kurze Beschreibung, was das Projekt macht, für wen es gedacht ist und welches Problem es löst.",
    tags: ["Vue", "Node.js"],
    demoUrl: "",
    repoUrl: "",
    cover: ""
  }
];
const _sfc_main = {
  __name: "Projects",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Projekte – Patrick Bettler",
      meta: [{ name: "description", content: "Apps und Software-Tools von Patrick Bettler." }]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container page" }, _attrs))} data-v-b8a53ca8><h1 data-v-b8a53ca8>Projekte</h1><div class="grid" data-v-b8a53ca8><!--[-->`);
      ssrRenderList(unref(projects), (project) => {
        _push(ssrRenderComponent(GlassCard, {
          key: project.title,
          class: "project"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (project.cover) {
                _push2(`<img${ssrRenderAttr("src", unref(withBase)(project.cover))}${ssrRenderAttr("alt", project.title)} class="cover" data-v-b8a53ca8${_scopeId}>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<h2 data-v-b8a53ca8${_scopeId}>${ssrInterpolate(project.title)}</h2><p class="desc" data-v-b8a53ca8${_scopeId}>${ssrInterpolate(project.description)}</p>`);
              if (project.tags?.length) {
                _push2(`<div class="tags" data-v-b8a53ca8${_scopeId}><!--[-->`);
                ssrRenderList(project.tags, (tag) => {
                  _push2(`<span class="tag" data-v-b8a53ca8${_scopeId}>${ssrInterpolate(tag)}</span>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="links" data-v-b8a53ca8${_scopeId}>`);
              if (project.demoUrl) {
                _push2(`<a${ssrRenderAttr("href", project.demoUrl)} target="_blank" rel="noopener noreferrer" class="btn" data-v-b8a53ca8${_scopeId}> Live ansehen </a>`);
              } else {
                _push2(`<!---->`);
              }
              if (project.repoUrl) {
                _push2(`<a${ssrRenderAttr("href", project.repoUrl)} target="_blank" rel="noopener noreferrer" class="btn" data-v-b8a53ca8${_scopeId}> Quellcode </a>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                project.cover ? (openBlock(), createBlock("img", {
                  key: 0,
                  src: unref(withBase)(project.cover),
                  alt: project.title,
                  class: "cover"
                }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                createVNode("h2", null, toDisplayString(project.title), 1),
                createVNode("p", { class: "desc" }, toDisplayString(project.description), 1),
                project.tags?.length ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "tags"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(project.tags, (tag) => {
                    return openBlock(), createBlock("span", {
                      key: tag,
                      class: "tag"
                    }, toDisplayString(tag), 1);
                  }), 128))
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "links" }, [
                  project.demoUrl ? (openBlock(), createBlock("a", {
                    key: 0,
                    href: project.demoUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    class: "btn"
                  }, " Live ansehen ", 8, ["href"])) : createCommentVNode("", true),
                  project.repoUrl ? (openBlock(), createBlock("a", {
                    key: 1,
                    href: project.repoUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    class: "btn"
                  }, " Quellcode ", 8, ["href"])) : createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/Projects.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Projects = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b8a53ca8"]]);
export {
  Projects as default
};
