import { usePlayback } from "@headlessplayback/solid"
import { onMount, type Component } from "solid-js"

const id = "normal"

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

const Hls: Component = () => {
  const { activate, playbackActions, playbackState } = usePlayback({
    id,
  })

  onMount(() => {
    // Activate when playback element is accessible from the DOM
    activate()
  })

  function jumpNext5s() {
    // Core actions and state are always available
    playbackActions.setCurrentTime(playbackState.currentTime + 5)
  }

  function jumpPrev5s() {
    playbackActions.setCurrentTime(playbackState.currentTime - 5)
  }

  return (
    <>
      <div class="border-fuchsia border-1 h-[400px] w-[600px]">
        <video
          src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          class="h-full w-full"
          id={id}
          controls
        ></video>
      </div>

      <CurrentTime />
      <Duration />

      <div class="flex flex-col items-start space-y-1 ">
        <button
          class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          onClick={jumpNext5s}
        >
          Next 5s
        </button>
        <button
          class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          onClick={jumpPrev5s}
        >
          Prev 5s
        </button>
      </div>
    </>
  )
}

export default Hls
