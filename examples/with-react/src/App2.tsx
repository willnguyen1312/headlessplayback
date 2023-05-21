import { usePlayback } from "@headlessplayback/react"
import { useEffect, useState } from "react"
import { hlsPlaybackPlugin } from "@headlessplayback/plugins"
usePlayback.use(hlsPlaybackPlugin)

function Duration() {
  const { playbackState } = usePlayback({
    id: "video",
  })

  return <p>Duration: {playbackState.duration}</p>
}

function CurrenTime() {
  const { playbackState } = usePlayback({
    id: "video",
  })

  return <p>Current time: {playbackState.currentTime}</p>
}

function App2() {
  const { activate, playbackState, playback } = usePlayback({
    id: "video",
  })
  const [showDuration, setShowDuration] = useState(true)

  useEffect(() => {
    activate()
    playback.load({
      id: "video",
      src: "https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8",
    })
  }, [])

  function handleClick() {
    playback.load({
      id: "video",
      src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    })
  }

  return (
    <div id="app" className="p-4">
      <div className="border-emerald border-1 h-[400px] w-[600px]">
        <video
          className="h-full w-full"
          id="video"
          // src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          controls
        ></video>
      </div>

      <CurrenTime />
      {showDuration && <Duration />}
      <button className="block" onClick={handleClick}>
        Switch stream
      </button>
      <button
        onClick={() => {
          setShowDuration(!showDuration)
        }}
      >
        Toggle show duration
      </button>
      <pre>{JSON.stringify(playbackState.resolutions)}</pre>
    </div>
  )
}

export default App2
