---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Headless Playback"
  tagline: "A simple yet complete playback library"
  actions:
    - theme: brand
      text: Get Started
      link: /guide
    - theme: alt
      text: View on GitHub
      link: https://github.com/willnguyen1312/headlessplayback

features:
  - title: Headless 💅
    details: Bring your own beautiful UI
  - title: Plugins ⚙︎
    details: The core library is extensible with plugins
  - title: Performance 🚀
    details: Optimized for speed at scale
---

<script setup>
import HomePageShow from './components/HomePageShow.vue'
import Footer from './components/FooterComp.vue'
</script>

<HomePageShow />
<Footer />
