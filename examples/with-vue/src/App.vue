<script lang="ts" setup>
import { usePlayback } from "@headlessplayback/vue"
import { hlsPlaybackPlugin } from "@headlessplayback/plugins"
import { onMounted, ref, watch } from "vue"
usePlayback.use(hlsPlaybackPlugin)

let id = "video"

const { activate, playbackActions, playbackState } = usePlayback({
  id,
})

const source1 = "https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8"
const source2 = "https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8"
const showDuration = ref(true)
const source = ref(source1)

onMounted(() => {
  activate()
})

watch(
  source,
  () => {
    playbackActions.load({
      id,
      source: source.value,
    })
  },
  { immediate: true, flush: "sync" },
)

// const handleSource = async (source: string) => {
//   playbackActions.load({
//     id: "video",
//     source,
//   })
// }

const jumpTo = (time: number) => {
  playbackActions.setCurrentTime(time)
}
</script>

<template>
  <div id="app" class="p-4">
    <div class="border-emerald border-1 h-[400px] w-[600px]">
      <video :id="id" class="h-full w-full" controls>
        <track kind="captions" />
      </video>
    </div>

    <p>Current time: {{ playbackState.currentTime }}</p>

    <p v-if="showDuration">Duration: {{ playbackState.duration }}</p>

    <div class="flex flex-col items-start">
      <button @click="source = source === source1 ? source2 : source1">Switch stream</button>

      <button @click="jumpTo(playbackState.currentTime + 5)">Next 5s</button>
      <button @click="jumpTo(playbackState.currentTime - 5)">Prev 5s</button>
      <button @click="showDuration = !showDuration">Toggle show duration</button>
    </div>
  </div>
</template>
