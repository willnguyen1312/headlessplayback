<script lang="ts">
  import type { PlaybackState } from "@headlessplayback/core"
  import { usePlayback } from "@headlessplayback/svelte"
  import { rotatablePlaybackPlugin } from "@headlessplayback/rotatable-plugin"
  import { onDestroy, onMount } from "svelte"

  usePlayback.use(rotatablePlaybackPlugin)

  let id = "rotatable"

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

  const rotate = () => {
    playbackActions.rotate()
  }

  onMount(() => {
    activate()

    playbackActions.createRotatablePlayback({
      container: videoContainer,
    })
  })

  onDestroy(() => {
    unsubscribe()
  })
</script>

<div
  bind:this={videoContainer}
  class="border-fuchsia border-1 grid h-[400px] w-[600px] place-items-center"
>
  <video
    {id}
    style="
		   width: {playbackState.width}px; 
			 background-color: {playbackState.height}px; 
		 "
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

  <button
    class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
    on:click={rotate}>Rotate</button
  >
</div>
