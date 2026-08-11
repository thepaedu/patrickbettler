import { createHead } from "@unhead/vue/server";
import { defineComponent, ref, onMounted, createSSRApp, useSSRContext, resolveComponent, withCtx, createTextVNode, toDisplayString, createVNode, resolveDynamicComponent, Transition, createBlock, openBlock } from "vue";
import { createRouter, createMemoryHistory } from "vue-router";
import { ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrInterpolate, ssrRenderVNode } from "vue/server-renderer";
import { useHead } from "@unhead/vue";
const ClientOnly = defineComponent({
  setup(props, { slots }) {
    const mounted = ref(false);
    onMounted(() => mounted.value = true);
    return () => {
      if (!mounted.value)
        return slots.placeholder && slots.placeholder({});
      return slots.default && slots.default({});
    };
  }
});
function ViteSSG(App2, routerOptions, fn, options) {
  const {
    transformState,
    registerComponents = true,
    useHead: useHead2 = true,
    rootContainer = "#app"
  } = {};
  async function createApp$1(routePath) {
    const app = createSSRApp(App2);
    let head;
    if (useHead2) {
      app.use(head = createHead());
    }
    const router = createRouter({
      history: createMemoryHistory(routerOptions.base),
      ...routerOptions
    });
    const { routes: routes2 } = routerOptions;
    if (registerComponents)
      app.component("ClientOnly", ClientOnly);
    const appRenderCallbacks = [];
    const onSSRAppRendered = (cb) => appRenderCallbacks.push(cb);
    const triggerOnSSRAppRendered = () => {
      return Promise.all(appRenderCallbacks.map((cb) => cb()));
    };
    const context = {
      app,
      head,
      isClient: false,
      router,
      routes: routes2,
      onSSRAppRendered,
      triggerOnSSRAppRendered,
      initialState: {},
      transformState,
      routePath
    };
    await fn?.(context);
    app.use(router);
    let entryRoutePath;
    let isFirstRoute = true;
    router.beforeEach((to, from, next) => {
      if (isFirstRoute || entryRoutePath && entryRoutePath === to.path) {
        isFirstRoute = false;
        entryRoutePath = to.path;
        to.meta.state = context.initialState;
      }
      next();
    });
    {
      const route = context.routePath ?? "/";
      router.push(route);
      await router.isReady();
      context.initialState = router.currentRoute.value.meta.state || {};
    }
    const initialState = context.initialState;
    return {
      ...context,
      initialState
    };
  }
  return createApp$1;
}
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main = {
  __name: "App",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      meta: [
        { property: "og:title", content: "Patrick Bettler" },
        { property: "og:description", content: "Offizielle Webseite von Patrick Bettler." },
        {
          property: "og:image",
          content: "https://thepaedu.github.io/patrickbettler/assets/patrick-bettler-BNCAPXrR.jpg"
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" }
      ],
      script: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Patrick Bettler",
            url: "https://thepaedu.github.io/patrickbettler/",
            image: "https://thepaedu.github.io/patrickbettler/assets/patrick-bettler-BNCAPXrR.jpg",
            sameAs: [
              "https://www.instagram.com/patrick_bettler/",
              "https://github.com/thepaedu/patrickbettler/"
            ]
          })
        }
      ]
    });
    const menuOpen = ref(false);
    const navLinks = [
      { to: "/", label: "Home" },
      { to: "/blog", label: "Blog" },
      { to: "/galerie", label: "Galerie" },
      { to: "/projekte", label: "Projekte" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      const _component_router_view = resolveComponent("router-view");
      _push(`<!--[--><div class="bg-blobs" aria-hidden="true" data-v-58bf757b><span data-v-58bf757b></span><span data-v-58bf757b></span><span data-v-58bf757b></span></div><header class="navbar glass" data-v-58bf757b><div class="navbar-inner container" data-v-58bf757b>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: "/",
        class: "brand"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Patrick Bettler`);
          } else {
            return [
              createTextVNode("Patrick Bettler")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="${ssrRenderClass([{ open: menuOpen.value }, "nav-links"])}" data-v-58bf757b><!--[-->`);
      ssrRenderList(navLinks, (link) => {
        _push(ssrRenderComponent(_component_router_link, {
          key: link.to,
          to: link.to,
          onClick: ($event) => menuOpen.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(link.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(link.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><button class="burger" aria-label="Menü" data-v-58bf757b><span data-v-58bf757b></span><span data-v-58bf757b></span><span data-v-58bf757b></span></button></div></header><main data-v-58bf757b>`);
      _push(ssrRenderComponent(_component_router_view, null, {
        default: withCtx(({ Component }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(``);
            ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(Component), null, null), _parent2, _scopeId);
          } else {
            return [
              createVNode(Transition, {
                name: "fade",
                mode: "out-in"
              }, {
                default: withCtx(() => [
                  (openBlock(), createBlock(resolveDynamicComponent(Component)))
                ]),
                _: 2
              }, 1024)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</main><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/App.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-58bf757b"]]);
const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("./assets/Home-Bc5Xj-Od.js")
  },
  {
    path: "/blog",
    name: "blog",
    component: () => import("./assets/Blog-CbW8gxto.js")
  },
  {
    path: "/blog/:slug",
    name: "blog-post",
    component: () => import("./assets/BlogPost-DtWowExw.js"),
    props: true
  },
  {
    path: "/galerie",
    name: "gallery",
    component: () => import("./assets/Gallery-CP3sNw5_.js")
  },
  {
    path: "/projekte",
    name: "projects",
    component: () => import("./assets/Projects-8MgCRsjE.js")
  }
];
const createApp = ViteSSG(App, {
  routes,
  base: "/patrickbettler/"
});
export {
  _export_sfc as _,
  createApp
};
