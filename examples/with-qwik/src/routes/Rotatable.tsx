import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik"
import { usePlayback } from "@headlessplayback/qwik"
import { rotatablePlaybackPlugin } from "@headlessplayback/rotatable-plugin"

const id = "rotatable"

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

const Rotatable = component$(() => {
  const { playbackActions, playbackState, use } = usePlayback({
    id,
  })

  const videoContainerRef = useSignal<HTMLDivElement>()

  useVisibleTask$(async () => {
    await use(rotatablePlaybackPlugin)

    playbackActions.createRotatablePlayback?.({
      container: videoContainerRef.value as HTMLDivElement,
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

  const rotate = $(() => {
    playbackActions.rotate()
  })

  return (
    <>
      <div
        ref={videoContainerRef}
        class="border-fuchsia border-1 grid h-[400px] w-[600px] place-items-center"
      >
        <video
          style={{
            width: playbackState.width,
            height: playbackState.height,
            rotate: playbackState.currentRotation + "deg",
            scale: playbackState.currentScale,
          }}
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
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

        <button
          class="rounded-md bg-violet-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          onClick$={rotate}
        >
          Rotate
        </button>
      </div>
    </>
  )
})

export default Rotatable
