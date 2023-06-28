import { $, component$, useVisibleTask$ } from "@builder.io/qwik"
import { hijackPlaybackPlugin } from "@headlessplayback/hijack-plugin"
import { usePlayback } from "@headlessplayback/qwik"

const id = "hijack"

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

const Hijack = component$(() => {
  const { playbackActions, playbackState, use } = usePlayback({
    id,
  })

  useVisibleTask$(async () => {
    await use(hijackPlaybackPlugin)
    playbackActions.hijack({
      duration: 1000,
      frequency: 4,
    })
  })

  const jumpNext5s = $(() => {
    // Core actions and state are always available
    playbackActions.setCurrentTime(playbackState.currentTime + 5)
  })

  const jumpPrev5s = $(() => {
    playbackActions.setCurrentTime(playbackState.currentTime - 5)
  })

  const togglePlay = $(() => {
    if (playbackState.paused) {
      playbackActions.setPaused(false)
    } else {
      playbackActions.setPaused(true)
    }
  })

  const toggleDirection = $(() => {
    if (playbackState.direction === "forward") {
      playbackActions.setDirection({ direction: "backward" })
    } else {
      playbackActions.setDirection({ direction: "forward" })
    }
  })

  return (
    <>
      <video hidden id={id}></video>

      <CurrentTime />
      <Duration />
      <p>Direction: {playbackState.direction}</p>

      <div class="flex flex-col items-start ">
        <button onClick$={jumpNext5s}>Next 5s</button>
        <button onClick$={togglePlay}>
          {playbackState.paused ? "Play" : "Pause"}
        </button>
        <button onClick$={jumpPrev5s}>Prev 5s</button>
        <button onClick$={toggleDirection}>Toggle direction</button>
      </div>
    </>
  )
})

export default Hijack
