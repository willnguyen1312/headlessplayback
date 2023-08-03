import { $, component$ } from "@builder.io/qwik"
import { usePlayback } from "@headlessplayback/qwik"

const id = "normal"

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

const Hls = component$(() => {
  const { playbackActions, playbackState, use } = usePlayback({
    id,
  })

  const jumpNext5s = $(() => {
    playbackActions.setCurrentTime(playbackState.currentTime + 5)
  })

  const jumpPrev5s = $(() => {
    playbackActions.setCurrentTime(playbackState.currentTime - 5)
  })

  return (
    <>
      <div class="border-fuchsia border-1 h-[400px] w-[600px]">
        <video
          src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          class="h-full w-full"
          id={id}
          controls
        ></video>
      </div>

      <CurrentTime />
      <Duration />

      <div class="flex flex-col items-start space-y-1 ">
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
