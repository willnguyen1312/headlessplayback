<script lang="ts" setup>
import type { Component } from "vue"
import { defineAsyncComponent, ref } from "vue"

type PlaybackName = "Hls" | "Hijack" | "Dash" | "Normal" | "Zoomable"

const Dash = defineAsyncComponent(() => import("./Dash.vue"))
const Hls = defineAsyncComponent(() => import("./Hls.vue"))
const Hijack = defineAsyncComponent(() => import("./Hijack.vue"))
const Normal = defineAsyncComponent(() => import("./Normal.vue"))
const Zoomable = defineAsyncComponent(() => import("./Zoomable.vue"))

const components: Record<PlaybackName, Component> = {
  Hls,
  Hijack,
  Dash,
  Normal,
  Zoomable,
}

const tabs = ref([
  { name: "Normal", href: "#", current: true },
  { name: "Hls", href: "#", current: false },
  { name: "Dash", href: "#", current: false },
  { name: "Hijack", href: "#", current: false },
  { name: "Zoomable", href: "#", current: false },
])

const updateTab = (tabName: string) => {
  tabs.value = tabs.value.map((tab) => {
    if (tab.name === tabName) {
      return { ...tab, current: true }
    }
    return { ...tab, current: false }
  })
}
</script>

<template>
  <div
    class="min-h-xl m-x-auto rounded-4 xs-hidden sm-block container mt-4 flex h-[700px] flex-col bg-white p-4 font-sans text-black"
  >
    <nav class="-mb-px flex space-x-8 border-gray-200" aria-label="Tabs">
      <a
        v-for="tab in tabs"
        :key="tab.name"
        :href="tab.href"
        :aria-current="tab.current ? 'page' : undefined"
        class="whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium"
        :class="{
          'border-violet-500 text-violet-600': tab.current,
          'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700':
            !tab.current,
        }"
        @click="updateTab(tab.name)"
      >
        {{ tab.name }}
      </a>
    </nav>

    <div class="mt-4">
      <component
        :is="components[tabs.find((tab) => tab.current)!.name as PlaybackName]"
      />
    </div>
  </div>
</template>
