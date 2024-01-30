<script lang="ts">
  import type { PlaybackState } from "@headlessplayback/core"
  import { usePlayback } from "@headlessplayback/svelte"
  import { onDestroy, onMount } from "svelte"

  let id = "normal"

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

  const jumpTo = (time: number) => {
    playbackActions.setCurrentTime(time)
  }

  onMount(() => {
    activate()
  })

  onDestroy(() => {
    unsubscribe()
  })
</script>

<div class="border-fuchsia border-1 h-[400px] w-[600px]">
  <video
    {id}
    class="h-full w-full"
    src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    controls
  >
    <track kind="captions" />
  </video>
</div>

<p>Current time: {playbackState.currentTime}</p>
<p>Duration: {playbackState.duration}</p>

<div class="flex space-x-1">
  <button
    class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
    on:click={() => jumpTo(playbackState.currentTime + 5)}>Next 5s</button
  >
  <button
    class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
    on:click={() => jumpTo(playbackState.currentTime - 5)}>Prev 5s</button
  >
</div>
