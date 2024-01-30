import { usePlayback } from "@headlessplayback/preact"
import { rotatablePlaybackPlugin } from "@headlessplayback/rotatable-plugin"
import { useEffect, useRef } from "preact/hooks"

const id = "rotatable"

usePlayback.use(rotatablePlaybackPlugin)

function CurrentTime() {
  const playback = usePlayback({
    id,
  })

  return <p>Current time: {playback.playbackState.currentTime}</p>
}

const Duration = () => {
  const { playbackState } = usePlayback({
    id,
  })

  return <p>Duration: {playbackState.duration}</p>
}

function Rotatable() {
  const { activate, playbackActions, playbackState } = usePlayback({
    id,
  })
  const videoContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Activate when playback element is accessible from the DOM
    activate()

    playbackActions.createRotatablePlayback({
      container: videoContainerRef.current as HTMLDivElement,
    })
  }, [])

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

  function rotate() {
    playbackActions.rotate()
  }

  return (
    <>
      <div
        ref={videoContainerRef}
        class="border-fuchsia border-1 grid h-[400px] w-[600px] place-items-center"
      >
        <video
          style={{
            width: playbackState.width,
            height: playbackState.height,
          }}
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
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

        <button
          class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          onClick={rotate}
        >
          Rotate
        </button>
      </div>
    </>
  )
}

export default Rotatable
