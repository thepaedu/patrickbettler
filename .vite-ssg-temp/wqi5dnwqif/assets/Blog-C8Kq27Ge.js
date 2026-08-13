import { resolveComponent, mergeProps, unref, withCtx, createBlock, createCommentVNode, createVNode, openBlock, toDisplayString, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { useHead } from "@unhead/vue";
import { p as posts } from "./posts-CUGEuoYx.js";
import { G as GlassCard } from "./GlassCard-aEeyZ8gA.js";
import { w as withBase } from "./url--vFYoE6g.js";
import { _ as _export_sfc } from "../main.mjs";
import "markdown-it";
import "./frontmatter-gSYMYapg.js";
import "@unhead/vue/server";
import "vue-router";
const _sfc_main = {
  __name: "Blog",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Blog – Patrick Bettler",
      meta: [{ name: "description", content: "Beiträge von Patrick Bettler." }]
    });
    function formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString("de-CH", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container page" }, _attrs))} data-v-336b9aca><h1 data-v-336b9aca>Blog</h1>`);
      if (!unref(posts).length) {
        _push(`<p class="empty" data-v-336b9aca> Noch keine Beiträge – lege Markdown-Dateien unter <code data-v-336b9aca>src/content/blog</code> an. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="post-grid" data-v-336b9aca><!--[-->`);
      ssrRenderList(unref(posts), (post) => {
        _push(ssrRenderComponent(_component_router_link, {
          key: post.slug,
          to: { name: "blog-post", params: { slug: post.slug } },
          class: "post-link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(GlassCard, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (post.cover) {
                      _push3(`<img${ssrRenderAttr("src", unref(withBase)(post.cover))}${ssrRenderAttr("alt", post.title)} class="cover" data-v-336b9aca${_scopeId2}>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<time class="date" data-v-336b9aca${_scopeId2}>${ssrInterpolate(formatDate(post.date))}</time><h2 data-v-336b9aca${_scopeId2}>${ssrInterpolate(post.title)}</h2><p class="excerpt" data-v-336b9aca${_scopeId2}>${ssrInterpolate(post.excerpt)}</p>`);
                    if (post.tags.length) {
                      _push3(`<div class="tags" data-v-336b9aca${_scopeId2}><!--[-->`);
                      ssrRenderList(post.tags, (tag) => {
                        _push3(`<span class="tag" data-v-336b9aca${_scopeId2}>${ssrInterpolate(tag)}</span>`);
                      });
                      _push3(`<!--]--></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                  } else {
                    return [
                      post.cover ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: unref(withBase)(post.cover),
                        alt: post.title,
                        class: "cover"
                      }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                      createVNode("time", { class: "date" }, toDisplayString(formatDate(post.date)), 1),
                      createVNode("h2", null, toDisplayString(post.title), 1),
                      createVNode("p", { class: "excerpt" }, toDisplayString(post.excerpt), 1),
                      post.tags.length ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "tags"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(post.tags, (tag) => {
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
                createVNode(GlassCard, null, {
                  default: withCtx(() => [
                    post.cover ? (openBlock(), createBlock("img", {
                      key: 0,
                      src: unref(withBase)(post.cover),
                      alt: post.title,
                      class: "cover"
                    }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                    createVNode("time", { class: "date" }, toDisplayString(formatDate(post.date)), 1),
                    createVNode("h2", null, toDisplayString(post.title), 1),
                    createVNode("p", { class: "excerpt" }, toDisplayString(post.excerpt), 1),
                    post.tags.length ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "tags"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(post.tags, (tag) => {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/Blog.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Blog = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-336b9aca"]]);
export {
  Blog as default
};
