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

const source1 = "https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8"
const source2 = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"

function App2() {
  const { activate, playbackState, playback } = usePlayback({
    id: "video",
  })
  const [showDuration, setShowDuration] = useState(true)
  const [source, setSource] = useState(source1)

  useEffect(() => {
    activate()
    playback.load({
      id: "video",
      src: source,
    })
  }, [source])

  function handleClick() {
    if (source === source1) {
      setSource(source2)
    } else {
      setSource(source1)
    }
  }

  return (
    <div id="app" className="p-4">
      <div className="border-emerald border-1 h-[400px] w-[600px]">
        <video className="h-full w-full" id="video" controls></video>
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
