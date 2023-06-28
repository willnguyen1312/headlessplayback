import { hlsPlaybackPlugin } from "@headlessplayback/hls-plugin"
import { usePlayback } from "@headlessplayback/react"
import React, { useEffect, useState } from "react"
usePlayback.use(hlsPlaybackPlugin)

const source1 =
  "https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8"
const source2 = "https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8"
const id = "hls"

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

const Resolutions = React.memo(() => {
  const { playbackState } = usePlayback({
    id,
  })

  // Plugin might inject extra state to playbackState
  return (
    <strong>
      Levels: {playbackState.levels.map((level) => level.height).join(", ")}
    </strong>
  )
})

function App() {
  const { activate, playbackActions, playbackState } = usePlayback({
    id,
  })
  const [source, setSource] = useState(source1)

  useEffect(() => {
    // Activate when playback element is accessible from the DOM
    activate()
  }, [])

  useEffect(() => {
    // Plugin can also inject extra actions to playbackActions
    playbackActions.loadHlsSource({
      source,
    })
  }, [source])

  function jumpNext5s() {
    // Core actions and state are always available
    playbackActions.setCurrentTime(playbackState.currentTime + 5)
  }

  function jumpPrev5s() {
    playbackActions.setCurrentTime(playbackState.currentTime - 5)
  }

  function toggleStreamSource() {
    if (source === source1) {
      setSource(source2)
    } else {
      setSource(source1)
    }
  }

  return (
    <>
      <div className="border-fuchsia border-1 h-[400px] w-[600px]">
        <video className="h-full w-full" id={id} controls></video>
      </div>

      <CurrentTime />
      <Duration />
      <Resolutions />

      <div className="flex flex-col items-start space-y-1 ">
        <button
          className="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          onClick={toggleStreamSource}
        >
          Switch stream
        </button>

        <button
          className="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          onClick={jumpNext5s}
        >
          Next 5s
        </button>
        <button
          className="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          onClick={jumpPrev5s}
        >
          Prev 5s
        </button>
      </div>
    </>
  )
}

export default App
