<script lang="ts">
  import type { PlaybackState } from "@headlessplayback/core"
  import { hijackPlaybackPlugin } from "@headlessplayback/hijack-plugin"
  import { usePlayback } from "@headlessplayback/svelte"
  import { onDestroy, onMount } from "svelte"

  usePlayback.use(hijackPlaybackPlugin)
  const id = "hijack"

  const {
    activate,
    playbackActions,
    playbackState: _playbackState,
  } = usePlayback({
    id,
  })

  let playbackState: PlaybackState

  const unsubscribe = _playbackState.subscribe((value: PlaybackState) => {
    playbackState = value
  })

  onMount(() => {
    activate()
    playbackActions.hijack({
      duration: 1000,
      frequency: 4,
    })
  })

  onDestroy(() => {
    unsubscribe()
  })

  const jumpTo = (time: number) => {
    playbackActions.setCurrentTime(time)
  }
</script>

<video class="display-none" hidden {id} controls>
  <track kind="captions" /></video
>

<p>Current time: {playbackState.currentTime}</p>
<p>Duration: {playbackState.duration}</p>
<p>Direction: {playbackState.direction}</p>

<div class="flex space-x-1">
  <button
    class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
    on:click={() => jumpTo(playbackState.currentTime + 5)}>Next 5s</button
  >
  <button
    on:click={() => {
      playbackActions.setPaused(!playbackState.paused)
    }}>{playbackState.paused ? "Play" : "Pause"}</button
  >
  <button
    class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
    on:click={() => jumpTo(playbackState.currentTime - 5)}>Prev 5s</button
  >
  <button
    on:click={() => {
      playbackActions.setDirection({
        direction:
          playbackState.direction === "forward" ? "backward" : "forward",
      })
    }}>Toggle direction</button
  >
</div>
