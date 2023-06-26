<script lang="ts" setup>
import type { Component } from "vue"
import { ref } from "vue"
import Dash from "./Dash.vue"
import Hijack from "./Hijack.vue"
import Hls from "./Hls.vue"

type PlaybackName = "Hls" | "Hijack" | "Dash"

const components: Record<PlaybackName, Component> = {
  Hls,
  Hijack,
  Dash,
}

const tabs = ref([
  { name: "Hls", href: "#", current: true },
  { name: "Dash", href: "#", current: false },
  { name: "Hijack", href: "#", current: false },
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
  <div class="p-4">
    <nav class="-mb-px flex space-x-8 border-gray-200" aria-label="Tabs">
      <a
        v-for="tab in tabs"
        :key="tab.name"
        :href="tab.href"
        :aria-current="tab.current ? 'page' : undefined"
        class="whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium"
        :class="{
          'border-indigo-500 text-indigo-600': tab.current,
          'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700': !tab.current,
        }"
        @click="updateTab(tab.name)"
      >
        {{ tab.name }}
      </a>
    </nav>

    <div class="mt-4">
      <component :is="components[tabs.find((tab) => tab.current)!.name as PlaybackName]" />
    </div>
  </div>
</template>
