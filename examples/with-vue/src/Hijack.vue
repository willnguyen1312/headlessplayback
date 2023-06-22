<script setup lang="ts">
import { Direction, hijackPlaybackPlugin } from "@headlessplayback/hijack-plugin"
import { usePlayback } from "@headlessplayback/vue"
import { onMounted, ref, watchEffect } from "vue"
usePlayback.use(hijackPlaybackPlugin)

const id = "hijack"

const { activate, playbackActions, playbackState } = usePlayback({
  id,
})

const direction = ref<Direction>("forward")

onMounted(() => {
  // Activate when playback element is accessible from the DOM
  activate()

  playbackActions.hijack({ direction: direction.value, duration: 1000, frequency: 4 })
})

watchEffect(() => {
  playbackActions.setDirection({ direction: direction.value })
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
  if (direction.value === "forward") {
    direction.value = "backward"
  } else {
    direction.value = "forward"
  }
}
</script>

<template>
  <video hidden :id="id"></video>

  <p>Current time: {{ playbackState.currentTime }}</p>
  <p>Duration: {{ playbackState.duration }}</p>

  <div className="flex flex-col items-start ">
    <button @click="jumpNext5s">Next 5s</button>
    <button @click="togglePlay">{{ playbackState.paused ? "Play" : "Pause" }}</button>
    <button @click="jumpPrev5s">Prev 5s</button>
    <button @click="toggleDirection">Toggle direction</button>
    <p>Direction: {{ direction }}</p>
  </div>
</template>
