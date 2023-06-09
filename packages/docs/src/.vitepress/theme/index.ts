// https://vitepress.dev/guide/custom-theme
import { h } from "vue"
import Theme from "vitepress/theme"
import "virtual:uno.css"
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
