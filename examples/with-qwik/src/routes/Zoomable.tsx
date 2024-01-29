import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik"
import { usePlayback } from "@headlessplayback/qwik"
import { zoomablePlaybackPlugin } from "@headlessplayback/zoomable-plugin"

const id = "zoomable"

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

const Zoomable = component$(() => {
  const { playbackActions, playbackState, use } = usePlayback({
    id,
  })

  const videoContainerRef = useSignal<HTMLDivElement>()

  useVisibleTask$(async () => {
    await use(zoomablePlaybackPlugin)

    playbackActions.createZoomablePlayback?.({
      container: videoContainerRef.value as HTMLDivElement,
    })

    playbackActions.setEnableZoom({
      enableZoom: true,
    })
  })

  const jumpNext5s = $(() => {
    playbackActions.setCurrentTime(playbackState.currentTime + 5)
  })

  const jumpPrev5s = $(() => {
    playbackActions.setCurrentTime(playbackState.currentTime - 5)
  })

  const togglePlayback = $(() => {
    playbackActions.setPaused(!playbackState.paused)
  })

  return (
    <>
      <div
        ref={videoContainerRef}
        class="border-fuchsia border-1 h-[337.5px] w-[600px]"
      >
        <video
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          class="h-full w-full cursor-zoom-in"
          id={id}
        ></video>
      </div>

      <CurrentTime />
      <Duration />

      <div className="flex space-x-1">
        <button
          class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          onClick$={jumpPrev5s}
        >
          Prev 5s
        </button>

        <button
          class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          onClick$={togglePlayback}
        >
          {playbackState.paused ? "Play" : "Pause"}
        </button>

        <button
          class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          onClick$={jumpNext5s}
        >
          Next 5s
        </button>
      </div>
    </>
  )
})

export default Zoomable
