<script lang="ts">
  import type { PlaybackState } from "@headlessplayback/core"
  import { usePlayback } from "@headlessplayback/svelte"
  import { zoomablePlaybackPlugin } from "@headlessplayback/zoomable-plugin"
  import { onDestroy, onMount } from "svelte"

  usePlayback.use(zoomablePlaybackPlugin)

  let id = "zoomable"

  const {
    activate,
    playbackActions,
    playbackState: _playbackState,
  } = usePlayback({
    id,
  })

  let playbackState: PlaybackState
  let videoContainer: HTMLDivElement

  const unsubscribe = _playbackState.subscribe((value) => {
    playbackState = value as PlaybackState
  })

  const jumpTo = (time: number) => {
    playbackActions.setCurrentTime(time)
  }

  onMount(() => {
    activate()

    playbackActions.createZoomablePlayback({
      container: videoContainer,
    })

    playbackActions.setEnableZoom({
      enableZoom: true,
    })
  })

  onDestroy(() => {
    unsubscribe()
  })
</script>

<div
  bind:this={videoContainer}
  class="border-fuchsia border-1 h-[337.5px] w-[600px]"
>
  <video
    {id}
    class="h-full w-full cursor-zoom-in"
    src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  >
    <track kind="captions" />
  </video>
</div>

<p>Current time: {playbackState.currentTime}</p>
<p>Duration: {playbackState.duration}</p>

<div class="flex space-x-1">
  <button
    class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
    on:click={() => jumpTo(playbackState.currentTime - 5)}>Prev 5s</button
  >

  <button
    class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
    on:click={() => playbackActions.setPaused(!playbackState.paused)}
    >{playbackState.paused ? "Play" : "Pause"}</button
  >

  <button
    class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
    on:click={() => jumpTo(playbackState.currentTime + 5)}>Next 5s</button
  >
</div>
