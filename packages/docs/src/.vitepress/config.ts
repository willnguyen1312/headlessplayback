import Unocss from "unocss/vite"
import { defineConfig } from "vitepress"
import pkg from "@headlessplayback/core/package.json"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Headless Playback",
  description: "A simple yet complete playback library designed for UI frameworks or even without",
  base: "/headlessplayback/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: pkg.version,
        items: [
          {
            text: "Changelog",
            link: "https://github.com/willnguyen1312/headlessplayback/blob/main/packages/core/CHANGELOG.md",
          },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/willnguyen1312/headlessplayback" }],

    sidebar: [
      {
        text: "Guide",
        items: [{ text: "Get started", link: "/guide" }],
      },
      {
        text: "Examples",
        items: [
          {
            text: "Vanilla JS",
            link: "/examples/vanilla",
          },
          {
            text: "Vue",
            link: "/examples/vue",
          },
          {
            text: "React",
            link: "/examples/react",
          },
          {
            text: "Preact",
            link: "/examples/preact",
          },
          {
            text: "Svelte",
            link: "/examples/svelte",
          },
          {
            text: "Solid",
            link: "/examples/solid",
          },
          {
            text: "Qwik",
            link: "/examples/qwik",
          },
        ],
      },
      {
        text: "Core API",
        link: "/api/",
        items: [
          { text: "createZoomImageClick", link: "/api/createZoomImageClick" },
          { text: "createZoomImageHover", link: "/api/createZoomImageHover" },
          { text: "createZoomImageMove", link: "/api/createZoomImageMove" },
          { text: "createZoomImageWheel", link: "/api/createZoomImageWheel" },
          { text: "cropImage", link: "/api/cropImage" },
          { text: "makeCalculateZoom", link: "/api/makeCalculateZoom" },
          {
            text: "makeCalculatePercentage",
            link: "/api/makeCalculatePercentage",
          },
        ],
      },
      {
        text: "Vue Adapter",
        link: "/api/adapters/vue",
      },
      {
        text: "React Adapter",
        link: "/api/adapters/react",
      },
      {
        text: "Preact Adapter",
        link: "/api/adapters/preact",
      },
      {
        text: "Svelte Adapter",
        link: "/api/adapters/svelte",
      },
      {
        text: "Solid Adapter",
        link: "/api/adapters/solid",
      },
      {
        text: "Qwik Adapter",
        link: "/api/adapters/qwik",
      },
    ],

    search: {
      provider: "algolia",
      options: {
        appId: "FKWOWYBGDZ",
        apiKey: "e8482e2e60315de80cf25a96471b9dfa",
        indexName: "zoom-image",
      },
    },
  },
  vite: {
    plugins: [
      Unocss({
        theme: {
          breakpoints: {
            xs: "320px",
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
          },
        },
      }),
    ],
  },
})
