<script lang="ts">
  import type { PlaybackState } from "@headlessplayback/core"
  import { hlsPlaybackPlugin } from "@headlessplayback/hls-plugin"
  import { usePlayback } from "@headlessplayback/svelte"
  import { onDestroy, onMount } from "svelte"
  usePlayback.use(hlsPlaybackPlugin)

  let id = "hls"

  const {
    activate,
    playbackActions,
    playbackState: _playbackState,
  } = usePlayback({
    id,
  })

  const source1 =
    "https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8"
  const source2 = "https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8"

  let source = source1

  let playbackState: PlaybackState

  const unsubscribe = _playbackState.subscribe((value: PlaybackState) => {
    playbackState = value
  })

  onMount(() => {
    activate()
  })

  onDestroy(() => {
    unsubscribe()
  })

  const jumpTo = (time: number) => {
    playbackActions.setCurrentTime(time)
  }

  const handleSource = async (source: string) => {
    playbackActions.loadHlsSource({
      source,
    })
  }

  $: handleSource(source)
</script>

<div class="border-fuchsia border-1 h-[400px] w-[600px]">
  <video {id} class="h-full w-full" controls>
    <track kind="captions" />
  </video>
</div>

<p>Current time: {playbackState.currentTime}</p>
<p>Duration: {playbackState.duration}</p>

<strong
  >Levels: {playbackState.levels
    .map((level) => level.height)
    .join(", ")}</strong
>

<div class="flex space-x-1">
  <button
    on:click={() => {
      if (source === source1) {
        source = source2
      } else {
        source = source1
      }
    }}>Switch stream</button
  >

  <button
    class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
    on:click={() => jumpTo(playbackState.currentTime + 5)}>Next 5s</button
  >
  <button
    class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
    on:click={() => jumpTo(playbackState.currentTime - 5)}>Prev 5s</button
  >
</div>
