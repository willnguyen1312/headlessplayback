<script setup lang="ts">
import { hijackPlaybackPlugin } from "@headlessplayback/hijack-plugin"
import { usePlayback } from "@headlessplayback/vue"
import { onMounted, watchEffect } from "vue"
usePlayback.use(hijackPlaybackPlugin)

const id = "hijack"

const { activate, playbackActions, playbackState } = usePlayback({
  id,
})

onMounted(() => {
  // Activate when playback element is accessible from the DOM
  activate()

  playbackActions.hijack({
    duration: 1000,
    frequency: 4,
  })
})

watchEffect(() => {
  playbackActions.setDirection({ direction: playbackState.direction })
})

function jumpNext5s() {
  // Core actions and state are always available
  playbackActions.setCurrentTime(playbackState.currentTime + 5)
}

function jumpPrev5s() {
  playbackActions.setCurrentTime(playbackState.currentTime - 5)
}

function togglePlay() {
  if (playbackState.paused) {
    playbackActions.setPaused(false)
  } else {
    playbackActions.setPaused(true)
  }
}

function toggleDirection() {
  if (playbackState.direction === "forward") {
    playbackActions.setDirection({
      direction: "backward",
    })
  } else {
    playbackActions.setDirection({
      direction: "forward",
    })
  }
}
</script>

<template>
  <video class="display-none" hidden :id="id"></video>

  <p>Current time: {{ playbackState.currentTime }}</p>
  <p>Duration: {{ playbackState.duration }}</p>
  <p>Direction: {{ playbackState.direction }}</p>

  <div class="flex flex-col items-start space-y-1">
    <button
      class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
      @click="jumpNext5s"
    >
      Next 5s
    </button>
    <button
      class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
      @click="togglePlay"
    >
      {{ playbackState.paused ? "Play" : "Pause" }}
    </button>
    <button
      class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
      @click="jumpPrev5s"
    >
      Prev 5s
    </button>
    <button
      class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
      @click="toggleDirection"
    >
      Toggle direction
    </button>
  </div>
</template>
