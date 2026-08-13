import { computed, resolveComponent, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { useHead } from "@unhead/vue";
import { g as getPost } from "./posts-CUGEuoYx.js";
import { w as withBase } from "./url--vFYoE6g.js";
import { _ as _export_sfc } from "../main.mjs";
import "markdown-it";
import "./frontmatter-gSYMYapg.js";
import "@unhead/vue/server";
import "vue-router";
const _sfc_main = {
  __name: "BlogPost",
  __ssrInlineRender: true,
  props: {
    slug: { type: String, required: true }
  },
  setup(__props) {
    const props = __props;
    const post = computed(() => getPost(props.slug));
    useHead(() => ({
      title: post.value ? `${post.value.title} – Patrick Bettler` : "Beitrag nicht gefunden",
      meta: [{ name: "description", content: post.value?.excerpt || "" }]
    }));
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
      if (post.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "container page" }, _attrs))} data-v-7dab8ef9>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: "/blog",
          class: "back"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`← Zurück zum Blog`);
            } else {
              return [
                createTextVNode("← Zurück zum Blog")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<article class="glass article" data-v-7dab8ef9>`);
        if (post.value.cover) {
          _push(`<img${ssrRenderAttr("src", unref(withBase)(post.value.cover))}${ssrRenderAttr("alt", post.value.title)} class="cover" data-v-7dab8ef9>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<time class="date" data-v-7dab8ef9>${ssrInterpolate(formatDate(post.value.date))}</time><h1 data-v-7dab8ef9>${ssrInterpolate(post.value.title)}</h1>`);
        if (post.value.tags.length) {
          _push(`<div class="tags" data-v-7dab8ef9><!--[-->`);
          ssrRenderList(post.value.tags, (tag) => {
            _push(`<span class="tag" data-v-7dab8ef9>${ssrInterpolate(tag)}</span>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="content" data-v-7dab8ef9>${post.value.html ?? ""}</div></article></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "container page" }, _attrs))} data-v-7dab8ef9><p data-v-7dab8ef9>Diesen Beitrag gibt es nicht (mehr).</p>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: "/blog",
          class: "back"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`← Zurück zum Blog`);
            } else {
              return [
                createTextVNode("← Zurück zum Blog")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/BlogPost.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const BlogPost = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7dab8ef9"]]);
export {
  BlogPost as default
};
