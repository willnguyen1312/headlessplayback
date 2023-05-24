import { usePlayback } from "@headlessplayback/qwik"
import { hlsPlaybackPlugin } from "@headlessplayback/plugins"
import { useVisibleTask$, component$, useSignal, $, useTask$ } from "@builder.io/qwik"

const source1 = "https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8"
const source2 = "https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8"

const Duration = component$(() => {
  const { playbackState, activate } = usePlayback({
    id: "video",
  })

  useVisibleTask$(() => {
    activate()
  })

  return <p>Duration: {playbackState.duration}</p>
})

const CurrentTime = component$(() => {
  const { playbackState, activate } = usePlayback({
    id: "video",
  })

  useVisibleTask$(() => {
    activate()
  })

  return <p>Current time: {playbackState.currentTime}</p>
})

const Resolutions = component$(() => {
  const { playbackState } = usePlayback({
    id: "video",
  })

  // Plugin will inject extra state to playbackState
  // return <strong>Resolutions: {JSON.stringify(playbackState.resolutions)}</strong>
  return null
})

const App = component$(() => {
  const { activate, playbackActions, playbackState } = usePlayback({
    id: "video",
  })
  const showDuration = useSignal(true)
  const source = useSignal(source1)

  useVisibleTask$(() => {
    usePlayback.use(hlsPlaybackPlugin)

    // Activate when playback element is accessible from the DOM
    activate(() => {
      playbackActions.load?.({
        id: "video",
        source: source.value,
      })
    })
  })

  useVisibleTask$(({ track }) => {
    track(() => source.value)

    playbackActions.load?.({
      id: "video",
      source: source.value,
    })
  })

  const jumpNext5s = $(() => {
    playbackActions.setCurrentTime(playbackState.currentTime + 5)
  })

  const jumpPrev5s = $(() => {
    playbackActions.setCurrentTime(playbackState.currentTime - 5)
  })

  const toggleStreamSource = $(() => {
    if (source.value === source1) {
      source.value = source2
    } else {
      source.value = source1
    }
  })

  return (
    <div id="app" class="p-4">
      <div class="border-emerald border-1 h-[400px] w-[600px]">
        <video
          // src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          class="h-full w-full"
          id="video"
          controls
        ></video>
      </div>

      <CurrentTime />
      {showDuration.value && <Duration />}
      <Resolutions />

      <div class="flex flex-col items-start ">
        <button onClick$={toggleStreamSource}>Switch stream</button>

        <button onClick$={jumpNext5s}>Next 5s</button>
        <button onClick$={jumpPrev5s}>Prev 5s</button>
        <button
          onClick$={() => {
            showDuration.value = !showDuration.value
          }}
        >
          Toggle show duration
        </button>
      </div>
    </div>
  )
})

export default App
