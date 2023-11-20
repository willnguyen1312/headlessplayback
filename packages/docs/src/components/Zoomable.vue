<script lang="ts" setup>
import { usePlayback } from "@headlessplayback/vue"
import { zoomablePlaybackPlugin } from "@headlessplayback/zoomable-plugin"
import { onMounted, ref } from "vue"

usePlayback.use(zoomablePlaybackPlugin)

const id = "zoomable"
const videoRef = ref<HTMLElement | null>(null)
const { activate, playbackActions, playbackState } = usePlayback({
  id,
})

onMounted(() => {
  // Activate when playback element is accessible from the DOM
  activate()

  playbackActions.createZoomablePlayback({
    container: videoRef.value as HTMLElement,
  })

  playbackActions.setEnableZoom({ enableZoom: true })
})

const jumpTo = (time: number) => {
  // Core actions and state are always available
  playbackActions.setCurrentTime(time)
}

const togglePlayback = () => {
  playbackActions.setPaused(!playbackState.paused)
}
</script>

<template>
  <p>
    Please feel free to hit play and scroll (pinch 🤏 on touch device) inside
    the video to see the magic 🪄
  </p>

  <div ref="videoRef" class="border-fuchsia border-1 h-[337.5px] w-[600px]">
    <video
      src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      :id="id"
      class="h-full w-full cursor-zoom-in"
    >
      <track kind="captions" />
    </video>
  </div>

  <p>Current time: {{ playbackState.currentTime }}</p>

  <p>Duration: {{ playbackState.duration }}</p>
  <div class="flex items-start space-x-1">
    <button
      class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
      @click="jumpTo(playbackState.currentTime - 5)"
    >
      Prev 5s
    </button>

    <button
      class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
      @click="togglePlayback"
    >
      {{ playbackState.paused ? "Play" : "Pause" }}
    </button>

    <button
      class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
      @click="jumpTo(playbackState.currentTime + 5)"
    >
      Next 5s
    </button>
  </div>
</template>
