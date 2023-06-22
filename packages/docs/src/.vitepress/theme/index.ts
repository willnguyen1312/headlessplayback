// https://vitepress.dev/guide/custom-theme
import "@unocss/reset/tailwind.css"
import "virtual:uno.css"
import Theme from "vitepress/theme"
import { h } from "vue"
import "./style.css"

export default {
  ...Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  },
}
