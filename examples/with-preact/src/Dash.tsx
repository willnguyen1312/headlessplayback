import { dashPlaybackPlugin } from "@headlessplayback/dash-plugin"
import { usePlayback } from "@headlessplayback/preact"
import { useEffect, useState } from "preact/hooks"
usePlayback.use(dashPlaybackPlugin)

const source1 = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd"
const source2 =
  "https://rdmedia.bbc.co.uk/elephants_dream/1/client_manifest-all.mpd"
const id = "dash"

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

const Resolutions = () => {
  const { playbackState } = usePlayback({
    id,
  })

  // Plugin might inject extra state to playbackState
  return (
    <strong>
      BitrateInfo:{" "}
      {playbackState.bitrateInfo.map((level) => level.height).join(", ")}
    </strong>
  )
}

function Dash() {
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
    playbackActions.loadDashSource({
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
      <div class="border-fuchsia border-1 h-[400px] w-[600px]">
        <video class="h-full w-full" id={id} controls></video>
      </div>

      <CurrentTime />
      <Duration />
      <Resolutions />

      <div class="flex flex-col items-start space-y-1 ">
        <button
          class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          onClick={toggleStreamSource}
        >
          Switch stream
        </button>

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

export default Dash
