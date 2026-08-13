import { resolveComponent, mergeProps, unref, withCtx, createBlock, createCommentVNode, createVNode, openBlock, toDisplayString, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { useHead } from "@unhead/vue";
import { p as projects } from "./projects-UahSFisk.js";
import { G as GlassCard } from "./GlassCard-aEeyZ8gA.js";
import { w as withBase } from "./url--vFYoE6g.js";
import { _ as _export_sfc } from "../main.mjs";
import "markdown-it";
import "./frontmatter-gSYMYapg.js";
import "@unhead/vue/server";
import "vue-router";
const _sfc_main = {
  __name: "Projects",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Projekte – Patrick Bettler",
      meta: [{ name: "description", content: "Apps und Software-Tools von Patrick Bettler." }]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container page" }, _attrs))} data-v-a06dbc79><h1 data-v-a06dbc79>Projekte</h1>`);
      if (!unref(projects).length) {
        _push(`<p class="empty" data-v-a06dbc79> Noch keine Projekte – lege Markdown-Dateien unter <code data-v-a06dbc79>src/content/projects</code> an. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid" data-v-a06dbc79><!--[-->`);
      ssrRenderList(unref(projects), (project) => {
        _push(ssrRenderComponent(_component_router_link, {
          key: project.slug,
          to: { name: "project-detail", params: { slug: project.slug } },
          class: "project-link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(GlassCard, { class: "project" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (project.cover) {
                      _push3(`<img${ssrRenderAttr("src", unref(withBase)(project.cover))}${ssrRenderAttr("alt", project.title)} class="cover" data-v-a06dbc79${_scopeId2}>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<h2 data-v-a06dbc79${_scopeId2}>${ssrInterpolate(project.title)}</h2><p class="desc" data-v-a06dbc79${_scopeId2}>${ssrInterpolate(project.description)}</p>`);
                    if (project.tags?.length) {
                      _push3(`<div class="tags" data-v-a06dbc79${_scopeId2}><!--[-->`);
                      ssrRenderList(project.tags, (tag) => {
                        _push3(`<span class="tag" data-v-a06dbc79${_scopeId2}>${ssrInterpolate(tag)}</span>`);
                      });
                      _push3(`<!--]--></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
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
                      ])) : createCommentVNode("", true)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(GlassCard, { class: "project" }, {
                  default: withCtx(() => [
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
                    ])) : createCommentVNode("", true)
                  ]),
                  _: 2
                }, 1024)
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
const Projects = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a06dbc79"]]);
export {
  Projects as default
};
