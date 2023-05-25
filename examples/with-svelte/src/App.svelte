<script lang="ts">
  import { usePlayback } from "@headlessplayback/svelte"
  import { hlsPlaybackPlugin } from "@headlessplayback/plugins"
  import type { PlaybackState } from "@headlessplayback/core"
  import { onDestroy, onMount, tick } from "svelte"
  usePlayback.use(hlsPlaybackPlugin)

  const {
    activate,
    playbackActions,
    playbackState: _playbackState,
  } = usePlayback({
    id: "video",
  })

  const source1 = "https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8"
  const source2 = "https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8"

  // const source1 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  // const source2 = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4"

  let id = "video"
  let source = source1
  let showDuration = true

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
    playbackActions.load({
      id: "video",
      source,
    })
  }

  $: handleSource(source)
</script>

<div id="app" class="p-4">
  <div class="border-emerald border-1 h-[400px] w-[600px]">
    <!-- src={source} -->
    <video {id} class="h-full w-full" controls>
      <track kind="captions" />
    </video>
  </div>

  <p>Current time: {playbackState.currentTime}</p>
  {#if showDuration}
    <p>Duration: {playbackState.duration}</p>
  {/if}

  <div class="flex flex-col items-start">
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
      on:click={() => {
        playbackActions.setCurrentTime(playbackState.currentTime + 5)
      }}>Next 5s</button
    >
    <button
      on:click={() => {
        playbackActions.setCurrentTime(playbackState.currentTime - 5)
      }}>Prev 5s</button
    >
    <button
      on:click={() => {
        showDuration = !showDuration
      }}
    >
      Toggle show duration
    </button>
  </div>
</div>
