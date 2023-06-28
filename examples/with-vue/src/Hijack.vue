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

  <div className="flex flex-col items-start">
    <button @click="jumpNext5s">Next 5s</button>
    <button @click="togglePlay">
      {{ playbackState.paused ? "Play" : "Pause" }}
    </button>
    <button @click="jumpPrev5s">Prev 5s</button>
    <button @click="toggleDirection">Toggle direction</button>
  </div>
</template>
