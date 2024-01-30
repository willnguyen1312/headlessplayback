import { usePlayback } from "@headlessplayback/solid"
import { zoomablePlaybackPlugin } from "@headlessplayback/zoomable-plugin"
import { onMount, type Component } from "solid-js"

usePlayback.use(zoomablePlaybackPlugin)

const id = "zoomable"

const Duration: Component = () => {
  const { playbackState } = usePlayback({
    id,
  })

  return <p>Duration: {playbackState.duration}</p>
}

function CurrentTime() {
  const playback = usePlayback({
    id,
  })

  return <p>Current time: {playback.playbackState.currentTime}</p>
}

const Zoomable: Component = () => {
  const { activate, playbackActions, playbackState } = usePlayback({
    id,
  })
  let videoContainerRef: any

  onMount(() => {
    // Activate when playback element is accessible from the DOM
    activate()

    playbackActions.createZoomablePlayback?.({
      container: videoContainerRef as HTMLDivElement,
    })

    playbackActions.setEnableZoom({
      enableZoom: true,
    })
  })

  function jumpNext5s() {
    // Core actions and state are always available
    playbackActions.setCurrentTime(playbackState.currentTime + 5)
  }

  function jumpPrev5s() {
    playbackActions.setCurrentTime(playbackState.currentTime - 5)
  }

  function togglePlayback() {
    playbackActions.setPaused(!playbackState.paused)
  }

  return (
    <>
      <div
        ref={videoContainerRef}
        class="border-fuchsia border-1 h-[337.5px] w-[600px]"
      >
        <video
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          class="h-full w-full cursor-zoom-in"
          id={id}
        ></video>
      </div>

      <CurrentTime />
      <Duration />

      <div class="flex space-x-1">
        <button
          class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          onClick={jumpPrev5s}
        >
          Prev 5s
        </button>

        <button
          class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          onClick={togglePlayback}
        >
          {playbackState.paused ? "Play" : "Pause"}
        </button>

        <button
          class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          onClick={jumpNext5s}
        >
          Next 5s
        </button>
      </div>
    </>
  )
}

export default Zoomable
