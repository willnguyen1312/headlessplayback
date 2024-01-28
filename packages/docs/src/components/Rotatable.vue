<script lang="ts" setup>
import { usePlayback } from "@headlessplayback/vue"
import { rotatablePlaybackPlugin } from "@headlessplayback/rotatable-plugin"
import { onMounted, ref } from "vue"

usePlayback.use(rotatablePlaybackPlugin)

const id = "rotatable"
const videoRef = ref<HTMLElement | null>(null)
const { activate, playbackActions, playbackState } = usePlayback({
  id,
})

onMounted(() => {
  // Activate when playback element is accessible from the DOM
  activate()

  playbackActions.createRotatablePlayback({
    container: videoRef.value as HTMLElement,
  })
})

const jumpTo = (time: number) => {
  // Core actions and state are always available
  playbackActions.setCurrentTime(time)
}

const togglePlayback = () => {
  playbackActions.setPaused(!playbackState.paused)
}

const rotate = () => {
  playbackActions.rotate()
}
</script>

<template>
  <div
    ref="videoRef"
    class="border-fuchsia border-1 grid h-[400px] w-[600px] place-items-center"
  >
    <video
      :style="{
        width: `${playbackState.width}px`,
        height: `${playbackState.height}px`,
      }"
      src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      :id="id"
    >
      <track kind="captions" />
    </video>
  </div>

  <p>Current time: {{ playbackState.currentTime }}</p>

  <p>Duration: {{ playbackState.duration }}</p>
  <div class="flex space-x-1">
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

    <button
      class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
      @click="rotate"
    >
      Rotate
    </button>
  </div>
</template>
