import { ref, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { useHead } from "@unhead/vue";
import { w as withBase } from "./url--vFYoE6g.js";
import { _ as _export_sfc } from "../main.mjs";
import "@unhead/vue/server";
import "vue-router";
const galleryImages = [
  {
    src: "/images/patrick-bettler-informatiker-abschlussfeier.jpg",
    alt: "Patrick Bettler erhält sein Abschlusszeugnis als Informatiker",
    caption: "Abschlussfeier"
  }
  // { src: '/images/weiteres-bild.jpg', alt: 'Beschreibung', caption: 'Titel' },
];
const _sfc_main = {
  __name: "Gallery",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Galerie – Patrick Bettler",
      meta: [{ name: "description", content: "Bildergalerie von Patrick Bettler." }]
    });
    const activeImage = ref(null);
    ref(null);
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container page" }, _attrs))} data-v-b512b044><h1 data-v-b512b044>Galerie</h1>`);
      if (!unref(galleryImages).length) {
        _push(`<p class="empty" data-v-b512b044> Noch keine Bilder – ergänze Einträge in <code data-v-b512b044>src/data/gallery.js</code>. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid" data-v-b512b044><!--[-->`);
      ssrRenderList(unref(galleryImages), (image) => {
        _push(`<button class="thumb glass" data-v-b512b044><img${ssrRenderAttr("src", unref(withBase)(image.src))}${ssrRenderAttr("alt", image.alt)} data-v-b512b044>`);
        if (image.caption) {
          _push(`<span class="caption" data-v-b512b044>${ssrInterpolate(image.caption)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></div>`);
      if (activeImage.value) {
        _push(`<div class="overlay" data-v-b512b044><div class="panel glass" data-v-b512b044><button class="close" aria-label="Schliessen" data-v-b512b044>×</button><img${ssrRenderAttr("src", unref(withBase)(activeImage.value.src))}${ssrRenderAttr("alt", activeImage.value.alt)} data-v-b512b044>`);
        if (activeImage.value.caption) {
          _push(`<p data-v-b512b044>${ssrInterpolate(activeImage.value.caption)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/Gallery.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Gallery = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b512b044"]]);
export {
  Gallery as default
};
