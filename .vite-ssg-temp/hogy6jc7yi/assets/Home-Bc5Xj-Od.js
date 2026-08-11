import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent } from "vue/server-renderer";
import { useHead } from "@unhead/vue";
import { ref, onMounted, resolveComponent, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import gsap from "gsap";
import { _ as _export_sfc } from "../main.mjs";
import "@unhead/vue/server";
import "vue-router";
const profilbild = "/patrickbettler/assets/patrick-bettler-BNCAPXrR.jpg";
const _sfc_main$1 = {
  __name: "HeroSection",
  __ssrInlineRender: true,
  setup(__props) {
    const heroRef = ref(null);
    const avatarRef = ref(null);
    const titleRef = ref(null);
    const subtitleRef = ref(null);
    const ctaRef = ref(null);
    const glowRef = ref(null);
    onMounted(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        avatarRef.value,
        { opacity: 0, scale: 0.7, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.9 }
      ).fromTo(
        titleRef.value,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.5"
      ).fromTo(
        subtitleRef.value,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.45"
      ).fromTo(
        ctaRef.value.children,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 },
        "-=0.35"
      );
      gsap.to(glowRef.value, {
        scale: 1.15,
        opacity: 0.55,
        duration: 3.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "hero",
        ref_key: "heroRef",
        ref: heroRef
      }, _attrs))} data-v-2724ac77><div class="avatar-wrap" data-v-2724ac77><span class="glow" data-v-2724ac77></span><img${ssrRenderAttr("src", unref(profilbild))} alt="Patrick Bettler" class="avatar" data-v-2724ac77></div><h1 data-v-2724ac77>Patrick Bettler</h1><p class="subtitle" data-v-2724ac77> software developer </p><div class="cta" data-v-2724ac77>`);
      _push(ssrRenderComponent(_component_router_link, {
        class: "btn primary",
        to: "/projekte"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Projekte ansehen`);
          } else {
            return [
              createTextVNode("Projekte ansehen")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, {
        class: "btn",
        to: "/blog"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Zum Blog`);
          } else {
            return [
              createTextVNode("Zum Blog")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, {
        class: "btn",
        to: "/galerie"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Galerie`);
          } else {
            return [
              createTextVNode("Galerie")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/HeroSection.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const HeroSection = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-2724ac77"]]);
const _sfc_main = {
  __name: "Home",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Patrick Bettler",
      meta: [{ name: "description", content: "Offizielle Webseite von Patrick Bettler." }]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-b7f52a18>`);
      _push(ssrRenderComponent(HeroSection, null, null, _parent));
      _push(`<nav class="links container" aria-label="Social Media" data-v-b7f52a18><a class="icon-btn" href="https://www.instagram.com/patrick_bettler/" target="_blank" rel="noopener noreferrer" aria-label="Instagram Profil von Patrick Bettler" data-v-b7f52a18><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-v-b7f52a18><rect x="3" y="3" width="18" height="18" rx="5" data-v-b7f52a18></rect><circle cx="12" cy="12" r="4" data-v-b7f52a18></circle><circle cx="17.2" cy="6.8" r="1" data-v-b7f52a18></circle></svg><span data-v-b7f52a18>Instagram</span></a><a class="icon-btn" href="https://github.com/thepaedu" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profil von Patrick Bettler" data-v-b7f52a18><svg viewBox="0 0 24 24" fill="currentColor" data-v-b7f52a18><path d="M12 2C6.48 2 2 6.58 2 12.2c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.22-3.37-1.22-.46-1.2-1.11-1.52-1.11-1.52-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.35 1.12 2.92.85.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05a9.32 9.32 0 0 1 5 0c1.9-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.2 10.2 0 0 0 22 12.2C22 6.58 17.52 2 12 2Z" data-v-b7f52a18></path></svg><span data-v-b7f52a18>GitHub</span></a></nav></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/Home.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Home = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b7f52a18"]]);
export {
  Home as default
};
