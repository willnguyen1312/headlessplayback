<script setup lang="ts">
import { dashPlaybackPlugin } from "@headlessplayback/dash-plugin"
import { usePlayback } from "@headlessplayback/vue"
import { onMounted, ref, watchEffect } from "vue"

usePlayback.use(dashPlaybackPlugin)

const source1 = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd"
const source2 =
  "https://rdmedia.bbc.co.uk/elephants_dream/1/client_manifest-all.mpd"

const id = "dash"
const { activate, playbackActions, playbackState } = usePlayback({
  id,
})

const source = ref(source1)

onMounted(() => {
  // Activate when playback element is accessible from the DOM
  activate()
})

watchEffect(() => {
  playbackActions.loadDashSource({
    source: source.value,
  })
})

const jumpTo = (time: number) => {
  // Core actions and state are always available
  playbackActions.setCurrentTime(time)
}
</script>

<template>
  <div class="border-fuchsia border-1 h-[400px] w-[600px]">
    <video class="h-full w-full" :id="id" controls></video>
  </div>

  <p>Current time: {{ playbackState.currentTime }}</p>

  <p>Duration: {{ playbackState.duration }}</p>

  <strong
    >BitrateInfo:
    {{
      playbackState.bitrateInfo.map((level) => level.height).join(", ")
    }}</strong
  >

  <div class="flex flex-col items-start space-y-1">
    <button
      class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
      @click="source = source === source1 ? source2 : source1"
    >
      Switch stream
    </button>

    <button
      class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
      @click="jumpTo(playbackState.currentTime + 5)"
    >
      Next 5s
    </button>
    <button
      class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
      @click="jumpTo(playbackState.currentTime - 5)"
    >
      Prev 5s
    </button>
  </div>
</template>
