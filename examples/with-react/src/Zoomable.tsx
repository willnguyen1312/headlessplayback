import { usePlayback } from "@headlessplayback/react"
import { zoomablePlaybackPlugin } from "@headlessplayback/zoomable-plugin"
import React, { useEffect } from "react"
const id = "zoomable"

usePlayback.use(zoomablePlaybackPlugin)

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

function Zoomable() {
  const { activate, playbackActions, playbackState } = usePlayback({
    id,
  })
  const videoContainerRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Activate when playback element is accessible from the DOM
    activate()

    playbackActions.createZoomablePlayback({
      container: videoContainerRef.current as HTMLDivElement,
    })

    playbackActions.setEnableZoom({ enableZoom: true })
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

  return (
    <>
      <div
        ref={videoContainerRef}
        className="border-fuchsia border-1 h-[337.5px] w-[600px]"
      >
        <video
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          className="h-full w-full cursor-zoom-in"
          id={id}
        ></video>
      </div>

      <CurrentTime />
      <Duration />

      <div className="flex items-start space-x-1 ">
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
      </div>
    </>
  )
}

export default Zoomable
