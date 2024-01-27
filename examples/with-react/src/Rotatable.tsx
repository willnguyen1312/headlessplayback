import { usePlayback } from "@headlessplayback/react"
import { rotatablePlaybackPlugin } from "@headlessplayback/rotatable-plugin"
import React, { useEffect } from "react"
const id = "zoomable"

usePlayback.use(rotatablePlaybackPlugin)

function CurrentTime() {
  const playback = usePlayback({
    id,
  })

  return <p>Current time: {playback.playbackState.currentTime}</p>
}

const Duration = React.memo(() => {
  const { playbackState } = usePlayback({
    id,
  })

  return <p>Duration: {playbackState.duration}</p>
})

function Rotatable() {
  const { activate, playbackActions, playbackState } = usePlayback({
    id,
  })
  const videoContainerRef = React.useRef<HTMLDivElement>(null)

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
        className="border-fuchsia border-1 grid h-[400px] w-[800px] place-items-center"
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

      <div className="flex space-x-1 ">
        <button
          className="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          onClick={jumpPrev5s}
        >
          Prev 5s
        </button>

        <button
          className="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          onClick={togglePlayback}
        >
          {playbackState.paused ? "Play" : "Pause"}
        </button>

        <button
          className="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          onClick={jumpNext5s}
        >
          Next 5s
        </button>

        <button
          className="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          onClick={rotate}
        >
          Rotate
        </button>
      </div>
    </>
  )
}

export default Rotatable
