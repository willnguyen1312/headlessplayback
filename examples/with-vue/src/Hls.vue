<script lang="ts" setup>
import { hlsPlaybackPlugin } from "@headlessplayback/hls-plugin"
import { usePlayback } from "@headlessplayback/vue"
import { onMounted, ref, watchEffect } from "vue"
usePlayback.use(hlsPlaybackPlugin)

const id = "hls"
const { activate, playbackActions, playbackState } = usePlayback({
  id,
})

const source1 = "https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8"
const source2 = "https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8"
const source = ref(source1)

onMounted(() => {
  // Activate when playback element is accessible from the DOM
  activate()
})

watchEffect(() => {
  // Plugin will inject extra action to playbackActions
  playbackActions.loadHlsSource({
    source: source.value,
  })
})

const jumpTo = (time: number) => {
  // Core actions and state are always available
  playbackActions.setCurrentTime(time)
}
</script>

<template>
  <div class="border-emerald border-1 h-[400px] w-[600px]">
    <video :id="id" class="h-full w-full" controls>
      <track kind="captions" />
    </video>
  </div>

  <p>Current time: {{ playbackState.currentTime }}</p>

  <p>Duration: {{ playbackState.duration }}</p>
  <!-- Plugin will inject extra state to playbackState -->
  <strong>Levels: {{ playbackState.levels.map((level) => level.height).join(", ") }}</strong>

  <div class="flex flex-col items-start">
    <button @click="source = source === source1 ? source2 : source1">Switch stream</button>

    <button @click="jumpTo(playbackState.currentTime + 5)">Next 5s</button>
    <button @click="jumpTo(playbackState.currentTime - 5)">Prev 5s</button>
  </div>
</template>
