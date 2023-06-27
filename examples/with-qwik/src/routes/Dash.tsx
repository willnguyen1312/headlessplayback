import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik"
import { dashPlaybackPlugin } from "@headlessplayback/dash-plugin"
import { usePlayback } from "@headlessplayback/qwik"

const source1 = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd"
const source2 = "https://rdmedia.bbc.co.uk/elephants_dream/1/client_manifest-all.mpd"
const id = "dash"

const CurrentTime = component$(() => {
  const playback = usePlayback({
    id,
  })

  return <p>Current time: {playback.playbackState.currentTime}</p>
})

const Duration = component$(() => {
  const { playbackState } = usePlayback({
    id,
  })

  return <p>Duration: {playbackState.duration}</p>
})

const Resolutions = component$(() => {
  const { playbackState } = usePlayback({
    id,
  })

  // Plugin might inject extra state to playbackState
  return <strong>BitrateInfo: {playbackState.bitrateInfo?.map((level) => level.height).join(", ")}</strong>
})

const Dash = component$(() => {
  const { playbackActions, playbackState, use } = usePlayback({
    id,
  })
  const source = useSignal(source1)

  useVisibleTask$(async () => {
    await use(dashPlaybackPlugin)
  })

  useVisibleTask$(({ track }) => {
    track(() => source.value)
    playbackActions.loadDashSource?.({
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
    <>
      <div class="border-fuchsia border-1 h-[400px] w-[600px]">
        <video class="h-full w-full" id={id} controls></video>
      </div>

      <CurrentTime />
      <Duration />
      <Resolutions />

      <div class="flex flex-col items-start ">
        <button onClick$={toggleStreamSource}>Switch stream</button>

        <button onClick$={jumpNext5s}>Next 5s</button>
        <button onClick$={jumpPrev5s}>Prev 5s</button>
      </div>
    </>
  )
})

export default Dash
