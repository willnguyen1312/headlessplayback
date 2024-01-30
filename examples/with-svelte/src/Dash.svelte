<script lang="ts">
  import type { PlaybackState } from "@headlessplayback/core"
  import { dashPlaybackPlugin } from "@headlessplayback/dash-plugin"
  import { usePlayback } from "@headlessplayback/svelte"
  import { onDestroy, onMount } from "svelte"

  usePlayback.use(dashPlaybackPlugin)

  const source1 = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd"
  const source2 =
    "https://rdmedia.bbc.co.uk/elephants_dream/1/client_manifest-all.mpd"

  const id = "dash"
  const {
    activate,
    playbackActions,
    playbackState: _playbackState,
  } = usePlayback({
    id,
  })

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

  const handleSource = async (source: string) => {
    playbackActions.loadDashSource({
      source,
    })
  }

  $: handleSource(source)

  const jumpTo = (time: number) => {
    playbackActions.setCurrentTime(time)
  }
</script>

<div class="border-fuchsia border-1 h-[400px] w-[600px]">
  <video class="h-full w-full" {id} controls> <track kind="captions" /></video>
</div>

<p>Current time: {playbackState.currentTime}</p>

<p>Duration: {playbackState.duration}</p>

<strong
  >BitrateInfo: {playbackState.bitrateInfo
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
