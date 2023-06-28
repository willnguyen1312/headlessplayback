import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik"
import { hlsPlaybackPlugin } from "@headlessplayback/hls-plugin"
import { usePlayback } from "@headlessplayback/qwik"

const source1 =
  "https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8"
const source2 = "https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8"
const id = "hls"

const Duration = component$(() => {
  const { playbackState } = usePlayback({
    id,
  })

  return <p>Duration: {playbackState.duration}</p>
})

const CurrentTime = component$(() => {
  const { playbackState } = usePlayback({
    id,
  })

  return <p>Current time: {playbackState.currentTime}</p>
})

const Resolutions = component$(() => {
  const { playbackState } = usePlayback({
    id,
  })

  // Plugin will inject extra state to playbackState
  return (
    <strong>
      Levels: {playbackState.levels?.map((level) => level.height).join(", ")}
    </strong>
  )
})

const Hls = component$(() => {
  const { playbackActions, playbackState, use } = usePlayback({
    id,
  })
  const source = useSignal(source1)

  useVisibleTask$(async () => {
    await use(hlsPlaybackPlugin)
  })

  useVisibleTask$(({ track }) => {
    track(() => source.value)
    playbackActions.loadHlsSource?.({
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

      <div class="flex flex-col items-start space-y-1 ">
        <button
          class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          onClick$={toggleStreamSource}
        >
          Switch stream
        </button>

        <button
          class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          onClick$={jumpNext5s}
        >
          Next 5s
        </button>
        <button
          class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          onClick$={jumpPrev5s}
        >
          Prev 5s
        </button>
      </div>
    </>
  )
})

export default Hls
