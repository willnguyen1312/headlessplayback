import { createSignal, type Component, onMount, createEffect } from "solid-js"
import { usePlayback } from "@headlessplayback/solid"
import { hlsPlaybackPlugin } from "@headlessplayback/plugins"
usePlayback.use(hlsPlaybackPlugin)

const source1 = "https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8"
const source2 = "https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8"

const Duration: Component = () => {
  const { playbackState } = usePlayback({
    id: "video",
  })

  return <p>Duration: {playbackState.duration}</p>
}

function CurrenTime() {
  const playback = usePlayback({
    id: "video",
  })

  return <p>Current time: {playback.playbackState.currentTime}</p>
}

const Resolutions: Component = () => {
  const { playbackState } = usePlayback({
    id: "video",
  })

  // Plugin will inject extra state to playbackState
  return <strong>Resolutions: {JSON.stringify(playbackState.resolutions)}</strong>
}

const App: Component = () => {
  const { activate, playbackActions, playbackState } = usePlayback({
    id: "video",
  })
  const [showDuration, setShowDuration] = createSignal(true)
  const [source, setSource] = createSignal(source1)

  onMount(() => {
    // Activate when playback element is accessible from the DOM
    activate()
  })

  createEffect(() => {
    playbackActions.load({
      id: "video",
      source: source(),
    })
  })

  function jumpNext5s() {
    // Core actions and state are always available
    playbackActions.setCurrentTime(playbackState.currentTime + 5)
  }

  function jumpPrev5s() {
    playbackActions.setCurrentTime(playbackState.currentTime - 5)
  }

  function toggleStreamSource() {
    if (source() === source1) {
      setSource(source2)
    } else {
      setSource(source1)
    }
  }

  return (
    <div id="app" class="p-4">
      <div class="border-emerald border-1 h-[400px] w-[600px]">
        <video class="h-full w-full" id="video" controls></video>
      </div>

      <CurrenTime />
      {showDuration && <Duration />}
      <Resolutions />

      <div class="flex flex-col items-start ">
        <button onClick={toggleStreamSource}>Switch stream</button>

        <button onClick={jumpNext5s}>Next 5s</button>
        <button onClick={jumpPrev5s}>Prev 5s</button>
        <button
          onClick={() => {
            setShowDuration(!showDuration)
          }}
        >
          Toggle show duration
        </button>
      </div>
    </div>
  )
}

export default App
