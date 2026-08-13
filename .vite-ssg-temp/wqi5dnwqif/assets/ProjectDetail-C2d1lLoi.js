import { computed, resolveComponent, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { useHead } from "@unhead/vue";
import { g as getProject } from "./projects-UahSFisk.js";
import { w as withBase } from "./url--vFYoE6g.js";
import { _ as _export_sfc } from "../main.mjs";
import "markdown-it";
import "./frontmatter-gSYMYapg.js";
import "@unhead/vue/server";
import "vue-router";
const _sfc_main = {
  __name: "ProjectDetail",
  __ssrInlineRender: true,
  props: {
    slug: { type: String, required: true }
  },
  setup(__props) {
    const props = __props;
    const project = computed(() => getProject(props.slug));
    useHead(() => ({
      title: project.value ? `${project.value.title} – Patrick Bettler` : "Projekt nicht gefunden",
      meta: [{ name: "description", content: project.value?.description || "" }]
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      if (project.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "container page" }, _attrs))} data-v-7b7a9dc7>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: "/projekte",
          class: "back"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`← Zurück zu den Projekten`);
            } else {
              return [
                createTextVNode("← Zurück zu den Projekten")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<article class="glass article" data-v-7b7a9dc7>`);
        if (project.value.cover) {
          _push(`<img${ssrRenderAttr("src", unref(withBase)(project.value.cover))}${ssrRenderAttr("alt", project.value.title)} class="cover" data-v-7b7a9dc7>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<h1 data-v-7b7a9dc7>${ssrInterpolate(project.value.title)}</h1>`);
        if (project.value.description) {
          _push(`<p class="lead" data-v-7b7a9dc7>${ssrInterpolate(project.value.description)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (project.value.tags.length) {
          _push(`<div class="tags" data-v-7b7a9dc7><!--[-->`);
          ssrRenderList(project.value.tags, (tag) => {
            _push(`<span class="tag" data-v-7b7a9dc7>${ssrInterpolate(tag)}</span>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (project.value.demoUrl || project.value.repoUrl) {
          _push(`<div class="links" data-v-7b7a9dc7>`);
          if (project.value.demoUrl) {
            _push(`<a${ssrRenderAttr("href", project.value.demoUrl)} target="_blank" rel="noopener noreferrer" class="btn primary" data-v-7b7a9dc7> Live ansehen </a>`);
          } else {
            _push(`<!---->`);
          }
          if (project.value.repoUrl) {
            _push(`<a${ssrRenderAttr("href", project.value.repoUrl)} target="_blank" rel="noopener noreferrer" class="btn" data-v-7b7a9dc7> Quellcode </a>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="content" data-v-7b7a9dc7>${project.value.html ?? ""}</div></article></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "container page" }, _attrs))} data-v-7b7a9dc7><p data-v-7b7a9dc7>Dieses Projekt gibt es nicht (mehr).</p>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: "/projekte",
          class: "back"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`← Zurück zu den Projekten`);
            } else {
              return [
                createTextVNode("← Zurück zu den Projekten")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/ProjectDetail.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProjectDetail = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7b7a9dc7"]]);
export {
  ProjectDetail as default
};
