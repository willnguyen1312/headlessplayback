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

    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/willnguyen1312/headlessplayback" }],

    search: {
      provider: "algolia",
      options: {
        appId: "FKWOWYBGDZ",
        apiKey: "e8482e2e60315de80cf25a96471b9dfa",
        indexName: "zoom-image",
      },
    },
  },
})
